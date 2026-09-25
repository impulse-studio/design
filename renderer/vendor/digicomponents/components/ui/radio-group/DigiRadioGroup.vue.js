import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { RadioGroupRoot_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/RadioGroup/RadioGroupRoot.js";
import { cn } from "../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioGroup",
  props: {
    name: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    orientation: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    const classes = computed(() => {
      return cn(
        "grid gap-3",
        props.class,
        props.orientation === "horizontal" && "flex gap-4"
      );
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(RadioGroupRoot_default), mergeProps({ class: classes.value }, unref(forwarded)), {
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
