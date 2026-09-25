#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const options = parseArguments(process.argv.slice(2))
const orchestration = resolve(root, options.orchestration ?? "../orchestration")
const library = join(orchestration, "lib/digicomponents")
const sourceDirectory = join(library, "src")
const bundlePath = join(library, "dist/index.js")
const generatedAt = new Date().toISOString()
const sourceSha = options.sha

if (!sourceSha) throw new Error("--sha is required; run this generator through pnpm sync:digicomponents")

assertExists(bundlePath, "digicomponents build output")
assertExists(join(sourceDirectory, "style/main.css"), "digicomponents design tokens")

const exportNames = getExportedComponentNames(readFileSync(bundlePath, "utf8"))
const sourceFiles = new Map()
for (const name of exportNames) {
  const source = findComponentSource(join(sourceDirectory, "index.ts"), name) ?? findSourceByName(name)
  if (source) sourceFiles.set(name, source)
}

const templatePath = join(root, "renderer/src/templates/EventLayout.vue")
const vueSources = [...new Set([...sourceFiles.values(), templatePath].filter((source) => source?.endsWith(".vue")))]
const typeProgram = createTypeProgram(vueSources)
const notes = readNotes(join(root, "manifest/ai-notes.yaml"))
const components = exportNames.map((name) => createComponent(name, sourceFiles.get(name), typeProgram, notes))
const templates = [createTemplate("EventLayout", templatePath, typeProgram)]

const previousManifest = readJsonIfPresent(join(root, "manifest/manifest.json"))
const manifest = {
  orchestrationSha: sourceSha,
  syncedAt: generatedAt,
  components,
  templates,
  tokens: extractTokens(readFileSync(join(sourceDirectory, "style/main.css"), "utf8")),
}

mkdirSync(join(root, "manifest"), { recursive: true })
mkdirSync(join(root, "renderer/src"), { recursive: true })
mkdirSync(join(root, "src/generated"), { recursive: true })
writeFileSync(join(root, "manifest/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
writeFileSync(join(root, "renderer/src/registry.generated.ts"), createRegistrySource(manifest))
writeFileSync(join(root, "renderer/src/registry.ts"), `export { components, componentManifest, componentNames, templates } from "./registry.generated"\n`)
writeFileSync(join(root, "src/generated/components.d.ts"), createTypesFile(components))
writeChangelog(previousManifest, manifest)

console.log(`  ${components.length} components, ${templates.length} template, ${Object.values(manifest.tokens).length} token groups`)

function parseArguments(args) {
  const parsed = {}
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--orchestration") {
      const value = args[index + 1]
      if (!value || value.startsWith("--")) throw new Error("--orchestration requires a path")
      parsed.orchestration = value
      index += 1
      continue
    }
    if (argument === "--sha") {
      const value = args[index + 1]
      if (!value || value.startsWith("--")) throw new Error("--sha requires a Git commit SHA")
      parsed.sha = value
      index += 1
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return parsed
}

function getExportedComponentNames(bundle) {
  const exportBlock = [...bundle.matchAll(/\bexport\s*\{([\s\S]*?)\}\s*;/g)].at(-1)?.[1]
  if (!exportBlock) throw new Error("Could not find the digicomponents export block in dist/index.js")
  return [...new Set(exportBlock.split(",").map((item) => item.trim().split(/\s+as\s+/).at(-1)).filter((name) => name?.startsWith("Digi")))].sort()
}

function findComponentSource(modulePath, exportName, visited = new Set()) {
  const filePath = resolveModuleFile(modulePath)
  if (!filePath || visited.has(filePath)) return null
  visited.add(filePath)
  const source = readFileSync(filePath, "utf8")

  for (const match of source.matchAll(/\bexport\s+\*\s+from\s+["']([^"']+)["']/g)) {
    const result = findComponentSource(resolve(dirname(filePath), match[1]), exportName, visited)
    if (result) return result
  }

  for (const match of source.matchAll(/\bexport\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']/g)) {
    const target = resolveModuleFile(resolve(dirname(filePath), match[2]))
    const externalTarget = !target
    for (const specifier of match[1].split(",")) {
      const parts = specifier.trim().split(/\s+as\s+/)
      const importedName = parts[0]
      const exportedName = parts.at(-1)
      if (exportedName !== exportName) continue
      if (importedName === "default") return target
      if (externalTarget) return filePath
      const result = findComponentSource(target, importedName, visited)
      return result ?? (target.endsWith(".vue") ? target : filePath)
    }
  }
  return null
}

function resolveModuleFile(path) {
  const candidates = [path, `${path}.ts`, `${path}.vue`, `${path}.js`, join(path, "index.ts")]
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null
}

function findSourceByName(name) {
  for (const path of listFiles(sourceDirectory, (file) => extname(file) === ".vue" || extname(file) === ".ts")) {
    if (basename(path, extname(path)) === name) return path
  }
  return null
}

function listFiles(directory, include) {
  const result = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) result.push(...listFiles(path, include))
    else if (include(path)) result.push(path)
  }
  return result
}

function createTypeProgram(files) {
  const sourceByVirtualPath = new Map()
  for (const path of files) {
    const virtualPath = `${path}.manifest.ts`
    sourceByVirtualPath.set(resolve(virtualPath), ts.createSourceFile(virtualPath, getScriptContent(path), ts.ScriptTarget.Latest, true))
  }

  if (sourceByVirtualPath.size === 0) return null
  const configPath = join(library, "tsconfig.app.json")
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, library)
  const compilerOptions = {
    ...parsed.options,
    allowImportingTsExtensions: true,
    baseUrl: library,
    composite: false,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    paths: { "@/*": ["src/*"] },
    skipLibCheck: true,
  }
  delete compilerOptions.tsBuildInfoFile

  const host = ts.createCompilerHost(compilerOptions)
  const originalGetSourceFile = host.getSourceFile.bind(host)
  const originalFileExists = host.fileExists.bind(host)
  const originalReadFile = host.readFile.bind(host)
  host.getSourceFile = (path, ...args) => sourceByVirtualPath.get(resolve(path)) ?? originalGetSourceFile(path, ...args)
  host.fileExists = (path) => sourceByVirtualPath.has(resolve(path)) || originalFileExists(path)
  host.readFile = (path) => {
    const virtualSource = sourceByVirtualPath.get(resolve(path))
    return virtualSource?.text ?? originalReadFile(path)
  }

  return ts.createProgram({ rootNames: [...sourceByVirtualPath.keys()], options: compilerOptions, host })
}

