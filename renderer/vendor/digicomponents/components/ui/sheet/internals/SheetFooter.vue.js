import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SheetFooter",
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(
          unref(cn)(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
            props.class
          )
        )
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
