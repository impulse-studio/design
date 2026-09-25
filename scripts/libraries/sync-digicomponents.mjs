#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { vendorDependencies } from "../generation/vendor-dependencies.mjs"
import {
  acquireSyncLock,
  prepareSyncWorkspace,
  copyPreviousArtifact,
  publishArtifacts,
  verifyDigiArtifacts,
} from "./sync-publication.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const options = parseArguments(process.argv.slice(2))

if (options.help) {
  printUsage()
  process.exit(0)
}

const orchestration = resolve(root, options.orchestration ?? "../orchestration")
const library = join(orchestration, "lib/digicomponents")
const distribution = join(library, "dist")
const backSource = join(orchestration, "back/src")
const generator = join(
  root,
  "scripts/generation/generate-digicomponents-manifest.mjs"
)

assertDirectory(library, "digicomponents", library)
assertDirectory(backSource, "back/src", backSource)

const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: orchestration,
  encoding: "utf8",
}).trim()
const dirtyFiles = execFileSync(
  "git",
  ["status", "--porcelain", "--", "lib/digicomponents", "back/src"],
  {
    cwd: orchestration,
    encoding: "utf8",
  }
).trim()

if (dirtyFiles) {
  console.warn(
    "⚠ orchestration has uncommitted changes in lib/digicomponents or back/src"
  )
}

if (!options.skipBuild) {
  console.log("→ building digicomponents…")
  execFileSync("pnpm", ["run", "build"], { cwd: library, stdio: "inherit" })
}

assertFile(join(distribution, "index.js"), "digicomponents build output")
assertFile(join(distribution, "style.css"), "digicomponents stylesheet")
assertFile(join(library, "src/style/main.css"), "digicomponents source tokens")

const release = await acquireSyncLock(root)
let staging
try {
  staging = prepareSyncWorkspace(root)
  copyPreviousArtifact(root, staging, "manifest/CHANGELOG.md")
  if (!options.componentsOnly)
    copyPreviousArtifact(root, staging, "renderer/src/back")
  const componentVendor = join(staging, "renderer/vendor/digicomponents")
  const shellTarget = join(staging, "renderer/src/back")
  console.log("→ copying dist")
  rmSync(componentVendor, { recursive: true, force: true })
  mkdirSync(componentVendor, { recursive: true })
  cpSync(distribution, componentVendor, {
    recursive: true,
    filter: (source) => {
      const rel = relative(distribution, source)
      const firstPathPart = rel.split(sep)[0]
      return firstPathPart !== "src" && firstPathPart !== "node_modules"
    },
  })
  vendorDependencies(distribution, componentVendor)
  mkdirSync(join(staging, "packages/digicomponents-react"), { recursive: true })
  cpSync(
    join(distribution, "style.css"),
    join(staging, "packages/digicomponents-react/style.css")
  )

  const shellConfigPath = join(root, "renderer/shell-files.json")
  const shellConfig = JSON.parse(readFileSync(shellConfigPath, "utf8"))
  const syncMetadataPath = join(staging, "renderer/vendor/sync.json")
  const previousSync = readJsonIfPresent(
    join(root, "renderer/vendor/sync.json")
  )
  if (!options.componentsOnly) {
    console.log("→ copying backoffice shell files")
    const shellFiles = [
      ...new Set([...(previousSync.shellFiles ?? []), ...shellConfig.files]),
    ]

    for (const file of shellFiles) {
      const target = resolveInside(shellTarget, file)
      rmSync(target, { recursive: true, force: true })
    }

    for (const file of shellConfig.files) {
      const source = resolveInside(backSource, file)
      const target = resolveInside(shellTarget, file)
      assertExists(source, `shell source ${file}`)
      mkdirSync(dirname(target), { recursive: true })
      cpSync(source, target, { recursive: true, force: true })
    }
  }

  console.log("→ generating manifest")
  execFileSync(
    process.execPath,
    [
      generator,
      "--orchestration",
      orchestration,
      "--sha",
      sourceSha,
      "--output-root",
      staging,
    ],
    {
      cwd: root,
      stdio: "inherit",
    }
  )
  execFileSync(
    process.execPath,
    [
      join(root, "scripts/generation/generate-digi-react-snapshots.mjs"),
      "--orchestration",
      orchestration,
      "--output-root",
      staging,
    ],
    { cwd: root, stdio: "inherit" }
  )

  const generatedManifest = verifyDigiArtifacts(staging)
  writeFileSync(
    syncMetadataPath,
    `${JSON.stringify(
      {
        orchestrationSha: sourceSha,
        dirty: Boolean(dirtyFiles),
        syncedAt: generatedManifest.syncedAt,
        components: generatedManifest.components.length,
        shellFiles: options.componentsOnly
          ? (previousSync.shellFiles ?? [])
          : shellConfig.files,
      },
      null,
      2
    )}\n`
  )

  publishArtifacts(root, staging, [
    "renderer/vendor/digicomponents",
    "renderer/vendor/sync.json",
    "packages/digicomponents-react/style.css",
    "manifest/manifest.json",
    "manifest/CHANGELOG.md",
    "renderer/src/digicomponents.react.generated.json",
    "packages/digicomponents-react/src/snapshots.generated.json",
    "packages/digicomponents-react/src/components",
    "packages/digicomponents-react/src/index.ts",
    ...(options.componentsOnly ? [] : ["renderer/src/back"]),
  ])
  console.log(
    `✓ synced ${generatedManifest.components.length} components @ ${sourceSha.slice(0, 10)}${dirtyFiles ? " (dirty)" : ""}`
  )
} finally {
  if (staging) rmSync(staging, { recursive: true, force: true })
  release()
}

function parseArguments(args) {
  const parsed = { help: false, skipBuild: false, componentsOnly: false }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--help" || argument === "-h") {
      parsed.help = true
      continue
    }
    if (argument === "--skip-build") {
      parsed.skipBuild = true
      continue
    }
    if (argument === "--components-only") {
      parsed.componentsOnly = true
      continue
    }
    if (argument === "--orchestration") {
      const value = args[index + 1]
      if (!value || value.startsWith("--"))
        throw new Error("--orchestration requires a path")
      parsed.orchestration = value
      index += 1
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return parsed
}

function printUsage() {
  console.log(`Usage: pnpm sync:digicomponents [options]

Options:
  --orchestration <path>  Path to the orchestration checkout (default: ../orchestration)
  --components-only       Skip syncing backoffice shell files
  --skip-build            Reuse an existing digicomponents dist/ build
  --help                  Show this help`)
}

function assertDirectory(path, name, value) {
  if (!existsSync(path)) throw new Error(`${name} not found at ${value}`)
}

function assertFile(path, name) {
  if (!existsSync(path)) throw new Error(`${name} not found at ${path}`)
}

function assertExists(path, name) {
  if (!existsSync(path)) throw new Error(`${name} not found at ${path}`)
}

function resolveInside(base, path) {
  if (isAbsolute(path))
    throw new Error(`Expected a relative path, received ${path}`)
  const absolutePath = resolve(base, path)
  if (absolutePath !== base && !absolutePath.startsWith(`${base}${sep}`)) {
    throw new Error(`Path escapes ${base}: ${path}`)
  }
  return absolutePath
}

function readJsonIfPresent(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {}
}
