import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardProps } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { StepperTrigger_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Stepper/StepperTrigger.js";
import { cn } from "../../../../lib/cn.js";
import { reactiveOmit } from "../../../../node_modules/.pnpm/@vueuse_shared@14.2.1_vue@3.5.28_typescript@5.9.3_/node_modules/@vueuse/shared/dist/index.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StepperTrigger",
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
      return openBlock(), createBlock(unref(StepperTrigger_default), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "flex flex-col items-center gap-2 rounded-md p-2 text-center",
          props.class
        )
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
