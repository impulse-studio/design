import { defineComponent, useModel, useTemplateRef, openBlock, createElementBlock, Fragment, createVNode, mergeProps, withCtx, createElementVNode, unref, createSlots, renderSlot, mergeModels } from "vue";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
import _sfc_main$2 from "../../input/text/DigiTextInput.vue.js";
/* empty css                                  */
/* empty css                             */
const _hoisted_1 = { class: "space-y-2" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextFormField",
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
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["search"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emits = __emit;
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
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$1, mergeProps({
          modelValue: value.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => value.value = $event)
        }, { ...props, ..._ctx.$attrs }), {
          default: withCtx(({ componentField }) => [
            createElementVNode("div", _hoisted_1, [
              createVNode(unref(_sfc_main$2), mergeProps(componentField, {
                ref_key: "input",
                ref: input,
                "icon-name": __props.iconName,
                formatter: __props.formatter,
                onOnEnterPressed: _cache[0] || (_cache[0] = ($event) => emits("search")),
                onFocusout: _cache[1] || (_cache[1] = ($event) => emits("search"))
              }), createSlots({ _: 2 }, [
                _ctx.$slots.prepend ? {
                  name: "prepend",
                  fn: withCtx(() => [
                    renderSlot(_ctx.$slots, "prepend")
                  ]),
                  key: "0"
                } : void 0,
                _ctx.$slots.append ? {
                  name: "append",
                  fn: withCtx(() => [
                    renderSlot(_ctx.$slots, "append")
                  ]),
                  key: "1"
                } : void 0
              ]), 1040, ["icon-name", "formatter"])
            ])
          ]),
          _: 3
        }, 16, ["modelValue"]),
        renderSlot(_ctx.$slots, "bottom")
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
