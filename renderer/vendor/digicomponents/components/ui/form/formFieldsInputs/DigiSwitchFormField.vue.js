import { defineComponent, useModel, openBlock, createBlock, mergeProps, unref, createSlots, withCtx, createVNode, normalizeProps, guardReactiveProps, renderSlot, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import { injectFormFieldContext } from "../injectionKeys.js";
import _sfc_main$2 from "../../switch/DigiSwitch.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSwitchFormField",
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
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const checked = useModel(__props, "modelValue");
    const props = __props;
    const context = props.context ?? injectFormFieldContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: checked.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => checked.value = $event)
      }, props, {
        context: unref(context) !== "modal" ? unref(context) : "card",
        class: [{
          "gap-2": unref(context) === "modal",
          "[&>div:first-child]:w-max [&>div:last-child]:w-min": unref(context) === "modal"
        }, ""]
      }), createSlots({
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$2), normalizeProps(guardReactiveProps({
            ...componentField,
            modelValue: componentField.modelValue
          })), null, 16)
        ]),
        _: 2
      }, [
        _ctx.$slots.labelPrepend ? {
          name: "labelPrepend",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "labelPrepend")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["modelValue", "context", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
