// React does not necessarily forward a component's source id to its DOM root.
// Read the committed tree so wrappers, fragments and portals remain inspectable.
export const collectRenderedElements = (root: Element | null) => {
  type Fiber = {
    type?: unknown
    memoizedProps?: { "data-digi-id"?: string }
    stateNode?: unknown
    child?: Fiber | null
    sibling?: Fiber | null
  }
  const entries = new Map<
    string,
    { instances: Set<unknown>; elements: Set<Element> }
  >()
  const componentIds = new Map<Element, string>()
  const visible = (element: Element) => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }
  const add = (id: string, instance: unknown, element: Element) => {
    let entry = entries.get(id)
    if (!entry) {
      entry = { instances: new Set(), elements: new Set() }
      entries.set(id, entry)
    }
    entry.instances.add(instance)
    entry.elements.add(element)
  }
  const key =
    root &&
    Object.keys(root).find((name) => name.startsWith("__reactContainer$"))
  const container = key
    ? (root as unknown as Record<string, { stateNode?: { current?: Fiber } }>)[
        key
      ]
    : null
  const visit = (fiber: Fiber, owners: Array<{ id: string; fiber: Fiber }>) => {
    const id = fiber.memoizedProps?.["data-digi-id"]
    const named = typeof fiber.type !== "string" && typeof id === "string"
    const ancestors = named ? [...owners, { id, fiber }] : owners
    const element = fiber.stateNode
    if (element instanceof Element && visible(element)) {
      for (const owner of ancestors) add(owner.id, owner.fiber, element)
      const closest = ancestors.at(-1)
      if (closest) componentIds.set(element, closest.id)
      const domId = element.getAttribute("data-digi-id")
      // A forwarded id represents the same instance as its component.
      if (domId && !ancestors.some((owner) => owner.id === domId))
        add(domId, element, element)
    }
    for (let child = fiber.child; child; child = child.sibling)
      visit(child, ancestors)
  }
  if (container?.stateNode?.current) visit(container.stateNode.current, [])
  type VueNode = { props?: { "data-digi-id"?: string }; el?: unknown; children?: unknown; component?: { subTree?: VueNode } }
  const visitVue = (node: VueNode, owners: Array<{id:string;node:VueNode}>) => {
    const id=node.props?.["data-digi-id"]
    const ancestors=typeof id==="string"?[...owners,{id,node}]:owners
    if(node.el instanceof Element && visible(node.el)) {
      for(const owner of ancestors) add(owner.id,owner.node,node.el)
      const closest=ancestors.at(-1)
      if(closest) componentIds.set(node.el,closest.id)
    }
    if(node.component?.subTree) visitVue(node.component.subTree,ancestors)
    else if(Array.isArray(node.children)) for(const child of node.children) if(child && typeof child==="object") visitVue(child as VueNode,ancestors)
  }
  const vueRoot=(root as unknown as { _vnode?: VueNode } | null)?._vnode
  if(vueRoot) visitVue(vueRoot,[])
  // Keep non-React / uninstrumented DOM selectable as well.
  for (const element of document.querySelectorAll("[data-digi-id]")) {
    const id = element.getAttribute("data-digi-id")
    if (id && visible(element) && !entries.get(id)?.elements.has(element))
      add(id, element, element)
  }
  return { entries, componentIds }
}
