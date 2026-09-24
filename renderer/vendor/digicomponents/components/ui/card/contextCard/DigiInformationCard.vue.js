import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
import { contextCardVariants } from "./variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiInformationCard",
  props: {
    size: {},
    class: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)(unref(contextCardVariants)({ size: __props.size }), _ctx.$props.class))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
