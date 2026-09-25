import { defineComponent, useModel, computed, toRefs, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, createElementVNode, renderSlot, createTextVNode, toDisplayString, createCommentVNode, mergeModels } from "vue";
import { Field } from "../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
import { stripNativeEventListeners } from "./utils.js";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$3 from "./formRowUi/DigiFormRowContainer.vue.js";
import _sfc_main$2 from "./internals/FormControl.vue.js";
import _sfc_main$4 from "./internals/FormDescription.vue.js";
import _sfc_main$7 from "./internals/FormHelpLink.vue.js";
import _sfc_main$1 from "./internals/FormItem.vue.js";
import _sfc_main$6 from "./internals/FormLabel.vue.js";
import _sfc_main$5 from "./internals/FormMessage.vue.js";
import { useFormFieldRules } from "./rules/useFormFieldRules.js";
const _hoisted_1 = { class: "w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormField",
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
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.label);
    });
    const fieldDescription = computed(() => {
      return props.description ?? parsedLabel.value.description;
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
                  createVNode(_sfc_main$3, mergeProps(_ctx.$attrs, { disabled: __props.disabled }), {
                    label: withCtx(() => [
                      renderSlot(_ctx.$slots, "top"),
                      createVNode(_sfc_main$6, null, {
                        labelPrepend: withCtx(() => [
                          renderSlot(_ctx.$slots, "labelPrepend")
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" " + toDisplayString(parsedLabel.value.label), 1)
                        ]),
                        _: 3
                      }),
                      fieldDescription.value ? (openBlock(), createBlock(_sfc_main$4, { key: 0 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(fieldDescription.value), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(_sfc_main$7, {
                        "help-link": parsedLabel.value.helpLink
                      }, null, 8, ["help-link"])
                    ]),
                    item: withCtx(() => [
                      createElementVNode("div", _hoisted_1, [
                        renderSlot(_ctx.$slots, "default", {
                          componentField: {
                            ...unref(stripNativeEventListeners)(componentField),
                            disabled: __props.disabled,
                            state,
                            placeholder: __props.placeholder,
                            id: formItemId
                          }
                        }),
                        __props.indications ? (openBlock(), createBlock(_sfc_main$4, {
                          key: 0,
                          class: "mt-1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.indications), 1)
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(_sfc_main$5, { class: "mt-1" })
                      ])
                    ]),
                    _: 2
                  }, 1040, ["disabled"])
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
