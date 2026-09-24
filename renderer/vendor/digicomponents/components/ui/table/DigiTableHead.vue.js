import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = ["colspan"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableHead",
  props: {
    class: {},
    colspan: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("th", {
        class: normalizeClass(
          unref(cn)(
            "h-10 px-2 text-left align-middle text-sm font-bold [&:has([role=checkbox])]:pr-0",
            props.class
          )
        ),
        colspan: props.colspan
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
