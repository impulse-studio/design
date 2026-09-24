import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardFooter",
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)("flex items-center justify-end gap-2 p-6 pt-0", props.class))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
