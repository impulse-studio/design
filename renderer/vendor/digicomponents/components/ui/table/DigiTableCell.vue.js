import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = ["colspan", "rowspan"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableCell",
  props: {
    class: {},
    colspan: {},
    rowspan: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("td", {
        class: normalizeClass(unref(cn)("p-2 align-middle [&:has([role=checkbox])]:pr-0", props.class)),
        colspan: props.colspan,
        rowspan: props.rowspan
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