function getScriptContent(path) {
  const source = readFileSync(path, "utf8")
  return [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join("\n")
}

function createComponent(name, sourcePath, program, notes) {
  const isVueSource = sourcePath?.endsWith(".vue") ?? false
  const storyPath = isVueSource ? sourcePath.replace(/\.vue$/, ".story.vue") : null
  const props = isVueSource ? extractProps(sourcePath, program) : []
  const story = storyPath && existsSync(storyPath) ? readFileSync(storyPath, "utf8") : ""
  const previewProps = Object.fromEntries(
    props.filter((prop) => prop.required && prop.previewValue !== undefined).map((prop) => [prop.name, prop.previewValue]),
  )

  return {
    name,
    category: categoryFromSource(sourcePath),
    file: sourcePath ? relative(library, sourcePath).split(sep).join("/") : null,
    description: descriptionFromSource(sourcePath),
    props: props.map(({ previewValue, ...prop }) => prop),
    slots: isVueSource ? extractSlots(readFileSync(sourcePath, "utf8")) : ["default"],
    events: isVueSource ? extractEvents(sourcePath, program) : [],
    examples: story ? extractExamples(story, name) : [],
    previewProps,
    aiNotes: notes[name] ?? null,
  }
}

function extractProps(path, program) {
  if (!program) return []
  const sourceFileName = resolve(`${path}.manifest.ts`)
  const sourceFile = program.getSourceFile(sourceFileName)
  if (!sourceFile) return []
  const checker = program.getTypeChecker()
  const propsType = findDefinePropsType(sourceFile)
  if (!propsType) return []

  const defaults = findDefaultValues(sourceFile)
  let resolvedProps
  try {
    resolvedProps = checker.getPropertiesOfType(checker.getTypeFromTypeNode(propsType))
  } catch {
    return []
  }

  return resolvedProps.map((symbol) => {
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    const type = declaration ? checker.getTypeOfSymbolAtLocation(symbol, declaration) : null
    const typeName = type ? typeToString(checker, type, sourceFile) : "unknown"
    const defaultValue = defaults.get(symbol.getName())
    const required = !(symbol.flags & ts.SymbolFlags.Optional) && defaultValue === undefined
    return {
      name: symbol.getName(),
      type: typeName,
      required,
      ...(defaultValue === undefined ? {} : { default: defaultValue }),
      ...(required ? { previewValue: previewValueFor(typeName) } : {}),
    }
  })
}

function findDefinePropsType(sourceFile) {
  let found = null
  const inspect = (node) => {
    if (found) return
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "defineProps") {
      found = node.typeArguments?.[0] ?? null
    }
    ts.forEachChild(node, inspect)
  }
  inspect(sourceFile)
  return found
}

