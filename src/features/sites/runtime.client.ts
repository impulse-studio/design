import { WebContainer } from "@webcontainer/api"
import type { FileSystemTree, WebContainerProcess } from "@webcontainer/api"
import { bridgeSource } from "./bridge"
import { projectFiles } from "./project"
import type { SiteDocument } from "@/validators/sites/document"
import type { SitePreviewContext, SiteRuntimeStatus } from "./runtime"

type RuntimeFile = string | Uint8Array

const entryPath = (doc: SiteDocument) =>
  doc.kind === "vue-vite" ? "src/main.ts" : "src/main.tsx"

const decodeAsset = (base64: string) =>
  Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))

const runtimeFiles = (
  doc: SiteDocument,
  preview?: SitePreviewContext
): Map<string, RuntimeFile> => {
  const files = new Map<string, RuntimeFile>(Object.entries(projectFiles(doc)))
  for (const [path, asset] of Object.entries(doc.assets))
    files.set(path, decodeAsset(asset.base64))
  if (preview) {
    const main = entryPath(doc)
    files.set(
      "studio-bridge.ts",
      "// @ts-nocheck\n" +
        bridgeSource(
          preview.token,
          preview.revision,
          preview.path,
          preview.editing,
          Boolean(
            doc.files[
              doc.kind === "vue-vite"
                ? "src/routes/router.ts"
                : "src/routes/router.tsx"
            ]
          ),
          doc.kind,
          preview.hostOrigin
        )
    )
    files.set(main, `import "../studio-bridge";\n${doc.files[main] ?? ""}`)
  }
  return files
}

const fileTree = (files: Map<string, RuntimeFile>) => {
  const root: FileSystemTree = {}
  for (const [path, contents] of files) {
    const parts = path.split("/")
    let directory = root
    for (const part of parts.slice(0, -1)) {
      if (!Object.hasOwn(directory, part)) directory[part] = { directory: {} }
      else if (!("directory" in directory[part]))
        directory[part] = { directory: {} }
      directory = directory[part].directory
    }
    directory[parts.at(-1)!] = { file: { contents } }
  }
  return root
}

const sameFile = (left: RuntimeFile | undefined, right: RuntimeFile) => {
  if (typeof left === "string" || typeof right === "string")
    return left === right
  if (!left || left.length !== right.length) return false
  return left.every((value, index) => value === right[index])
}

const unsupportedReason = () => {
  if (!globalThis.isSecureContext)
    return "L’éditeur local nécessite HTTPS ou localhost."
  if (!globalThis.crossOriginIsolated)
    return "L’isolation cross-origin est absente. Rechargez la page dans Chrome ou Edge."
  if (typeof WebAssembly === "undefined")
    return "WebAssembly est désactivé dans ce navigateur."
  if (!("serviceWorker" in navigator))
    return "Les Service Workers sont désactivés dans ce navigateur."
  return null
}

const processOutput = async (process: WebContainerProcess) => {
  const reader = process.output.getReader()
  let output = ""
  try {
    for (;;) {
      const result = await reader.read()
      if (result.done) break
      output = (output + result.value).slice(-8_000)
    }
  } finally {
    reader.releaseLock()
  }
  return output
}

