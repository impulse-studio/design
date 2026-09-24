import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Must match RENDERER_PATH in packages/shared (not imported: Node loads this file without the TS bundler).
const RENDERER_PATH = "/renderer/"
const RENDERER_DEV_URL = "http://localhost:3401"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // In dev, frames load the renderer's own Vite server through this proxy so they stay same-origin.
  server: { proxy: { [RENDERER_PATH]: { target: RENDERER_DEV_URL, ws: true } } },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
