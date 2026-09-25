#!/usr/bin/env node
import { createRequire } from "node:module"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { JSDOM } from "jsdom"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const orchestration = resolve(process.argv[2] ?? "../orchestration")
const libraryPath = resolve(orchestration, "lib/digicomponents")
const require = createRequire(resolve(libraryPath, "package.json"))
const vue = await import(pathToFileURL(require.resolve("vue")).href)
const vueRouter = await import(pathToFileURL(require.resolve("vue-router")).href)
const renderer = await import(pathToFileURL(require.resolve("vue/server-renderer")).href)
const digi = await import(pathToFileURL(resolve(libraryPath, "dist/index.js")).href)
const digiDropdownMenu = (
  await import(pathToFileURL(resolve(
    libraryPath,
    "dist/components/ui/dropdown-menu/DigiDropdownMenu.vue.js"
  )).href)
).default
const digiDropdownMenuContent = (
  await import(pathToFileURL(resolve(
    libraryPath,
    "dist/components/ui/dropdown-menu/basics/DigiDropdownMenuContent.vue2.js"
  )).href)
).default
const manifest = JSON.parse(
  readFileSync(resolve(root, "manifest/manifest.json"), "utf8")
)
const output = resolve(root, "renderer/src/digicomponents.react.generated.json")
const reactPackage = resolve(root, "packages/digicomponents-react")
const reactSource = resolve(reactPackage, "src")
mkdirSync(reactSource, { recursive: true })
const safeName = /^[A-Za-z][A-Za-z0-9]*$/
const contentProps = /^(?:text|title|description|label|placeholder|message|caption|tooltip|(?:model)?value|defaultvalue|href|src|url|alt|name|link|route|content|.*(?:Text|Title|Description|Label|Placeholder|Message|Caption|Tooltip|Value|Href|Src|Url|Alt|Link|Route|Content))$/i
const propOptions = (type) => {
  const values = type
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part !== "undefined" && part !== "null")
  return values.every((part) => /^(?:".*"|'.*')$/.test(part))
    ? values.map((part) => part.slice(1, -1))
    : []
}
const textMarker = (name) => `__DIGIT_PROP_${name.toUpperCase()}__`
const defaultTexts = Object.fromEntries(
  [
    "backButtonLabel", "cancelCta", "closeTooltip", "confirmCta",
    "confirmDeletionModalCta", "confirmDeletionModalTitle",
    "confirmationPhraseError", "copyToClipboardCta", "copiedToClipboard",
    "datePlaceholder", "edit", "editWysiwyg", "helpText", "invalidPhoneError",
    "okCta", "removeFileTooltip", "requiredError", "resetCta", "saveCta",
    "selectEmptySearch", "selectedItemsText", "submitCta", "tableEmptyResetCta",
    "tableEmptyText", "timeRangeDefaultError", "tableOfContentTitle",
    "selectSuggestionsHeading",
  ].map((key) => [key, key])
)
Object.assign(defaultTexts, {
  confirmInputIndication: (value) => `Tapez « ${value} » pour confirmer`,
  maxFileSizeError: (size) => `Le fichier dépasse ${size} Mo`,
  timezoneIndicatorContent: (timezone) => `Fuseau ${timezone}`,
  dateMinError: (date) => `Après le ${date}`,
  dateMaxError: (date) => `Avant le ${date}`,
})
const config = {
  defaultTexts,
  extractErrorMessage: (error) => error instanceof Error ? error.message : String(error),
  dateConfig: { locale: "fr", timezone: "Europe/Paris" },
  language: "fr",
}

const components = {}
for (const entry of manifest.components) {
  const component = digi[entry.name]
  if (!safeName.test(entry.name) || !component) continue
  const rendered = await renderVariants(entry, component)
  components[entry.name] = {
    slots: entry.slots,
    textProps: entry.props
      .filter((prop) => contentProps.test(prop.name) && prop.type === "string")
      .map((prop) => prop.name),
    ...rendered,
  }
}

mkdirSync(dirname(output), { recursive: true })
writeFileSync(
  output,
  `${JSON.stringify({ orchestrationSha: manifest.orchestrationSha, components }, null, 2)}\n`
)
writeFileSync(
  resolve(reactSource, "snapshots.generated.json"),
  `${JSON.stringify({ orchestrationSha: manifest.orchestrationSha, components }, null, 2)}\n`
)
writeReactComponentExports(manifest.components)
console.log(`  ${Object.keys(components).length} React render maps written to ${output}`)

