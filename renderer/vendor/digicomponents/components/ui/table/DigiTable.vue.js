import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = {
  class: /* @__PURE__ */ normalizeClass("w-full caption-bottom")
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTable",
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(
          unref(cn)(
            "border-border relative w-full overflow-auto rounded-sm border bg-white",
            props.class
          )
        )
      }, [
        createElementVNode("table", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
