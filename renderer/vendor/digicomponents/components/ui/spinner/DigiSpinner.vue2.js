import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, createCommentVNode } from "vue";
import { spinnerVariants, spinnerCircleVariants } from "./spinnerVariants.js";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = {
  key: 0,
  viewBox: "0 0 100 100",
  xmlns: "http://www.w3.org/2000/svg"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSpinner",
  props: {
    size: {},
    reversed: { type: Boolean },
    class: {},
    hide: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["digi-spinner", unref(cn)(unref(spinnerVariants)({ size: __props.size }), props.class)])
      }, [
        __props.hide !== true ? (openBlock(), createElementBlock("svg", _hoisted_1, [
          createElementVNode("circle", {
            cx: "50",
            cy: "50",
            r: "45",
            class: normalizeClass(unref(spinnerCircleVariants)({ reversed: __props.reversed }))
          }, null, 2)
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