function findDefaultValues(sourceFile) {
  const defaults = new Map()
  const inspect = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "withDefaults") {
      const values = node.arguments[1]
      if (values && ts.isObjectLiteralExpression(values)) {
        for (const property of values.properties) {
          if (!ts.isPropertyAssignment(property)) continue
          const key = propertyName(property.name)
          const value = literalValue(property.initializer)
          if (key && value !== undefined) defaults.set(key, value)
        }
      }
    }
    ts.forEachChild(node, inspect)
  }
  inspect(sourceFile)
  return defaults
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
  return null
}

function literalValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    return -Number(node.operand.text)
  }
  if (ts.isArrowFunction(node)) return literalValue(node.body)
  if (ts.isArrayLiteralExpression(node)) {
    const values = node.elements.map(literalValue)
    return values.some((value) => value === undefined) ? undefined : values
  }
  if (ts.isObjectLiteralExpression(node)) {
    const values = Object.fromEntries(
      node.properties
        .filter(ts.isPropertyAssignment)
        .map((property) => [propertyName(property.name), literalValue(property.initializer)])
        .filter(([key, value]) => key && value !== undefined),
    )
    return values
  }
  return undefined
}

function previewValueFor(type) {
  const alternatives = type.split("|").map((value) => value.trim()).filter((value) => !["undefined", "null", "void"].includes(value))
  const literalString = alternatives.find((value) => /^(['"]).*\1$/.test(value))
  if (literalString) return literalString.slice(1, -1)
  if (alternatives.some((value) => ["boolean", "true", "false"].includes(value))) return false
  if (alternatives.some((value) => value === "number" || /^-?\d/.test(value))) return 0
  if (alternatives.some((value) => value.includes("[]") || value.startsWith("Array<"))) return []
  if (alternatives.some((value) => value === "string")) return "Exemple"
  if (alternatives.some((value) => value.startsWith("{") || value.startsWith("Record<"))) return {}
  return undefined
}

function typeToString(checker, type, sourceFile) {
  if (type.isUnion()) {
    return type.types
      .filter((part) => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Void)))
      .map((part) => checker.typeToString(part, sourceFile, ts.TypeFormatFlags.NoTruncation))
      .join(" | ")
  }
  return checker.typeToString(type, sourceFile, ts.TypeFormatFlags.NoTruncation)
}

function extractSlots(source) {
  const slots = new Set()
  for (const match of source.matchAll(/<slot\b([^>]*)>/g)) {
    const name = match[1].match(/\bname=["']([^"']+)["']/)?.[1] ?? "default"
    slots.add(name)
  }
  return [...slots]
}

function extractEvents(path, program) {
  if (!program) return []
  const sourceFile = program.getSourceFile(resolve(`${path}.manifest.ts`))
  if (!sourceFile) return []
  const events = new Set()
  const inspect = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "defineEmits") {
      const typeNode = node.typeArguments?.[0]
      if (typeNode && ts.isTypeLiteralNode(typeNode)) {
        for (const member of typeNode.members) {
          if ((ts.isPropertySignature(member) || ts.isMethodSignature(member)) && member.name) {
            const name = propertyName(member.name)
            if (name) events.add(name)
          }
        }
      }
      const runtimeEvents = node.arguments[0]
      if (runtimeEvents && ts.isArrayLiteralExpression(runtimeEvents)) {
        for (const item of runtimeEvents.elements) {
          if (ts.isStringLiteral(item)) events.add(item.text)
        }
      }
    }
    ts.forEachChild(node, inspect)
  }
  inspect(sourceFile)
  return [...events]
}

