import { defineComponent, useModel, useTemplateRef, computed, openBlock, createBlock, unref, mergeProps, withCtx, createVNode, mergeModels } from "vue";
import { z } from "zod";
/* empty css                            */
/* empty css                             */
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import "../../../../lib/zodSchemas.js";
/* empty css                                       */
import "lodash-es";
import DigiPhoneInput from "../../input/phone/DigiPhoneInput.vue2.js";
/* empty css                              */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPhoneFormField",
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
    preferredCountries: {},
    defaultCountry: {},
    onlyCountries: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("input");
    const computedZodSchema = computed(() => {
      const baseSchema = props.zodSchema ?? z.string().optional();
      return baseSchema.refine(() => {
        if (!value.value) return true;
        return input.value?.valid ?? false;
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props, { "zod-schema": computedZodSchema.value }), {
        default: withCtx(({ componentField }) => [
          createVNode(DigiPhoneInput, mergeProps({
            ref_key: "input",
            ref: input,
            "model-value": componentField.modelValue
          }, componentField, {
            "preferred-countries": __props.preferredCountries,
            "only-countries": __props.onlyCountries,
            "default-country": __props.defaultCountry
          }), null, 16, ["model-value", "preferred-countries", "only-countries", "default-country"])
        ]),
        _: 1
      }, 16, ["modelValue", "zod-schema"]);
    };
  }
});
export {
  _sfc_main as default
};
