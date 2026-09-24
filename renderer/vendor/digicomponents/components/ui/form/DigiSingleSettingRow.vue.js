import { defineComponent, useModel, computed, watch, ref, toRefs, openBlock, createBlock, unref, withCtx, createVNode, createElementVNode, withKeys, renderSlot, createCommentVNode, createTextVNode, toDisplayString, mergeModels } from "vue";
import { Form, Field } from "../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import _sfc_main$3 from "./formRowUi/DigiFormRowContainer.vue.js";
import { stripNativeEventListeners } from "./utils.js";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import { wait } from "../../../lib/promises.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import DigiSpinner from "../spinner/DigiSpinner.vue.js";
import _sfc_main$2 from "./internals/FormControl.vue.js";
import _sfc_main$4 from "./internals/FormDescription.vue.js";
import _sfc_main$7 from "./internals/FormHelpLink.vue.js";
import _sfc_main$1 from "./internals/FormItem.vue.js";
import _sfc_main$6 from "./internals/FormLabel.vue.js";
import _sfc_main$5 from "./internals/FormMessage.vue.js";
import { useFormFieldRules } from "./rules/useFormFieldRules.js";
const _hoisted_1 = { class: "flex w-6 items-center justify-end" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSingleSettingRow",
  props: /* @__PURE__ */ mergeModels({
    save: {},
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    mode: { default: "onChange" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    placeholder: {}
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
    watch(
      () => value.value,
      () => {
        if (props.mode === "onChange") {
          saveValue();
        }
      }
    );
    const savingState = ref("idle");
    async function saveValue() {
      if (savingState.value === "saving") return;
      savingState.value = "saving";
      try {
        await props.save(value.value);
        savingState.value = "saved";
        await wait(2e3);
        savingState.value = "idle";
      } finally {
        savingState.value = "idle";
      }
    }
    const { zodSchema, required } = toRefs(props);
    const { rules } = useFormFieldRules({ zodSchema, required });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Form), { onSubmit: saveValue }, {
        default: withCtx(() => [
          createVNode(unref(Field), {
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
                      createVNode(_sfc_main$3, {
                        disabled: __props.disabled,
                        class: "flex w-full justify-between gap-5"
                      }, {
                        label: withCtx(() => [
                          renderSlot(_ctx.$slots, "top"),
                          createVNode(_sfc_main$6, { class: "only:mb-2" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(parsedLabel.value.label), 1)
                            ]),
                            _: 1
                          }),
                          parsedLabel.value.description ? (openBlock(), createBlock(_sfc_main$4, { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(parsedLabel.value.description), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_sfc_main$7, {
                            "help-link": parsedLabel.value.helpLink
                          }, null, 8, ["help-link"])
                        ]),
                        item: withCtx(() => [
                          createElementVNode("div", {
                            class: "flex",
                            onKeydown: withKeys(saveValue, ["enter"]),
                            onFocusout: saveValue
                          }, [
                            renderSlot(_ctx.$slots, "default", {
                              componentField: {
                                ...unref(stripNativeEventListeners)(componentField),
                                disabled: __props.disabled || savingState.value === "saving",
                                state,
                                placeholder: __props.placeholder,
                                id: formItemId
                              }
                            }),
                            createElementVNode("div", _hoisted_1, [
                              savingState.value === "saving" ? (openBlock(), createBlock(unref(DigiSpinner), {
                                key: 0,
                                class: "transition-opacity"
                              })) : savingState.value === "saved" ? (openBlock(), createBlock(DigiRemixIcon, {
                                key: 1,
                                class: "text-success transition-opacity",
                                name: "check-line",
                                size: "lg"
                              })) : createCommentVNode("", true)
                            ])
                          ], 32),
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
                        ]),
                        _: 2
                      }, 1032, ["disabled"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1024)
            ]),
            _: 3
          }, 8, ["modelValue", "name", "rules"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
