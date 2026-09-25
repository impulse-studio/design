import {
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve, sep } from "node:path"

export const syncPaths = (root) => {
  const cache = join(root, "node_modules/.cache/digit-sync")
  return {
    cache,
    lock: join(cache, "lock.json"),
    journal: join(cache, "publication.json"),
    dev: join(cache, "dev.json"),
    paused: join(cache, "paused.json"),
  }
}
const read = (path) => JSON.parse(readFileSync(path, "utf8"))
export const writeMarker = (path, value, exclusive = false) => {
  const temporary = `${path}.${process.pid}.tmp`
  writeFileSync(temporary, JSON.stringify(value))
  try {
    if (exclusive) linkSync(temporary, path)
    else renameSync(temporary, path)
  } finally {
    rmSync(temporary, { force: true })
  }
}
export const isProcessAlive = (pid) => {
  if (!Number.isInteger(pid) || pid < 1) return false
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}
const inside = (root, path) => {
  const target = resolve(root, path)
  if (!target.startsWith(resolve(root) + sep))
    throw new Error(`Invalid generated path: ${path}`)
  return target
}

/** Recover before starting a new publication; a journal is kept until all outputs are installed. */
export const recoverPublication = (root) => {
  const { journal } = syncPaths(root)
  if (!existsSync(journal)) return
  const saved = read(journal)
  for (const entry of [...saved.entries].reverse()) {
    const target = inside(root, entry.path),
      backup = inside(saved.backup, entry.path)
    if (existsSync(backup)) {
      rmSync(target, { recursive: true, force: true })
      mkdirSync(dirname(target), { recursive: true })
      renameSync(backup, target)
    } else if (!entry.existed) rmSync(target, { recursive: true, force: true })
  }
  rmSync(journal)
  rmSync(saved.backup, { recursive: true, force: true })
}

export const publishArtifacts = (
  root,
  staging,
  paths,
  afterInstall = () => {}
) => {
  const location = syncPaths(root)
  mkdirSync(location.cache, { recursive: true })
  recoverPublication(root)
  for (const path of paths)
    if (!existsSync(inside(staging, path)))
      throw new Error(`Generated output missing: ${path}`)
  const backup = mkdtempSync(join(location.cache, "previous-"))
  const entries = paths.map((path) => ({
    path,
    existed: existsSync(inside(root, path)),
  }))
  writeMarker(location.journal, { backup, entries })
  try {
    for (const [index, entry] of entries.entries()) {
      const target = inside(root, entry.path)
      if (entry.existed) {
        const previous = inside(backup, entry.path)
        mkdirSync(dirname(previous), { recursive: true })
        renameSync(target, previous)
      }
      mkdirSync(dirname(target), { recursive: true })
      renameSync(inside(staging, entry.path), target)
      afterInstall(entry.path, index)
    }
    rmSync(location.journal)
    rmSync(backup, { recursive: true, force: true })
  } catch (error) {
    recoverPublication(root)
    throw error
  }
}

export const prepareSyncWorkspace = (root) => {
  const location = syncPaths(root)
  mkdirSync(location.cache, { recursive: true })
  return mkdtempSync(join(location.cache, "staging-"))
}
export const copyPreviousArtifact = (root, staging, path) => {
  const source = inside(root, path)
  if (!existsSync(source)) return
  const target = inside(staging, path)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(source, target, { recursive: true })
}

export const acquireSyncLock = async (root) => {
  const location = syncPaths(root)
  mkdirSync(location.cache, { recursive: true })
  if (existsSync(location.lock)) {
    if (isProcessAlive(read(location.lock).pid))
      throw new Error("Une synchronisation Digi est déjà en cours.")
    rmSync(location.lock)
  }
  writeMarker(location.lock, { pid: process.pid }, true)
  try {
    const started = Date.now()
    while (existsSync(location.dev)) {
      const { pid } = read(location.dev)
      if (
        !isProcessAlive(pid) ||
        (existsSync(location.paused) && read(location.paused).pid === pid)
      )
        break
      if (Date.now() - started > 15_000)
        throw new Error(
          "Le studio n’a pas confirmé sa suspension. Aucune sortie n’a été publiée."
        )
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    recoverPublication(root)
    return () => rmSync(location.lock, { force: true })
  } catch (error) {
    rmSync(location.lock, { force: true })
    throw error
  }
}

/** Development readers acknowledge suspension before a sync may publish. */
export const createDevelopmentCoordinator = (root, { pause, resume }) => {
  const location = syncPaths(root)
  let paused = true
  let pending = Promise.resolve()
  return () => {
    pending = pending.then(async () => {
      if (existsSync(location.lock)) {
        if (!paused) {
          paused = true
          await pause()
        }
        if (isProcessAlive(read(location.lock).pid)) {
          if (!existsSync(location.paused))
            writeMarker(location.paused, { pid: process.pid })
          return
        }
        recoverPublication(root)
        rmSync(location.lock, { force: true })
      }
      if (paused) {
        recoverPublication(root)
        rmSync(location.paused, { force: true })
        paused = false
        await resume()
      }
    })
    return pending
  }
}

export const verifyDigiArtifacts = (root) => {
  const manifest = read(join(root, "manifest/manifest.json"))
  const snapshots = read(
    join(root, "renderer/src/digicomponents.react.generated.json")
  )
  const reactSnapshots = read(
    join(root, "packages/digicomponents-react/src/snapshots.generated.json")
  )
  if (
    !manifest.orchestrationSha ||
    snapshots.orchestrationSha !== manifest.orchestrationSha ||
    reactSnapshots.orchestrationSha !== manifest.orchestrationSha ||
    JSON.stringify(snapshots) !== JSON.stringify(reactSnapshots)
  )
    throw new Error(
      "Les sorties Digi ne proviennent pas de la même génération."
    )
  const known = new Set(manifest.components.map((entry) => entry.name))
  const exports = readFileSync(
    join(root, "packages/digicomponents-react/src/index.ts"),
    "utf8"
  )
  const record = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value)
  const strings = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === "string")
  const node = (value) =>
    record(value) &&
    (value.type === "text"
      ? typeof value.text === "string"
      : value.type === "element" &&
        typeof value.tag === "string" &&
        record(value.attributes) &&
        Object.values(value.attributes).every(
          (item) => typeof item === "string"
        ) &&
        Array.isArray(value.children) &&
        value.children.every(node))
  for (const name of Object.keys(snapshots.components)) {
    if (
      !known.has(name) ||
      !exports.includes(`from "./components/${name}"`) ||
      !existsSync(
        join(root, `packages/digicomponents-react/src/components/${name}.tsx`)
      )
    )
      throw new Error(`Export Digi incohérent : ${name}`)
    const snapshot = snapshots.components[name]
    if (
      !record(snapshot) ||
      !strings(snapshot.slots) ||
      !strings(snapshot.textProps) ||
      !record(snapshot.defaults) ||
      !Array.isArray(snapshot.variants) ||
      !snapshot.variants.every(
        (variant) =>
          record(variant.props) &&
          typeof variant.html === "string" &&
          Array.isArray(variant.tree) &&
          variant.tree.every(node)
      )
    )
      throw new Error(`Snapshot Digi invalide : ${name}`)
  }
  return manifest
}
