import { defineComponent, provide, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { ToggleGroupRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/ToggleGroup/ToggleGroupRoot.js";
import { cn } from "../../../lib/cn.js";
import { toggleGroupInjectionKey } from "./types.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToggleGroup",
  props: {
    class: {},
    variant: {},
    size: {},
    type: {},
    disabled: { type: Boolean },
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    provide(toggleGroupInjectionKey, {
      variant: props.variant,
      size: props.size
    });
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ToggleGroupRoot_default), mergeProps(unref(forwarded), {
        class: unref(cn)("flex items-center justify-center gap-1", props.class)
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
