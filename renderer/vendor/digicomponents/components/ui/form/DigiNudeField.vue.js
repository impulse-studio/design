import { defineComponent, useModel, computed, toRefs, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, createElementVNode, renderSlot, mergeModels } from "vue";
import { Field } from "../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import { useFormFieldRules } from "./rules/useFormFieldRules.js";
import { stripNativeEventListeners } from "./utils.js";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$3 from "./formRowUi/DigiNudeFormRowContainer.vue.js";
import _sfc_main$2 from "./internals/FormControl.vue.js";
import _sfc_main$1 from "./internals/FormItem.vue.js";
import _sfc_main$4 from "./internals/FormMessage.vue.js";
const _hoisted_1 = { class: "w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNudeField",
  props: /* @__PURE__ */ mergeModels({
    label: {},
    zodSchema: {},
    name: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    placeholder: {},
    class: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.label);
    });
    const { zodSchema, required } = toRefs(props);
    const { rules } = useFormFieldRules({ zodSchema, required });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Field), {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
        name: __props.name,
        rules: unref(rules)
      }, {
        default: withCtx(({ componentField }) => [
          createVNode(_sfc_main$1, null, {
            default: withCtx(({ formItemId }) => [
              createVNode(_sfc_main$2, null, {
                default: withCtx(({ state }) => [
                  createVNode(_sfc_main$3, mergeProps(_ctx.$attrs, {
                    class: props.class,
                    disabled: __props.disabled
                  }), {
                    default: withCtx(() => [
                      createElementVNode("div", _hoisted_1, [
                        renderSlot(_ctx.$slots, "default", {
                          componentField: {
                            ...unref(stripNativeEventListeners)(componentField),
                            disabled: __props.disabled,
                            state,
                            placeholder: props.placeholder || parsedLabel.value.label,
                            id: formItemId
                          }
                        }),
                        createVNode(_sfc_main$4, { class: "mt-1" })
                      ])
                    ]),
                    _: 2
                  }, 1040, ["class", "disabled"])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1024)
        ]),
        _: 3
      }, 8, ["modelValue", "name", "rules"]);
    };
  }
});
export {
  _sfc_main as default
};
