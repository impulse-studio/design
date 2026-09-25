import { normalizeSources } from "@/features/sites/source"
import { siteDocumentSchema } from "@/validators/sites/document"
import type { SiteDocument } from "@/validators/sites/document"
import { projectFiles } from "@/features/sites/project"
import type { LibrarySnapshot } from "@/validators/libraries/payload"

export type LibraryDifference = {
  path: string
  kind: "file" | "asset"
  base?: string
  local?: string
  incoming?: string
  conflict: boolean
}
export const libraryPrefix = (id: string) => `src/libraries/${id}/`
const libraryCandidate = (doc: SiteDocument, snapshot: LibrarySnapshot) => {
  if (doc.kind !== snapshot.payload.framework)
    throw new Error("Cette bibliothèque utilise un autre framework.")
  const prefix = libraryPrefix(snapshot.libraryId)
  const files = Object.fromEntries(
    Object.entries(snapshot.payload.files)
      .filter(([p]) => !["package.json", "studio.library.json"].includes(p))
      .map(([path, code]) => [
        prefix + path,
        code.replace(/(["'])@\//g, `$1@/libraries/${snapshot.libraryId}/src/`),
      ])
  )
  const normalized = normalizeSources({
    ...doc,
    files,
    visual: [],
    libraries: [],
  }).files
  const assets = Object.fromEntries(
    Object.entries(snapshot.payload.assets).map(([path, asset]) => [
      prefix + path,
      asset,
    ])
  )
  return { files: normalized, assets }
}
export const compareLibrary = (
  doc: SiteDocument,
  snapshot: LibrarySnapshot
): LibraryDifference[] => {
  const binding = doc.libraries?.find(
    (b) => b.snapshot.libraryId === snapshot.libraryId
  )
  const incoming = libraryCandidate(doc, snapshot)
  const result: LibraryDifference[] = []
  for (const kind of ["file", "asset"] as const) {
    const base =
      kind === "file" ? (binding?.baseFiles ?? {}) : (binding?.baseAssets ?? {})
    const next = kind === "file" ? incoming.files : incoming.assets
    const current = kind === "file" ? doc.files : doc.assets
    const stringify = (value: unknown) =>
      value === undefined
        ? undefined
        : typeof value === "string"
          ? value
          : JSON.stringify(value)
    for (const path of new Set([...Object.keys(base), ...Object.keys(next)])) {
      const before = stringify(base[path]),
        local = stringify(current[path]),
        after = stringify(next[path])
      if (local === after || before === after) continue
      result.push({
        path,
        kind,
        base: before,
        local,
        incoming: after,
        conflict: local !== before,
      })
    }
  }
  return result
}
export const applyLibrary = (
  input: SiteDocument,
  snapshot: LibrarySnapshot,
  resolutions: Record<string, "local" | "incoming"> = {}
) => {
  const doc = structuredClone(input)
  const differences = compareLibrary(doc, snapshot)
  for (const diff of differences) {
    if (diff.conflict && !Object.hasOwn(resolutions, diff.path))
      throw new Error(`Conflit à résoudre : ${diff.path}`)
    if (diff.conflict && resolutions[diff.path] === "local") continue
    if (diff.kind === "file") {
      if (diff.incoming === undefined) delete doc.files[diff.path]
      else doc.files[diff.path] = diff.incoming
    } else {
      if (diff.incoming === undefined) delete doc.assets[diff.path]
      else doc.assets[diff.path] = JSON.parse(diff.incoming)
    }
  }
  const previous = doc.libraries?.find(
    (b) => b.snapshot.libraryId === snapshot.libraryId
  )
  for (const [name, version] of Object.entries(snapshot.payload.dependencies)) {
    if (["react", "react-dom", "vue"].includes(name)) continue
    const old = doc.dependencies[name]
    if (
      old &&
      old !== version &&
      (old !== previous?.snapshot.payload.dependencies[name] ||
        doc.libraries?.some(
          (b) =>
            b.snapshot.libraryId !== snapshot.libraryId &&
            b.snapshot.payload.dependencies[name] &&
            b.snapshot.payload.dependencies[name] !== version
        ))
    )
      throw new Error(
        `Versions incompatibles pour ${name} : ${old} / ${version}`
      )
    doc.dependencies[name] = version
  }
  const base = libraryCandidate(doc, snapshot)
  doc.libraries = [
    ...(doc.libraries ?? []).filter(
      (b) => b.snapshot.libraryId !== snapshot.libraryId
    ),
    {
      snapshot: structuredClone(snapshot),
      baseFiles: base.files,
      baseAssets: base.assets,
    },
  ]
  doc.files = projectFiles(doc)
  // A dependency update must be resolved again before a reproducible export is produced.
  delete doc.files["package-lock.json"]
  return siteDocumentSchema.parse(doc)
}

export const libraryValidationDocument = (
  snapshot: LibrarySnapshot,
  base: SiteDocument
) => {
  const doc = applyLibrary(base, snapshot)
  const imports = Object.keys(snapshot.payload.files)
    .filter(
      (path) =>
        /\.(vue|[jt]sx?)$/.test(path) &&
        !path.endsWith(".d.ts") &&
        !path.endsWith("studio.dependencies.lock.json")
    )
    .map(
      (path) =>
        `import ${JSON.stringify(`./libraries/${snapshot.libraryId}/${path}`)};`
    )
    .join("\n")
  const main =
    snapshot.payload.framework === "vue-vite" ? "src/main.ts" : "src/main.tsx"
  doc.files[main] += `\n${imports}`
  return siteDocumentSchema.parse(doc)
}
