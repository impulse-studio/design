import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

// Vite library builds reference a graph of bundled modules under dist/node_modules.
// Keep that graph in a tracked directory, with every relative edge rewritten.
export const vendorDependencies = (sourceRoot, targetRoot) => {
  const seen = new Set()
  const destinationFor = (source) =>
    join(
      targetRoot,
      ...relative(sourceRoot, source)
        .split(sep)
        .map((part) => (part === "node_modules" ? "external" : part))
    )
  const visit = (source) => {
    if (seen.has(source)) return
    seen.add(source)
    const destination = destinationFor(source)
    mkdirSync(dirname(destination), { recursive: true })
    if (![".js", ".css"].includes(extname(source))) {
      cpSync(source, destination)
      return
    }
    const content = readFileSync(source, "utf8").replace(
      /(["'])(\.{1,2}\/[^"']+)\1/g,
      (match, quote, specifier) => {
        const dependency = resolve(dirname(source), specifier)
        if (
          !dependency.startsWith(sourceRoot + sep) ||
          !existsSync(dependency) ||
          !extname(dependency)
        )
          return match
        visit(dependency)
        let rewritten = relative(
          dirname(destination),
          destinationFor(dependency)
        )
          .split(sep)
          .join("/")
        if (!rewritten.startsWith(".")) rewritten = "./" + rewritten
        return quote + rewritten + quote
      }
    )
    writeFileSync(destination, content)
  }
  visit(join(sourceRoot, "index.js"))
  return seen.size
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
  console.log(
    `Vendored ${vendorDependencies(resolve(root, "../orchestration/lib/digicomponents/dist"), join(root, "renderer/vendor/digicomponents"))} dependency modules.`
  )
}
