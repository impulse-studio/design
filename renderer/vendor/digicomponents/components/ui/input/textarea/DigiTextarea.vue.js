import { defineComponent, useModel, useTemplateRef, withDirectives, openBlock, createElementBlock, mergeProps, unref, vModelText, mergeModels } from "vue";
import { cva } from "../../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextarea",
  props: /* @__PURE__ */ mergeModels({
    class: {},
    rows: { default: 3 },
    name: {},
    placeholder: {},
    disabled: { type: Boolean },
    state: { type: [Boolean, null], default: null },
    iconName: {},
    min: {},
    max: {},
    step: {},
    accept: {},
    onChange: {},
    autocomplete: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const textAreaElement = useTemplateRef("textAreaRef");
    const variants = cva(
      "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-full w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      {
        variants: {
          state: {
            true: "border-success focus-visible:ring-success",
            false: "border-destructive focus-visible:ring-destructive"
          }
        }
      }
    );
    __expose({
      setInputValue(v) {
        if (textAreaElement.value) {
          textAreaElement.value.value = v;
        }
      },
      focus() {
        textAreaElement.value?.focus();
      }
    });
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("textarea", mergeProps({ ref: "textAreaRef" }, props, {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
        class: unref(cn)(unref(variants)({ state: __props.state }), props.class)
      }), null, 16)), [
        [vModelText, value.value]
      ]);
    };
  }
});
export {
  _sfc_main as default
};
