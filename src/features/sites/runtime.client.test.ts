import { beforeEach, describe, expect, it, vi } from "vitest"
import { createSiteDocument } from "./document.fixture"

const mocks = vi.hoisted(() => {
  let serverReady: ((_port: number, url: string) => void) | undefined
  const devProcesses: Array<{
    crash: (code: number, output?: string) => void
  }> = []
  const closedOutput = () =>
    new ReadableStream<string>({
      start(controller) {
        controller.close()
      },
    })
  const process = () => ({
    exit: Promise.resolve(0),
    input: new WritableStream<string>(),
    output: closedOutput(),
    kill: vi.fn(),
    resize: vi.fn(),
  })
  const devProcess = () => {
    let close!: (code: number, output?: string) => void
    let output!: ReadableStream<string>
    const exit = new Promise<number>((resolve) => {
      output = new ReadableStream<string>({
        start(controller) {
          close = (code, log) => {
            if (log) controller.enqueue(log)
            controller.close()
            resolve(code)
          }
        },
      })
    })
    const kill = vi.fn(() => close(0))
    devProcesses.push({ crash: close })
    return {
      exit,
      input: new WritableStream<string>(),
      output,
      kill,
      resize: vi.fn(),
    }
  }
  const container = {
    mount: vi.fn().mockResolvedValue(undefined),
    fs: {
      mkdir: vi.fn().mockResolvedValue(""),
      rm: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue('{"lockfileVersion":3}'),
    },
    on: vi.fn(
      (event: string, listener: (_port: number, url: string) => void) => {
        if (event === "server-ready") serverReady = listener
        return vi.fn()
      }
    ),
    spawn: vi.fn(async (_command: string, args: string[]) => {
      if (args.includes("dev")) {
        queueMicrotask(() => serverReady?.(5173, "https://preview.test"))
        return devProcess()
      }
      return process()
    }),
  }
  return {
    boot: vi.fn().mockResolvedValue(container),
    container,
    devProcesses,
    reset: () => {
      serverReady = undefined
      devProcesses.length = 0
    },
  }
})

vi.mock("@webcontainer/api", () => ({
  WebContainer: { boot: mocks.boot },
}))

const enableRuntime = (isolated = true) => {
  Object.defineProperty(globalThis, "isSecureContext", {
    configurable: true,
    value: true,
  })
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    configurable: true,
    value: isolated,
  })
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {},
  })
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  mocks.reset()
  enableRuntime()
})

