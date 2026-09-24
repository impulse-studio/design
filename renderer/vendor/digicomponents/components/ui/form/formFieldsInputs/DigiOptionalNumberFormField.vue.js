import { defineComponent, useModel, useTemplateRef, computed, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, mergeModels } from "vue";
import { z } from "zod";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
import _sfc_main$2 from "../../input/number/DigiNumberInput.vue.js";
/* empty css                                         */
/* empty css                                  */
/* empty css                             */
import _sfc_main$1 from "./DigiOptionalFormField.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalNumberFormField",
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
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["toggleChange"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
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
    function handleToggleChange(enabled) {
      if (enabled && props.min !== void 0) {
        value.value = props.min;
      }
      emit("toggleChange", enabled);
    }
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
      }, { ...props, zodSchema: computedZodSchema.value }, { onToggleChange: handleToggleChange }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps({ ref: "inputRef" }, {
            ...componentField,
            min: __props.min,
            max: __props.max,
            step: __props.step,
            formatter: __props.formatter,
            iconName: __props.iconName,
            enforceBounds: __props.enforceBounds
          }), null, 16)
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
