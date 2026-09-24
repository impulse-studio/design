import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

const vendor = (path: string) => fileURLToPath(new URL(`./vendor/digicomponents/${path}`, import.meta.url))

// Built into the studio's public folder so frames load it from the same origin (/renderer/).
export default defineConfig({
  base: "/renderer/",
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^digicomponents\/dist\/variables$/, replacement: vendor("variables.scss") },
      { find: /^digicomponents\/dist\/style\.css$/, replacement: vendor("style.css") },
      { find: /^digicomponents$/, replacement: vendor("index.js") },
      // Backoffice files copied by scripts/sync-digicomponents.mjs keep their '@/' imports.
      { find: /^@\//, replacement: fileURLToPath(new URL("./src/back/", import.meta.url)) },
      { find: /^~\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) },
    ],
    dedupe: ["vue", "vue-router"],
  },
  build: {
    outDir: fileURLToPath(new URL("../public/renderer", import.meta.url)),
    emptyOutDir: true,
  },
})
