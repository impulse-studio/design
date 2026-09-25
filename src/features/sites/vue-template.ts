import type { SiteDocument } from "./schema"

export const vueTemplate: SiteDocument = {
  kind: "vue-vite", version: 1, assets: {}, dependencies: { vue: "3.5.43" }, routes: [{path: "/", name: "Accueil"}], visual: [],
  files: {
    "package.json": JSON.stringify({ name: "vue-vite-site", private: true, type: "module", scripts: {dev: "vite --host 127.0.0.1", build: "vue-tsc --noEmit && vite build", typecheck: "vue-tsc --noEmit", preview: "vite preview"}, dependencies: {vue: "3.5.43"}, devDependencies: {vite: "^8.0.0", "@vitejs/plugin-vue": "^6.0.0", typescript: "^6.0.0", "vue-tsc": "^3.3.0"}}, null, 2),
    "index.html": '<!doctype html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Site</title></head><body><div id="root"></div><script type="module" src="/src/main.ts"></script></body></html>',
    "vite.config.ts": 'import { defineConfig } from "vite"; import vue from "@vitejs/plugin-vue"; export default defineConfig({ plugins: [vue()], resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } } });',
    "tsconfig.json": JSON.stringify({include:["src", "vite.config.ts"], compilerOptions:{target:"ES2022",lib:["ES2022","DOM","DOM.Iterable"],module:"ESNext",moduleResolution:"bundler",strict:true,skipLibCheck:true,noEmit:true,resolveJsonModule:true,allowImportingTsExtensions:true,paths:{"@/*":["./src/*"]}}},null,2),
    "src/vite-env.d.ts": '/// <reference types="vite/client" />',
    "src/main.ts": 'import { createApp } from "vue"; import App from "./App.vue"; import "./base.css"; import "./styles.css"; import "./visual.css"; createApp(App).mount("#root");',
    "src/App.vue": '<script setup lang="ts">\n</script>\n<template><main aria-label="Page"></main></template>',
    "src/base.css": '*{box-sizing:border-box}body{margin:0}#root{min-height:100vh}',
    "src/styles.css": '', "src/visual.css": '',
  },
}
