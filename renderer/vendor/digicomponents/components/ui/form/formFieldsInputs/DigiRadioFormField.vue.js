import { defineComponent, useModel, openBlock, createBlock, unref, mergeProps, withCtx, createVNode, renderSlot, mergeModels } from "vue";
/* empty css                            */
/* empty css                             */
import "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import "../../../../lib/zodSchemas.js";
/* empty css                                        */
import "lodash-es";
import "../../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
import _sfc_main$2 from "../../radio-group/DigiRadioGroup.vue.js";
/* empty css                              */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioFormField",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    context: {},
    orientation: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), mergeProps(props, {
        modelValue: model.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event)
      }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), mergeProps(componentField, {
            orientation: props.orientation
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["orientation"])
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
