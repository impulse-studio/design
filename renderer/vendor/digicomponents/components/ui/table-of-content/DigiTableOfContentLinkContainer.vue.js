import { defineComponent, useTemplateRef, unref, openBlock, createBlock, normalizeClass, withCtx, renderSlot } from "vue";
import { useMutationObserver } from "../../../external/.pnpm/@vueuse_core@14.2.1_vue@3.5.28_typescript@5.9.3_/external/@vueuse/core/dist/index.js";
import { Slot } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
import { cn } from "../../../lib/cn.js";
import { useTableOfContentLinkContext, TABLE_OF_CONTENT_LINK_CONTAINER_CLASS, TABLE_OF_CONTENT_LINK_CLASS } from "./utils.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableOfContentLinkContainer",
  setup(__props) {
    const context = useTableOfContentLinkContext();
    const containerRef = useTemplateRef("containerRef");
    useMutationObserver(
      containerRef,
      () => {
        const links = containerRef.value?.$el.querySelectorAll(
          `.${TABLE_OF_CONTENT_LINK_CLASS}`
        );
        if (links) {
          context?.sortLinks(Array.from(links).map((link) => link.id));
        }
      },
      {
        childList: true,
        subtree: true
      }
    );
    return (_ctx, _cache) => {
      return unref(context) ? (openBlock(), createBlock(unref(Slot), {
        key: 0,
        ref_key: "containerRef",
        ref: containerRef,
        class: normalizeClass(unref(cn)(unref(TABLE_OF_CONTENT_LINK_CONTAINER_CLASS), "flex flex-col"))
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"])) : renderSlot(_ctx.$slots, "default", { key: 1 });
    };
  }
});
export {
  _sfc_main as default
};
