import { defineComponent, useModel, computed, useTemplateRef, openBlock, createBlock, mergeProps, withCtx, createElementVNode, createVNode, unref, renderSlot, mergeModels } from "vue";
import { z } from "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/url/DigiUrlInput.vue.js";
/* empty css                                  */
/* empty css                             */
const _hoisted_1 = { class: "space-y-2" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiUrlFormField",
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
    enforceHttps: { type: Boolean }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const computedZodSchema = computed(() => {
      return props.zodSchema || z.union([
        z.url(props.enforceHttps ? { protocol: /^https$/ } : void 0).optional().nullable(),
        z.literal("")
      ]);
    });
    const input = useTemplateRef("inputRef");
    __expose({
      isValid: computed(() => {
        return computedZodSchema.value.safeParse(value.value).success;
      }),
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
        top: withCtx(() => [
          renderSlot(_ctx.$slots, "top")
        ]),
        labelPrepend: withCtx(() => [
          renderSlot(_ctx.$slots, "labelPrepend")
        ]),
        default: withCtx(({ componentField }) => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(_sfc_main$2), mergeProps({ ref: "inputRef" }, componentField, { "icon-name": __props.iconName }), null, 16, ["icon-name"]),
            renderSlot(_ctx.$slots, "bottom")
          ])
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
