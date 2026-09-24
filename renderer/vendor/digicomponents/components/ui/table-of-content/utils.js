import { inject, provide, ref } from "vue";
const TABLE_OF_CONTENT_LINK_CLASS = "table-of-content-link";
const TABLE_OF_CONTENT_LINK_CONTAINER_CLASS = "table-of-content-link-container";
const injectKey = /* @__PURE__ */ Symbol();
function provideTableOfContentLinkContext() {
  provide(injectKey, {
    links: ref([]),
    hoveredLinkId: ref(null)
  });
}
function useTableOfContentLinkContext() {
  const context = inject(injectKey);
  if (!context) {
    return null;
  }
  return {
    links: context.links,
    hoveredLinkId: context.hoveredLinkId,
    upsertLink: (link) => {
      const index = context.links.value.findIndex((l) => l.id === link.id);
      if (index !== -1) {
        context.links.value.splice(index, 1, link);
      } else {
        context.links.value.push(link);
      }
    },
    removeLink: (id) => {
      const index = context.links.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        context.links.value.splice(index, 1);
      }
    },
    sortLinks: (ids) => {
      const linkById = new Map(context.links.value.map((l) => [l.id, l]));
      context.links.value = ids.flatMap((id) => {
        const link = linkById.get(id);
        return link ? [link] : [];
      });
    }
  };
}
export {
  TABLE_OF_CONTENT_LINK_CLASS,
  TABLE_OF_CONTENT_LINK_CONTAINER_CLASS,
  provideTableOfContentLinkContext,
  useTableOfContentLinkContext
};
