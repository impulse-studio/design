import { defineComponent, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, renderSlot } from "vue";
import { TooltipProvider_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tooltip/TooltipProvider.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTooltipProvider",
  props: {
    delayDuration: { default: 50 },
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TooltipProvider_default), normalizeProps(guardReactiveProps({
        ...props
      })), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