const waitForExit = async (
  process: WebContainerProcess,
  timeout: number,
  label: string
) => {
  const output = processOutput(process)
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const expired = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      process.kill()
      reject(new Error(`${label} a dépassé le délai autorisé.`))
    }, timeout)
  })
  try {
    const code = await Promise.race([process.exit, expired])
    const logs = await output
    if (code !== 0)
      throw new Error(logs.trim() || `${label} a échoué avec le code ${code}.`)
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

class SiteRuntime {
  private container: Promise<WebContainer> | null = null
  private devProcess: WebContainerProcess | null = null
  private files = new Map<string, RuntimeFile>()
  private packageJson = ""
  private packageLock: string | undefined
  private preview: SitePreviewContext | undefined
  private queue: Promise<unknown> = Promise.resolve()
  private readyUrl = ""
  private runtimeError: Error | null = null
  private onStatus: ((status: SiteRuntimeStatus) => void) | null = null

  private enqueue<T>(task: () => Promise<T>) {
    const result = this.queue.then(task, task)
    this.queue = result.then(
      () => undefined,
      () => undefined
    )
    return result
  }

  private async boot() {
    const reason = unsupportedReason()
    if (reason) throw new Error(reason)
    this.container ??= WebContainer.boot({
      coep: "credentialless",
      forwardPreviewErrors: "exceptions-only",
      workdirName: "digit-site",
    })
    return this.container
  }

  private async replaceFiles(
    container: WebContainer,
    next: Map<string, RuntimeFile>
  ) {
    if (!this.files.size) {
      await container.mount(fileTree(next))
      this.files = next
      return
    }
    for (const path of this.files.keys())
      if (!next.has(path)) await container.fs.rm(path, { force: true })
    for (const [path, contents] of next)
      if (!sameFile(this.files.get(path), contents)) {
        const slash = path.lastIndexOf("/")
        if (slash > 0)
          await container.fs.mkdir(path.slice(0, slash), { recursive: true })
        await container.fs.writeFile(path, contents)
      }
    this.files = next
  }

  private async install(container: WebContainer, packageJson: string) {
    if (packageJson === this.packageJson) return
    const process = await container.spawn("npm", [
      "install",
      "--no-audit",
      "--no-fund",
    ])
    await waitForExit(process, 120_000, "L’installation des dépendances")
    this.packageLock = await container.fs.readFile("package-lock.json", "utf8")
    this.packageJson = packageJson
  }

  private async startServer(container: WebContainer) {
    const previous = this.devProcess
    this.devProcess = null
    previous?.kill()
    this.readyUrl = ""
    this.runtimeError = null
    const ready = new Promise<string>((resolve) => {
      const unsubscribe = container.on("server-ready", (_port, url) => {
        unsubscribe()
        resolve(url)
      })
    })
    this.devProcess = await container.spawn("npm", [
      "run",
      "dev",
      "--",
      "--host",
      "0.0.0.0",
    ])
    const devProcess = this.devProcess
    const output = processOutput(devProcess)
    const exited = devProcess.exit.then(async (code) => {
      const logs = await output
      throw new Error(
        logs.trim() || `Le serveur Vite s’est arrêté avec le code ${code}.`
      )
    })
    void exited.catch((error: Error) => {
      if (this.devProcess !== devProcess) return
      this.devProcess = null
      this.readyUrl = ""
      this.runtimeError = error
      this.onStatus?.({ stage: "error", message: error.message })
    })
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const expired = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        this.devProcess?.kill()
        reject(new Error("Le serveur Vite ne répond pas."))
      }, 30_000)
    })
    try {
      this.readyUrl = await Promise.race([ready, exited, expired])
      return this.readyUrl
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  start(
    doc: SiteDocument,
    preview: SitePreviewContext | undefined,
    onStatus: (status: SiteRuntimeStatus) => void
  ) {
    return this.enqueue(async () => {
      try {
        this.onStatus = onStatus
        onStatus({ stage: "initializing", message: "Initialisation…" })
        const container = await this.boot()
        const next = runtimeFiles(doc, preview)
        const packageJson = String(next.get("package.json") ?? "")
        const packageChanged = packageJson !== this.packageJson
        await this.replaceFiles(container, next)
        this.preview = preview
        if (packageChanged) {
          onStatus({
            stage: "installing",
            message: "Installation des dépendances…",
          })
          await this.install(container, packageJson)
        }
        onStatus({ stage: "starting", message: "Démarrage de Vite…" })
        const url = await this.startServer(container)
        onStatus({ stage: "ready", message: "Prêt" })
        return url
      } catch (error) {
        onStatus({
          stage: "error",
          message: error instanceof Error ? error.message : String(error),
        })
        throw error
      }
    })
  }

  sync(doc: SiteDocument, preview = this.preview) {
    return this.enqueue(async () => {
      try {
        const container = await this.boot()
        const next = runtimeFiles(doc, preview)
        const packageJson = String(next.get("package.json") ?? "")
        const packageChanged = packageJson !== this.packageJson
        await this.replaceFiles(container, next)
        this.preview = preview
        const restart =
          packageChanged ||
          this.runtimeError !== null ||
          this.devProcess === null ||
          !this.readyUrl
        if (packageChanged) await this.install(container, packageJson)
        if (restart) {
          this.onStatus?.({
            stage: "starting",
            message: "Redémarrage de Vite…",
          })
          await this.startServer(container)
          this.onStatus?.({ stage: "ready", message: "Prêt" })
        }
        return this.readyUrl
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        this.onStatus?.({ stage: "error", message })
        throw error
      }
    })
  }

  validate(doc: SiteDocument) {
    return this.enqueue(async () => {
      const container = await this.boot()
      const next = runtimeFiles(doc, this.preview)
      await this.replaceFiles(container, next)
      await this.install(container, String(next.get("package.json") ?? ""))
      const process = await container.spawn("npm", ["run", "build"])
      await waitForExit(process, 60_000, "La compilation locale")
    })
  }

  dispose() {
    return this.enqueue(async () => {
      const process = this.devProcess
      this.devProcess = null
      process?.kill()
      this.readyUrl = ""
      this.runtimeError = null
      this.preview = undefined
      this.onStatus = null
    })
  }

  prepareExport(
    doc: SiteDocument,
    onStage: (stage: "installing" | "building") => void
  ) {
    return this.enqueue(async () => {
      const container = await this.boot()
      const directory = ".studio-export"
      const files = runtimeFiles(doc)
      const installedLock =
        files.get("package.json") === this.packageJson
          ? this.packageLock
          : undefined
      if (installedLock) files.set("package-lock.json", installedLock)
      await container.fs.rm(directory, { recursive: true, force: true })
      await container.fs.mkdir(directory, { recursive: true })
      try {
        await container.mount(fileTree(files), { mountPoint: directory })
        onStage("installing")
        const install = await container.spawn(
          "npm",
          [installedLock ? "ci" : "install", "--no-audit", "--no-fund"],
          { cwd: directory }
        )
        await waitForExit(install, 120_000, "La préparation de l’export")
        onStage("building")
        const build = await container.spawn("npm", ["run", "build"], {
          cwd: directory,
        })
        await waitForExit(build, 60_000, "La vérification de l’export")
        const lock = await container.fs.readFile(
          `${directory}/package-lock.json`,
          "utf8"
        )
        const output = projectFiles(doc)
        output["package-lock.json"] = lock
        output["README.md"] = (output["README.md"] ?? "# Site\n")
          .replace(/pnpm install(?: --frozen-lockfile)?/g, "npm ci")
          .replace(/pnpm (dev|build|preview)/g, "npm run $1")
        return { ...doc, files: output }
      } finally {
        await container.fs.rm(directory, { recursive: true, force: true })
      }
    })
  }
}

export const siteRuntime = new SiteRuntime()
