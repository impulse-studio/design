import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, rmSync, watch } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  createDevelopmentCoordinator,
  isProcessAlive,
  syncPaths,
  writeMarker,
} from "../libraries/sync-publication.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const location = syncPaths(root)
mkdirSync(location.cache, { recursive: true })
if (
  existsSync(location.dev) &&
  isProcessAlive(JSON.parse(readFileSync(location.dev, "utf8")).pid)
) {
  throw new Error("Un serveur de développement est déjà actif dans ce dossier.")
}
rmSync(location.dev, { force: true })
rmSync(location.paused, { force: true })
writeMarker(location.dev, { pid: process.pid }, true)
const children = new Set()
let epoch = 0
let closed = false
const launch = (args) => {
  const child = spawn("pnpm", args, {
    cwd: root,
    stdio: "inherit",
    detached: process.platform !== "win32",
  })
  children.add(child)
  child.once("exit", () => children.delete(child))
  child.once("error", (error) => {
    children.delete(child)
    console.error(error)
    void shutdown(1)
  })
  return child
}
const signal = (child, value) => {
  try {
    if (process.platform === "win32") child.kill(value)
    else process.kill(-child.pid, value)
  } catch (error) {
    if (error.code !== "ESRCH") throw error
  }
}
const stop = async () => {
  epoch += 1
  await Promise.all(
    [...children].map(
      (child) =>
        new Promise((resolveStopped) => {
          const timeout = setTimeout(() => signal(child, "SIGKILL"), 5_000)
          child.once("exit", () => {
            clearTimeout(timeout)
            resolveStopped()
          })
          signal(child, "SIGTERM")
        })
    )
  )
}
const start = () => {
  if (closed) return
  const generation = ++epoch
  const build = launch(["build:renderer"])
  build.once("exit", (code) => {
    if (closed || generation !== epoch) return
    if (code !== 0) {
      void shutdown(code ?? 1)
      return
    }
    launch([
      "--filter",
      "@digit-ai-studio/renderer",
      "exec",
      "vite",
      "build",
      "--watch",
    ])
    const studio = launch(["dev:studio"])
    studio.once("exit", (status) => {
      if (!closed && generation === epoch) void shutdown(status ?? 0)
    })
  })
}
const reconcile = createDevelopmentCoordinator(root, {
  pause: stop,
  resume: start,
})
const coordinate = () => {
  if (!closed)
    void reconcile().catch((error) => {
      console.error(error)
      void shutdown(1)
    })
}
const watcher = watch(location.cache, coordinate)
const timer = setInterval(coordinate, 1_000)
const shutdown = async (status) => {
  if (closed) return
  closed = true
  watcher.close()
  clearInterval(timer)
  await stop()
  rmSync(location.dev, { force: true })
  rmSync(location.paused, { force: true })
  process.exit(status)
}
process.on("SIGINT", () => {
  void shutdown(0)
})
process.on("SIGTERM", () => {
  void shutdown(0)
})
coordinate()
