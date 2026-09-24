import { defineComponent, useModel, useTemplateRef, computed, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, createSlots, renderSlot, mergeModels } from "vue";
import { z } from "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
import _sfc_main$2 from "../../input/number/DigiNumberInput.vue.js";
/* empty css                                         */
/* empty css                                  */
/* empty css                             */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNumberFormField",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    context: {},
    iconName: {},
    formatter: { type: Function },
    step: {},
    min: {},
    max: {},
    enforceBounds: { type: Boolean }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("inputRef");
    const computedZodSchema = computed(() => {
      let schema = z.number();
      if (props.min) {
        schema = schema.min(props.min);
      }
      if (props.max) {
        schema = schema.max(props.max);
      }
      const defaultSchema = props.required ? schema : schema.optional().nullable();
      return props.zodSchema ?? defaultSchema;
    });
    __expose({
      setInputValue(v) {
        input.value?.setInputValue(v);
      },
      focus() {
        input.value?.focus();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, { ...props, zodSchema: computedZodSchema.value }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps({ ref: "inputRef" }, {
            ...componentField,
            min: __props.min,
            max: __props.max,
            step: __props.step,
            formatter: __props.formatter,
            iconName: __props.iconName,
            enforceBounds: __props.enforceBounds
          }), createSlots({ _: 2 }, [
            _ctx.$slots.prepend ? {
              name: "prepend",
              fn: withCtx(() => [
                renderSlot(_ctx.$slots, "prepend")
              ]),
              key: "0"
            } : void 0,
            _ctx.$slots.append ? {
              name: "append",
              fn: withCtx(() => [
                renderSlot(_ctx.$slots, "append")
              ]),
              key: "1"
            } : void 0
          ]), 1040)
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