function extractExamples(story, name) {
  const storyTitle = story.match(/<Story\b[^>]*\btitle=["']([^"']+)["']/)?.[1] ?? name
  const variants = [...story.matchAll(/<Variant\b[^>]*\btitle=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Variant>/g)]
  const examples = variants.slice(0, 4).map((match) => ({
    title: match[1],
    exampleCode: cleanExample(match[2]),
  }))
  if (examples.length > 0) return examples

  const template = story.match(/<template>([\s\S]*?)<\/template>/)?.[1]
  return template ? [{ title: storyTitle, exampleCode: cleanExample(template) }] : []
}

function cleanExample(value) {
  return value.trim().replace(/\n{3,}/g, "\n\n").slice(0, 1600)
}

function descriptionFromSource(path) {
  if (!path || !existsSync(path)) return null
  const source = readFileSync(path, "utf8")
  const comment = source.match(/^\s*<!--\s*([\s\S]*?)\s*-->/)?.[1] ?? source.match(/^\s*\/\*\*\s*([\s\S]*?)\*\//)?.[1]
  return comment?.replace(/^\s*\* ?/gm, "").trim().split(/\n\s*\n/)[0] || null
}

function categoryFromSource(path) {
  if (!path) return "Components"
  const relativePath = relative(sourceDirectory, path).split(sep)
  if (relativePath[0] === "components") relativePath.shift()
  if (relativePath[0] === "ui") relativePath.shift()
  const categorySegments = relativePath.slice(0, -1).filter((part) => part !== "internals")
  if (categorySegments.length === 0) return relativePath[0] === "config" ? "Configuration" : "Components"
  return categorySegments.map(titleCase).join(" / ")
}

function titleCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_ ]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function readNotes(path) {
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Za-z][\w-]*):\s*(.*)\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^(?:"(.*)"|'(.*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted)]),
  )
}

function extractTokens(css) {
  const rootTokens = parseTokenBlock(css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "")
  const darkTokens = parseTokenBlock(css.match(/\.dark\s*\{([^}]*)\}/)?.[1] ?? "")
  const select = (tokens, pattern) => Object.fromEntries(Object.entries(tokens).filter(([name]) => pattern.test(name)))
  return {
    color: select(rootTokens, /^(?:background|foreground|muted|popover|card|border|input|primary|secondary|success|accent|destructive|off-|blue|purple|warning|white|black|ring)(?:-|$)/),
    darkColor: select(darkTokens, /^(?:background|foreground|muted|popover|card|border|input|primary|secondary|success|accent|destructive|off-|blue|purple|warning|white|black|ring)(?:-|$)/),
    spacing: select(rootTokens, /^spacing-/),
    radius: select(rootTokens, /^radius(?:-|$)/),
    text: select(rootTokens, /^(?:base-font-size|font-family|font-scale-ratio|font-size-|font-weight-|letter-spacing-|line-height-)/),
    shadow: select(rootTokens, /^shadow-/),
  }
}

function parseTokenBlock(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  )
}

function createTemplate(name, path, program) {
  assertExists(path, `template ${name}`)
  const source = readFileSync(path, "utf8")
  const props = extractProps(path, program).map(({ previewValue, ...prop }) => prop)
  return {
    name,
    source: relative(root, path).split(sep).join("/"),
    props,
    slots: extractSlots(source),
    description: "Shell de page du backoffice Digitevent.",
  }
}

function createRegistrySource(manifest) {
  const names = manifest.components.map((component) => JSON.stringify(component.name)).join(",\n  ")
  return `import * as digi from "digicomponents"\nimport type { Component } from "vue"\nimport EventLayout from "./templates/EventLayout.vue"\n\nexport const componentNames = [\n  ${names},\n] as const\n\nexport type DigiComponentName = (typeof componentNames)[number]\n\nexport const componentManifest = ${JSON.stringify(manifest, null, 2)} as const\n\nconst exportedComponents = digi as unknown as Record<string, Component>\nexport const components = Object.fromEntries(\n  componentNames.map((name) => [name, exportedComponents[name]]),\n) as Record<DigiComponentName, Component>\n\nexport const templates: Record<string, Component> = {\n  EventLayout,\n}\n`
}