async function renderVariants(entry, component) {
  const defaults = { ...(entry.previewProps ?? {}) }
  for (const prop of entry.props) {
    if (prop.default !== undefined) defaults[prop.name] = prop.default
    else if (defaults[prop.name] === undefined) {
      const options = propOptions(prop.type)
      if (prop.required && options.length) defaults[prop.name] = options[0]
      else if (prop.required && prop.type === "string") defaults[prop.name] = "Exemple"
      else if (prop.required && prop.type === "number") defaults[prop.name] = 0
      else if (prop.required && /^(?:boolean|false \| true)$/.test(prop.type)) defaults[prop.name] = false
    }
  }
  if (entry.name === "DigiTabsContainer" && Array.isArray(defaults.tabs) && !defaults.tabs.length)
    defaults.tabs = [{ value: "digit-preview-tab", title: "Aperçu" }]
  if (["DigiGroupClickableCard", "DigiRowClickableCard", "DigiRowDraggableCard"].includes(entry.name))
    defaults.name ??= { kind: "text", name: "Exemple" }
  if (["DigiNudeFormField", "DigiSearchField"].includes(entry.name)) {
    defaults.name ??= "example"
    defaults.label ??= "Exemple"
    defaults.placeholder ??= "Exemple"
  }
  if ([
    "DigiDateTimePickerFormField",
    "DigiOptionalDateTimePickerFormField",
    "DigiRadioFormField",
    "DigiOptionalSearchSelectFormField",
  ].includes(entry.name)) {
    defaults.name ??= "example"
    defaults.label ??= "Exemple"
    defaults.modelValue ??= "digit-preview"
  }
  if (["DigiDateTimePickerFormField", "DigiOptionalDateTimePickerFormField"].includes(entry.name))
    defaults.modelValue = new Date("2026-09-25T09:00:00.000Z")
  if (entry.name === "DigiOptionalSearchSelectFormField")
    defaults.selectProps ??= { options: [] }
  if (["DigiBasicDropdownItem", "DigiLinkDropdownItem"].includes(entry.name))
    defaults.text ??= "Option"

  const axes = entry.props.flatMap((prop) => {
    const options = propOptions(prop.type)
    if (options.length) return [{ name: prop.name, values: options }]
    if (/^(?:boolean|false \| true)$/.test(prop.type))
      return [{ name: prop.name, values: [false, true] }]
    return []
  })
  const combinations = cartesianAxes(axes, defaults, 64)
  const markers = entry.props
    .filter((prop) => contentProps.test(prop.name) && prop.type === "string")
    .map((prop) => prop.name)
  const snapshots = []
  for (const selected of combinations) {
    const props = { ...defaults, ...selected }
    for (const name of markers) props[name] = textMarker(name)
    const slots = Object.fromEntries(
      entry.slots.map((slot) => [
        slot,
        () => [vue.h("span", { "data-digit-slot": slot })],
      ])
    )
    const target = vue.h(
      component,
      { ...props, ...(contextFor(entry.name) ? { "data-digit-snapshot-target": "true" } : {}) },
      slots
    )
    const contextual = contextualComponent(entry.name, props, target)
    try {
      const html = await renderInProviders(contextual.node)
      snapshots.push({
        props: selected,
        html,
        tree: htmlToTree(html, contextual.target),
      })
    } catch (error) {
      snapshots.push({
        props: selected,
        error: error instanceof Error ? error.message : String(error),
        html: fallbackHtml(entry.name),
        tree: htmlToTree(fallbackHtml(entry.name)),
      })
    }
  }
  return {
    defaults,
    variants: snapshots.length
      ? snapshots
      : [{ props: {}, html: fallbackHtml(entry.name), tree: htmlToTree(fallbackHtml(entry.name)) }],
  }
}

function fallbackHtml(name) {
  return `<div class="digit-react-fallback studio-missing" data-digit-component="${name}">${name} · rendu React indisponible hors contexte</div>`
}

async function renderInProviders(child) {
  if (!globalThis.ResizeObserver)
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  const app = vue.createSSRApp({
    render: () =>
      vue.h(
        digi.DigiComponentConfigProvider,
        { config },
        {
          default: () => [
            vue.h(digi.DigiTooltipProvider, {}, { default: () => [child] }),
          ],
        }
    ),
  })
  const router = vueRouter.createRouter({
    history: vueRouter.createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
  })
  await router.push("/")
  await router.isReady()
  app.use(router)
  app.config.warnHandler = () => {}
  const context = { teleports: {} }
  const html = await renderer.renderToString(app, context)
  return `${html}${Object.values(context.teleports).join("")}`
}

