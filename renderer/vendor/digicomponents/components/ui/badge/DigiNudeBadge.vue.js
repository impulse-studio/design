import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
import { badgeVariants } from "./badgeVariants.js";
/* empty css                         */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNudeBadge",
  props: {
    color: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)(unref(badgeVariants)({ color: __props.color }), props.class))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
