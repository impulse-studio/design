import { defineComponent, useModel, useTemplateRef, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, mergeModels } from "vue";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/text/DigiTextInput.vue.js";
/* empty css                                  */
/* empty css                             */
import _sfc_main$1 from "./DigiOptionalFormField.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalTextFormField",
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
    formatter: { type: Function }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["toggleChange", "search"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const input = useTemplateRef("input");
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
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => value.value = $event)
      }, { ...props, ..._ctx.$attrs }, {
        onToggleChange: _cache[3] || (_cache[3] = ($event) => emit("toggleChange", $event))
      }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps(componentField, {
            ref_key: "input",
            ref: input,
            "icon-name": __props.iconName,
            formatter: __props.formatter,
            onOnEnterPressed: _cache[0] || (_cache[0] = ($event) => emit("search")),
            onFocusout: _cache[1] || (_cache[1] = ($event) => emit("search"))
          }), null, 16, ["icon-name", "formatter"])
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
