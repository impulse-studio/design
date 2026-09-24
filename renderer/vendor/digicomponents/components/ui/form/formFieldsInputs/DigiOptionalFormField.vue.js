import { defineComponent, useModel, ref, computed, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, renderSlot, mergeModels } from "vue";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
import DigiOptionalInput from "../../input/optional/DigiOptionalInput.vue2.js";
/* empty css                                  */
/* empty css                             */
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalFormField",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    context: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["toggleChange"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const enabled = ref(Boolean(value.value));
    const effectiveZodSchema = computed(() => {
      return enabled.value ? props.zodSchema : void 0;
    });
    function handleToggleChange(enabled2) {
      if (!enabled2) {
        value.value = void 0;
      }
      emit("toggleChange", enabled2 ?? false);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event)
      }, { ...props, ..._ctx.$attrs, zodSchema: effectiveZodSchema.value }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(DigiOptionalInput), {
            modelValue: enabled.value,
            "onUpdate:modelValue": [
              _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
              handleToggleChange
            ],
            disabled: __props.disabled
          }, {
            default: withCtx(({ disabled }) => [
              renderSlot(_ctx.$slots, "default", {
                componentField: {
                  ...componentField,
                  disabled: disabled || componentField.disabled
                }
              })
            ]),
            _: 2
          }, 1032, ["modelValue", "disabled"]),
          renderSlot(_ctx.$slots, "bottom")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