function cartesianAxes(axes, defaults, limit) {
  const result = [{}]
  for (const axis of axes) {
    const next = result.flatMap((item) =>
      axis.values.map((value) => ({ ...item, [axis.name]: value }))
    )
    if (next.length > limit) {
      const fallback = [{ ...defaults }]
      for (const oneAxis of axes)
        for (const value of oneAxis.values)
          fallback.push({ ...defaults, [oneAxis.name]: value })
      return dedupeProps(fallback)
    }
    result.splice(0, result.length, ...next)
  }
  return result.length ? result : [{}]
}

function dedupeProps(values) {
  const seen = new Set()
  return values.filter((value) => {
    const key = JSON.stringify(value)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function htmlToTree(html, targetSelector) {
  const dom = new JSDOM(html)
  const document = dom.window.document
  const convert = (node) => {
    if (node.nodeType === 3) return { type: "text", text: node.textContent ?? "" }
    if (node.nodeType !== 1) return null
    const attributes = Object.fromEntries(
      Array.from(node.attributes, (attribute) => [attribute.name, attribute.value])
        .filter(([name]) => name !== "data-digit-snapshot-target")
    )
    const children = Array.from(node.childNodes).map(convert).filter(Boolean)
    return {
      type: "element",
      tag: node.tagName.toLowerCase(),
      attributes,
      children,
    }
  }
  const target = targetSelector ? document.querySelector(targetSelector) : null
  if (targetSelector && !target)
    throw new Error(`Contextual render did not contain ${targetSelector}`)
  const roots = target ? [target] : Array.from(document.body.childNodes)
  const tree = roots.map(convert).filter(Boolean)
  dom.window.close()
  return tree
}

function contextFor(name) {
  return [
    "DigiAccordionCardItem",
    "DigiAccordionContent",
    "DigiAccordionItem",
    "DigiAccordionTrigger",
    "DigiBasicDropdownItem",
    "DigiCollapsibleContent",
    "DigiCollapsibleTrigger",
    "DigiDashboardCard",
    "DigiDateTimePickerFormField",
    "DigiDropdownMenuItem",
    "DigiGroupClickableCard",
    "DigiGroupDraggableCard",
    "DigiLinkDropdownItem",
    "DigiNudeFormField",
    "DigiOptionalDateTimePickerFormField",
    "DigiOptionalSearchSelectFormField",
    "DigiPopoverTrigger",
    "DigiRadioFormField",
    "DigiRadioGroupCardItem",
    "DigiRadioGroupItem",
    "DigiRadioGroupNudeItem",
    "DigiRowClickableCard",
    "DigiRowDraggableCard",
    "DigiSearchField",
    "DigiSortableHandle",
    "DigiTabContent",
    "DigiToggleGroupItem",
  ].includes(name)
}

function contextualComponent(name, props, target) {
  const withDefaultSlot = (componentName, componentProps, child) =>
    vue.h(digi[componentName], componentProps, { default: () => [child] })
  const targetSelector = contextFor(name)
    ? "[data-digit-snapshot-target]"
    : undefined

  if (name.startsWith("DigiAccordion")) {
    const value = props.value ?? "digit-preview-item"
    const item = name === "DigiAccordionItem" || name === "DigiAccordionCardItem"
      ? target
      : withDefaultSlot("DigiAccordionItem", { value }, target)
    return {
      target: targetSelector,
      node: withDefaultSlot(
        "DigiAccordion",
        { type: "single", collapsible: true, defaultValue: value },
        item
      ),
    }
  }
  if (name === "DigiCollapsibleContent" || name === "DigiCollapsibleTrigger")
    return {
      target: targetSelector,
      node: withDefaultSlot("DigiCollapsible", { defaultOpen: true }, target),
    }
  if (name === "DigiPopoverTrigger")
    return {
      target: targetSelector,
      node: withDefaultSlot("DigiPopover", {}, target),
    }
  if (["DigiBasicDropdownItem", "DigiDropdownMenuItem", "DigiLinkDropdownItem"].includes(name))
    return {
      target: targetSelector,
      node: vue.h(
        digiDropdownMenu,
        { open: true },
        {
          default: () => [
            vue.h(digiDropdownMenuContent, {}, { default: () => [target] }),
          ],
        }
      ),
    }
  if (/^Digi(?:DashboardCard|GroupClickableCard|GroupDraggableCard|RowClickableCard|RowDraggableCard|SortableHandle)$/.test(name)) {
    const sortable = vue.h(
      digi.DigiSortable,
      { modelValue: [{ id: "digit-preview" }], itemKey: (item) => item.id },
      { item: () => [target] }
    )
    return { target: targetSelector, node: sortable }
  }
  if (/^(?:DigiDateTimePickerFormField|DigiNudeFormField|DigiOptionalDateTimePickerFormField|DigiOptionalSearchSelectFormField|DigiRadioFormField|DigiSearchField)$/.test(name))
    return {
      target: targetSelector,
      node: withDefaultSlot("DigiNudeForm", { context: "nude" }, target),
    }
  if (/^DigiRadioGroup(?:CardItem|NudeItem|Item)$/.test(name))
    return {
      target: targetSelector,
      node: withDefaultSlot(
        "DigiRadioGroup",
        { orientation: "horizontal", modelValue: props.value ?? "digit-preview-item" },
        target
      ),
    }
  if (name === "DigiTabContent") {
    const value = props.value ?? "digit-preview-tab"
    return {
      target: targetSelector,
      node: withDefaultSlot(
        "DigiTabsContainer",
        {
          tabs: [{ value, title: "Aperçu" }],
          modelValue: value,
          orientation: "horizontal",
        },
        target
      ),
    }
  }
  if (name === "DigiToggleGroupItem")
    return {
      target: targetSelector,
      node: withDefaultSlot(
        "DigiToggleGroup",
        { type: "single", modelValue: props.value ?? "digit-preview-item" },
        target
      ),
    }
  return { node: target }
}

function writeReactComponentExports(entries) {
  const componentDirectory = resolve(reactSource, "components")
  rmSync(componentDirectory, { recursive: true, force: true })
  mkdirSync(componentDirectory, { recursive: true })
  const names = entries.filter((entry) => components[entry.name])
  const exports = [
    'export { DigitComponentView } from "./DigitComponentView"',
    ...names.map((entry) => `export { ${entry.name} } from "./components/${entry.name}"`),
  ]
  for (const entry of names) {
    const props = entry.props
      .filter((prop) =>
        !/^on[A-Z]/.test(prop.name) &&
        !/=>/.test(prop.type) &&
        !["children", "class", "className", "slots", "style", "onClick", "onChange", "onFocus", "onBlur", "onKeyDown", "onSubmit"].includes(prop.name)
      )
      .map((prop) => `  ${JSON.stringify(prop.name)}${prop.required ? "" : "?"}: ${reactType(prop.type)}`)
      .join("\n")
    const slotType = entry.slots.map((slot) => JSON.stringify(slot)).join(" | ") || "never"
    const source = `import { createElement } from "react"\nimport type {\n  ChangeEventHandler,\n  CSSProperties,\n  FocusEventHandler,\n  FormEventHandler,\n  KeyboardEventHandler,\n  MouseEventHandler,\n  ReactNode,\n} from "react"\nimport { DigitComponentView } from "../DigitComponentView"\n\nexport type ${entry.name}Props = {\n${props ? `${props}\n` : ""}  children?: ReactNode\n  slots?: Partial<Record<${slotType}, ReactNode[]>>\n  style?: CSSProperties\n  class?: string\n  className?: string\n  onClick?: MouseEventHandler<HTMLElement>\n  onChange?: ChangeEventHandler<HTMLElement>\n  onFocus?: FocusEventHandler<HTMLElement>\n  onBlur?: FocusEventHandler<HTMLElement>\n  onKeyDown?: KeyboardEventHandler<HTMLElement>\n  onSubmit?: FormEventHandler<HTMLElement>\n}\n\nexport function ${entry.name}(props: ${entry.name}Props) {\n  return createElement(DigitComponentView, {\n    component: ${JSON.stringify(entry.name)},\n    props: props as unknown as Record<string, unknown>,\n    children: props.children,\n    slots: props.slots,\n    style: props.style,\n  })\n}\n`
    writeFileSync(resolve(componentDirectory, `${entry.name}.tsx`), source)
    exports.push(`export type { ${entry.name}Props } from "./components/${entry.name}"`)
  }
  writeFileSync(resolve(reactSource, "index.ts"), `${exports.join("\n")}\n`)
}

function reactType(type) {
  const clean = type.replace(/\s+/g, " ").trim()
  if (/^(?:string|number|boolean|bigint|symbol|unknown|null|undefined|void|never)(?:\s*\|\s*(?:string|number|boolean|bigint|symbol|unknown|null|undefined|void|never|['"].*?['"]))*$/.test(clean)) return clean
  if (/^(?:['"].*?['"]|true|false|-?\d+(?:\.\d+)?)(?:\s*\|\s*(?:['"].*?['"]|true|false|-?\d+(?:\.\d+)?))*$/.test(clean)) return clean
  if (/^(?:string|number|boolean)\[\]$/.test(clean)) return clean
  return "unknown"
}
