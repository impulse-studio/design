import { defineComponent, computed, openBlock, createElementBlock, withKeys, withModifiers, normalizeClass, unref, createVNode, mergeProps } from "vue";
import { useForwardPropsEmits } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { ComboboxInput_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Combobox/ComboboxInput.js";
import { cn } from "../../../../../lib/cn.js";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "CommandInput",
  props: {
    displayValue: { type: Function },
    modelValue: {},
    autoFocus: { type: Boolean },
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)("flex items-center overflow-hidden border-b px-3", props.class)),
        onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(() => {
        }, ["prevent"]), ["enter"]))
      }, [
        createVNode(DigiRemixIcon, {
          name: "search-line",
          class: "mr-2 shrink-0 opacity-50"
        }),
        createVNode(unref(ComboboxInput_default), mergeProps({ ...unref(forwardedProps), ..._ctx.$attrs }, {
          "auto-focus": "",
          class: unref(cn)(
            "placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            props.class
          )
        }), null, 16, ["class"])
      ], 34);
    };
  }
}))());
export {
  _sfc_main as default
};
