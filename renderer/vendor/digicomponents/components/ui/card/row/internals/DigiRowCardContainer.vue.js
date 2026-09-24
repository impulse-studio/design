import { defineComponent, openBlock, createBlock, normalizeClass, unref, withCtx, renderSlot } from "vue";
import { cn } from "../../../../../lib/cn.js";
import _sfc_main$1 from "../../internals/BaseCard.vue.js";
import { cardVariants } from "../../variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowCardContainer",
  props: {
    size: {},
    active: { type: Boolean },
    disabled: { type: Boolean },
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        class: normalizeClass(
          unref(cn)(
            unref(cardVariants)({
              size: __props.size,
              active: __props.active,
              disabled: __props.disabled
            }),
            "flex w-full min-w-0 items-center justify-between gap-4 overflow-hidden rounded-lg",
            props.class
          )
        )
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
