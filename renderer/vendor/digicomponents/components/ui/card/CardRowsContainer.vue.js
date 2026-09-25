import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot } from "vue";
import { Slot } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardRowsContainer",
  props: {
    smallSpacing: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Slot), {
        class: normalizeClass(["grid items-center", { "gap-6": props.smallSpacing, "gap-10": !props.smallSpacing }])
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
