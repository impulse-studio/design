import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
const sidePanelWidth = "w-[250px] xl:w-[350px] flex flex-col h-full empty:hidden";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSidePanel",
  props: {
    isOpen: { type: Boolean },
    side: { default: "right" },
    bodyClass: {}
  },
  setup(__props) {
    const props = __props;
    const panelClass = computed(() => {
      return cn(
        "absolute top-0 flex h-full flex-col overflow-hidden bg-white transition-all duration-500",
        props.isOpen ? sidePanelWidth : "w-0! border-transparent",
        props.side === "left" ? "left-0 border-r" : "right-0 border-l"
      );
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([panelClass.value, "side-panel"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([sidePanelWidth, __props.bodyClass])
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 2)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
