#!/usr/bin/env node
// Syncs the Digitevent component library and the backoffice shell files into the renderer.
// Usage: node scripts/sync-digicomponents.mjs [--orchestration ../orchestration] [--skip-build]
import { execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const argValue = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}

const orchestration = resolve(root, argValue("--orchestration") ?? "../orchestration")
const libDir = join(orchestration, "lib/digicomponents")
const backSrc = join(orchestration, "back/src")
const vendorDir = join(root, "renderer/vendor/digicomponents")
const backVendorDir = join(root, "renderer/src/back")

if (!existsSync(libDir)) {
  console.error(`digicomponents not found at ${libDir}`)
  process.exit(1)
}

const sha = execSync("git rev-parse HEAD", { cwd: orchestration }).toString().trim()
const dirty = execSync("git status --porcelain -- lib/digicomponents back/src", { cwd: orchestration })
  .toString()
  .trim()
if (dirty) console.warn("⚠ orchestration has uncommitted changes in lib/digicomponents or back/src")

if (!args.includes("--skip-build")) {
  console.log("→ building digicomponents…")
  execSync("pnpm exec vite build", { cwd: libDir, stdio: "inherit" })
}

console.log("→ copying dist")
rmSync(vendorDir, { recursive: true, force: true })
mkdirSync(vendorDir, { recursive: true })
cpSync(join(libDir, "dist"), vendorDir, {
  recursive: true,
  // type declarations are only needed by the manifest generator, not at runtime
  filter: (src) => !src.includes(`${join(libDir, "dist")}/src`),
})

console.log("→ copying backoffice shell files")
const shellFiles = JSON.parse(readFileSync(join(root, "renderer/shell-files.json"), "utf8"))
for (const rel of shellFiles.files) {
  const from = join(backSrc, rel)
  const to = join(backVendorDir, rel)
  if (!existsSync(from)) {
    console.warn(`  ⚠ missing in back: ${rel}`)
    continue
  }
  mkdirSync(dirname(to), { recursive: true })
  cpSync(from, to, { recursive: true })
}

writeFileSync(
  join(root, "renderer/vendor/sync.json"),
  JSON.stringify({ orchestrationSha: sha, dirty: Boolean(dirty), syncedAt: new Date().toISOString() }, null, 2) + "\n",
)
console.log(`✓ synced digicomponents @ ${sha.slice(0, 10)}${dirty ? " (dirty)" : ""}`)
