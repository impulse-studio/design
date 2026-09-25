import { defineComponent, ref, useTemplateRef, computed, onMounted, onBeforeUnmount, unref, openBlock, createBlock, normalizeClass, withCtx, renderSlot } from "vue";
import { Slot } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
import { cn } from "../../../lib/cn.js";
import { useTableOfContentLinkContext, TABLE_OF_CONTENT_LINK_CLASS } from "./utils.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableOfContentLink",
  props: {
    hash: {},
    title: {},
    description: {}
  },
  setup(__props) {
    const props = __props;
    const context = useTableOfContentLinkContext();
    const id = ref("");
    const elementRef = useTemplateRef("elementRef");
    const isHovered = computed(() => context?.hoveredLinkId.value === id.value);
    onMounted(() => {
      if (!elementRef.value || !context) {
        return;
      }
      id.value = props.hash ? `#${props.hash}` : props.title.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
      context?.upsertLink({
        id: id.value,
        order: 0,
        title: props.title,
        description: props.description,
        htmlElement: elementRef.value.$el
      });
    });
    onBeforeUnmount(() => {
      context?.removeLink(id.value);
    });
    return (_ctx, _cache) => {
      return unref(context) ? (openBlock(), createBlock(unref(Slot), {
        key: 0,
        id: id.value,
        ref_key: "elementRef",
        ref: elementRef,
        class: normalizeClass([unref(cn)(unref(TABLE_OF_CONTENT_LINK_CLASS), { "!shadow-lg": isHovered.value }), "scroll-m-6 transition-shadow"])
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["id", "class"])) : renderSlot(_ctx.$slots, "default", { key: 1 });
    };
  }
});
export {
  _sfc_main as default
};
