import { createServer } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"
const project = fileURLToPath(new URL("../../", import.meta.url))
const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL("./canvas-benchmark/", import.meta.url)),
  publicDir: `${project}public`,
  plugins: [tailwindcss(), react()],
  resolve: { alias: { "@": `${project}src` } },
  server: {
    host: "127.0.0.1",
    port: 3403,
    strictPort: true,
    fs: { allow: [project] },
  },
})
await server.listen()
server.printUrls()
