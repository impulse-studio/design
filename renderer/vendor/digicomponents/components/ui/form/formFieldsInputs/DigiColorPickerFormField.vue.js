import { defineComponent, useModel, computed, openBlock, createBlock, mergeProps, withCtx, createElementVNode, createVNode, unref, normalizeProps, guardReactiveProps, renderSlot, mergeModels } from "vue";
import { z } from "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import DigiColorInput from "../../input/color/DigiColorInput.vue2.js";
/* empty css                            */
/* empty css                        */
/* empty css                                         */
import _sfc_main$2 from "../../input/text/DigiTextInput.vue.js";
/* empty css                                  */
/* empty css                             */
import { zodHexColor } from "../../../../lib/zodSchemas.js";
const _hoisted_1 = { class: "flex gap-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiColorPickerFormField",
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
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const computedZodSchema = computed(() => {
      return props.zodSchema || z.union([zodHexColor.optional(), z.literal("")]);
    });
    function onUpdate(str) {
      if (!str) {
        value.value = void 0;
        return;
      }
      if (!str.startsWith("#")) str = "#" + str;
      value.value = str.toLowerCase();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({ "model-value": value.value }, { ...props, zodSchema: computedZodSchema.value }, { "onUpdate:modelValue": onUpdate }), {
        top: withCtx(() => [
          renderSlot(_ctx.$slots, "top")
        ]),
        default: withCtx(({ componentField }) => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(DigiColorInput), normalizeProps(guardReactiveProps(componentField)), null, 16),
            createVNode(unref(_sfc_main$2), mergeProps(componentField, { class: "max-w-40" }), null, 16),
            renderSlot(_ctx.$slots, "append")
          ])
        ]),
        _: 3
      }, 16, ["model-value"]);
    };
  }
});
export {
  _sfc_main as default
};
