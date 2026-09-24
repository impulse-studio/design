import { defineComponent, useModel, useTemplateRef, openBlock, createBlock, mergeProps, withCtx, createVNode, unref, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/password/DigiPasswordInput.vue2.js";
/* empty css                                  */
/* empty css                             */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPasswordFormField",
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
    iconName: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("inputRef");
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
      }, props), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps({ ref: "inputRef" }, componentField, { "icon-name": __props.iconName }), null, 16, ["icon-name"])
        ]),
        _: 1
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
