import { spawn } from "node:child_process"

const build = spawn("pnpm", ["build:renderer"], { stdio: "inherit" })
build.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1)
  const renderer = spawn("pnpm", ["--filter", "@digit-ai-studio/renderer", "exec", "vite", "build", "--watch"], { stdio: "inherit" })
  const studio = spawn("pnpm", ["dev:studio"], { stdio: "inherit" })
  const stop = () => { renderer.kill(); studio.kill() }
  process.on("SIGINT", stop)
  process.on("SIGTERM", stop)
  studio.on("exit", (status) => { renderer.kill(); process.exit(status ?? 0) })
})
