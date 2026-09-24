import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
import _sfc_main$1 from "../label/DigiLabel.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        class: normalizeClass(unref(cn)("font-bold", props.class)),
        for: props.for
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "for"]);
    };
  }
});
export {
  _sfc_main as default
};
