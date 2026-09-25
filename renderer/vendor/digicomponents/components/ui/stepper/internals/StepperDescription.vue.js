import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { useForwardProps } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardProps.js";
import { StepperDescription_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Stepper/StepperDescription.js";
import { cn } from "../../../../lib/cn.js";
import { reactiveOmit } from "../../../../external/.pnpm/@vueuse_shared@14.2.1_vue@3.5.28_typescript@5.9.3_/external/@vueuse/shared/dist/index.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StepperDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(StepperDescription_default), mergeProps(unref(forwarded), {
        class: unref(cn)("text-muted-foreground text-xs", props.class)
      }), {
        default: withCtx((slotProps) => [
          renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)))
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
