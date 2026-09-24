import { defineComponent, useModel, unref, openBlock, createBlock, mergeProps, withCtx, renderSlot, mergeModels } from "vue";
import _sfc_main$1 from "./DigiFormField.vue.js";
import _sfc_main$3 from "./DigiModalFormField.vue.js";
import { injectFormFieldContext } from "./injectionKeys.js";
import _sfc_main$2 from "./DigiNudeField.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormFieldContextRenderer",
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
    const value = useModel(__props, "modelValue");
    const props = __props;
    const context = props.context ?? injectFormFieldContext();
    return (_ctx, _cache) => {
      return unref(context) === "card" ? (openBlock(), createBlock(_sfc_main$1, mergeProps({ key: 0 }, { ..._ctx.$attrs, ...props }, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }), {
        default: withCtx(({ componentField }) => [
          renderSlot(_ctx.$slots, "default", { componentField })
        ]),
        top: withCtx(() => [
          renderSlot(_ctx.$slots, "top")
        ]),
        labelPrepend: withCtx(() => [
          renderSlot(_ctx.$slots, "labelPrepend")
        ]),
        _: 3
      }, 16, ["modelValue"])) : unref(context) === "nude" ? (openBlock(), createBlock(_sfc_main$2, mergeProps({ key: 1 }, { ..._ctx.$attrs, ...props }, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event)
      }), {
        default: withCtx(({ componentField }) => [
          renderSlot(_ctx.$slots, "default", { componentField })
        ]),
        _: 3
      }, 16, ["modelValue"])) : (openBlock(), createBlock(_sfc_main$3, mergeProps({ key: 2 }, { ..._ctx.$attrs, ...props }, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => value.value = $event)
      }), {
        default: withCtx(({ componentField }) => [
          renderSlot(_ctx.$slots, "default", { componentField })
        ]),
        labelPrepend: withCtx(() => [
          renderSlot(_ctx.$slots, "labelPrepend")
        ]),
        top: withCtx(() => [
          renderSlot(_ctx.$slots, "top")
        ]),
        _: 3
      }, 16, ["modelValue"]));
    };
  }
});
export {
  _sfc_main as default
};