describe("site WebContainer runtime", () => {
  it("boots once, installs dependencies, starts Vite and syncs files with HMR", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument()
    const statuses: string[] = []

    await expect(
      siteRuntime.start(doc, undefined, (status) => statuses.push(status.stage))
    ).resolves.toBe("https://preview.test")

    expect(mocks.boot).toHaveBeenCalledWith(
      expect.objectContaining({ coep: "credentialless" })
    )
    expect(mocks.container.mount).toHaveBeenCalledOnce()
    expect(mocks.container.spawn).toHaveBeenCalledWith(
      "npm",
      expect.arrayContaining(["install"])
    )
    expect(statuses).toEqual([
      "initializing",
      "installing",
      "starting",
      "ready",
    ])

    const changed = structuredClone(doc)
    changed.files["src/App.tsx"] =
      "export function App(){return <main>Local</main>}"
    await siteRuntime.sync(changed)

    expect(mocks.container.fs.writeFile).toHaveBeenCalledWith(
      "src/App.tsx",
      expect.stringContaining("Local")
    )
    expect(
      mocks.container.spawn.mock.calls.filter(([, args]) =>
        args.includes("install")
      )
    ).toHaveLength(1)

    const withDependency = structuredClone(changed)
    const packageJson = JSON.parse(withDependency.files["package.json"])
    packageJson.dependencies.zod = "4.6.5"
    withDependency.files["package.json"] = JSON.stringify(packageJson)
    await siteRuntime.sync(withDependency)
    expect(
      mocks.container.spawn.mock.calls.filter(([, args]) =>
        args.includes("install")
      )
    ).toHaveLength(2)
  })

  it("mounts the Vue entrypoint with the ephemeral Studio bridge", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument("vue-vite")
    await siteRuntime.start(
      doc,
      {
        token: "preview-token",
        revision: 2,
        path: "/",
        editing: true,
        hostOrigin: "https://studio.test",
      },
      () => undefined
    )
    const tree = mocks.container.mount.mock.calls[0][0]
    expect(tree.src.directory["main.ts"].file.contents).toContain(
      'import "../studio-bridge"'
    )
    expect(tree["studio-bridge.ts"].file.contents).toContain(
      "https://studio.test"
    )
  })

  it("runs the project build locally before persistence", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument()
    await siteRuntime.start(doc, undefined, () => undefined)
    await siteRuntime.validate(doc)
    expect(mocks.container.spawn).toHaveBeenCalledWith("npm", ["run", "build"])
  })

  it("returns a useful diagnostic without cross-origin isolation", async () => {
    enableRuntime(false)
    const { siteRuntime } = await import("./runtime.client")
    await expect(
      siteRuntime.start(createSiteDocument(), undefined, () => undefined)
    ).rejects.toThrow("isolation cross-origin")
    expect(mocks.boot).not.toHaveBeenCalled()
  })

  it("reports a Vite exit after readiness and restarts it on sync", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument()
    const statuses: Array<{ stage: string; message: string }> = []
    await siteRuntime.start(doc, undefined, (status) => statuses.push(status))

    mocks.devProcesses[0].crash(1, "Vite crashed after startup")
    await vi.waitFor(() =>
      expect(statuses.at(-1)).toMatchObject({
        stage: "error",
        message: expect.stringContaining("Vite crashed"),
      })
    )

    const changed = structuredClone(doc)
    changed.files["src/App.tsx"] =
      "export function App(){return <main>Restarted</main>}"
    await expect(siteRuntime.sync(changed)).resolves.toBe(
      "https://preview.test"
    )
    expect(mocks.devProcesses).toHaveLength(2)
    expect(statuses.at(-1)?.stage).toBe("ready")
  })

  it("prepares and validates an export in an isolated directory without changing the preview", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument()
    await siteRuntime.start(doc, undefined, () => undefined)
    const changed = structuredClone(doc)
    changed.files["src/scenarios.json"] = '{"selected":"example"}'
    const stages: string[] = []
    const output = await siteRuntime.prepareExport(changed, (stage) =>
      stages.push(stage)
    )
    expect(stages).toEqual(["installing", "building"])
    expect(mocks.container.mount).toHaveBeenLastCalledWith(expect.any(Object), {
      mountPoint: ".studio-export",
    })
    expect(mocks.container.spawn).toHaveBeenCalledWith(
      "npm",
      ["ci", "--no-audit", "--no-fund"],
      { cwd: ".studio-export" }
    )
    expect(mocks.container.spawn).toHaveBeenCalledWith(
      "npm",
      ["run", "build"],
      { cwd: ".studio-export" }
    )
    expect(output.files["package-lock.json"]).toBe('{"lockfileVersion":3}')
    expect(output.files["pnpm-lock.yaml"]).toBeUndefined()
    expect(output.files["src/scenarios.json"]).toContain("example")
    expect(output.files["src/main.tsx"]).not.toContain("studio-bridge")
    expect(output.files["README.md"]).toContain("npm ci")
    expect(mocks.container.fs.writeFile).not.toHaveBeenCalled()
    expect(mocks.container.fs.rm).toHaveBeenLastCalledWith(".studio-export", {
      recursive: true,
      force: true,
    })
  })

  it("cleans a failed export and permits a later retry", async () => {
    const { siteRuntime } = await import("./runtime.client")
    const doc = createSiteDocument()
    mocks.container.spawn.mockRejectedValueOnce(
      new Error("Registry indisponible")
    )
    await expect(
      siteRuntime.prepareExport(doc, () => undefined)
    ).rejects.toThrow("Registry indisponible")
    expect(mocks.container.fs.rm).toHaveBeenLastCalledWith(".studio-export", {
      recursive: true,
      force: true,
    })
    await expect(
      siteRuntime.prepareExport(doc, () => undefined)
    ).resolves.toMatchObject({
      files: { "package-lock.json": '{"lockfileVersion":3}' },
    })
  })
})
