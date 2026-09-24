import { defineComponent, openBlock, createBlock, normalizeClass, unref, withCtx, renderSlot } from "vue";
import { cn } from "../../../../../lib/cn.js";
import _sfc_main$1 from "../../internals/BaseCard.vue.js";
import { cardVariants } from "../../variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiGroupCardContainer",
  props: {
    disabled: {},
    size: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        class: normalizeClass(
          unref(cn)(
            unref(cardVariants)({ disabled: __props.disabled, size: __props.size }),
            "bg-secondary/50 flex w-full min-w-0 flex-col gap-2 rounded-lg"
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