function createTypesFile(components) {
  const names = components.map((component) => `  | ${JSON.stringify(component.name)}`).join("\n")
  const propTypes = components
    .map((component) => {
      const props = component.props
        .map((prop) => `    ${JSON.stringify(prop.name)}${prop.required ? "" : "?"}: ${publicType(prop.type)}`)
        .join("\n")
      return `  ${JSON.stringify(component.name)}: {\n${props}${props ? "\n" : ""}  }`
    })
    .join("\n")
  return `export type DigiComponentName =\n${names}\n\nexport type DigiComponentProps = {\n${propTypes}\n}\n\nexport type DigiComponentPropsFor<Name extends DigiComponentName> = DigiComponentProps[Name]\n`
}

function publicType(type) {
  const clean = type.replace(/\s+/g, " ").trim()
  if (/^(?:string|number|boolean|bigint|symbol|unknown|any|null|undefined|void|never)(?:\s*\|\s*(?:string|number|boolean|bigint|symbol|unknown|any|null|undefined|void|never|['"].*?['"]))*$/.test(clean)) return clean
  if (/^(?:['"].*?['"]|true|false|-?\d+(?:\.\d+)?)(?:\s*\|\s*(?:['"].*?['"]|true|false|-?\d+(?:\.\d+)?))*$/.test(clean)) return clean
  if (/^(?:string|number|boolean)\[\]$/.test(clean)) return clean
  return "unknown"
}

function writeChangelog(previous, current) {
  const path = join(root, "manifest/CHANGELOG.md")
  const previousByName = new Map((previous.components ?? []).map((component) => [component.name, component]))
  const currentByName = new Map(current.components.map((component) => [component.name, component]))
  const added = [...currentByName.keys()].filter((name) => !previousByName.has(name))
  const removed = [...previousByName.keys()].filter((name) => !currentByName.has(name))
  const propChanges = []

  for (const [name, component] of currentByName) {
    const previousComponent = previousByName.get(name)
    if (!previousComponent) continue
    const oldProps = new Map((previousComponent.props ?? []).map((prop) => [prop.name, prop]))
    const newProps = new Map(component.props.map((prop) => [prop.name, prop]))
    const addedProps = [...newProps.keys()].filter((prop) => !oldProps.has(prop))
    const removedProps = [...oldProps.keys()].filter((prop) => !newProps.has(prop))
    const changedProps = [...newProps.keys()].filter((prop) => {
      const oldProp = oldProps.get(prop)
      const newProp = newProps.get(prop)
      return oldProp && (oldProp.type !== newProp.type || oldProp.required !== newProp.required || JSON.stringify(oldProp.default) !== JSON.stringify(newProp.default))
    })
    if (addedProps.length || removedProps.length || changedProps.length) {
      propChanges.push({ name, addedProps, removedProps, changedProps })
    }
  }

  const lines = []
  if (!previous.components) {
    lines.push(`- Initial sync: ${current.components.length} exported components and ${current.templates.length} shell template.`)
  } else if (added.length === 0 && removed.length === 0 && propChanges.length === 0) {
    lines.push("- No exported component or prop changes.")
  } else {
    if (added.length) lines.push(`- Added components: ${added.join(", ")}.`)
    if (removed.length) lines.push(`- Removed components: ${removed.join(", ")}.`)
    for (const change of propChanges) {
      const details = [
        change.addedProps.length ? `added ${change.addedProps.join(", ")}` : "",
        change.removedProps.length ? `removed ${change.removedProps.join(", ")}` : "",
        change.changedProps.length ? `changed ${change.changedProps.join(", ")}` : "",
      ].filter(Boolean)
      lines.push(`- ${change.name}: ${details.join("; ")}.`)
    }
  }

  const sectionHeading = `## ${current.syncedAt.slice(0, 10)} · ${current.orchestrationSha}`
  const section = `${sectionHeading}\n\n${lines.join("\n")}\n`
  const existing = existsSync(path) ? readFileSync(path, "utf8").replace(/^# Component library changelog\n\n?/, "") : ""
  const content = existing.includes(`· ${current.orchestrationSha}`) ? existing : `${section}\n${existing}`
  writeFileSync(path, `# Component library changelog\n\n${content}`)
}

function readJsonIfPresent(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {}
}

function assertExists(path, label) {
  if (!existsSync(path)) throw new Error(`${label} not found at ${path}`)
}
