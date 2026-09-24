import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { useForwardProps } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { StepperItem_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Stepper/StepperItem.js";
import { cn } from "../../../../lib/cn.js";
import { reactiveOmit } from "../../../../node_modules/.pnpm/@vueuse_shared@14.2.1_vue@3.5.28_typescript@5.9.3_/node_modules/@vueuse/shared/dist/index.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StepperItem",
  props: {
    step: {},
    disabled: { type: Boolean },
    completed: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(StepperItem_default), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "group flex items-center gap-2 data-disabled:pointer-events-none",
          props.class
        )
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
