import { defineComponent, useModel, computed, useTemplateRef, openBlock, createBlock, createSlots, withCtx, createVNode, unref, renderSlot, mergeModels } from "vue";
import { useId } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useId.js";
import { Form } from "../../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "../../form/injectionKeys.js";
/* empty css                            */
/* empty css                             */
import _sfc_main$2 from "../../tooltip/DigiTextTooltip.vue.js";
import "zod";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
import _sfc_main$3 from "../../switch/DigiSwitch.vue.js";
/* empty css                                         */
/* empty css                                  */
import "../../../../lib/zodSchemas.js";
/* empty css                                        */
import "lodash-es";
import "../../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
/* empty css                                      */
import _sfc_main$4 from "./FormCardFooter.vue.js";
import _sfc_main$1 from "./FormCardLayout.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToggleableFormCard",
  props: /* @__PURE__ */ mergeModels({
    title: {},
    description: {},
    helpLink: {},
    isLoading: { type: Boolean },
    disabled: { type: Boolean },
    hasModifications: { type: Boolean },
    resetCta: {},
    saveCta: {},
    smallSpacing: { type: Boolean },
    hideResetCta: { type: Boolean, default: false },
    toggleTooltip: {}
  }, {
    "toggled": /* @__PURE__ */ (() => ({ type: Boolean, ...{
      required: true
    } }))(),
    "toggledModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit", "reset"], ["update:toggled"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const toggled = useModel(__props, "toggled");
    const emit = __emit;
    const toggledForSwitch = computed({
      get() {
        return toggled.value;
      },
      set(value) {
        toggled.value = value ?? false;
      }
    });
    const formId = useId();
    provideFormFieldContext("card");
    const veeForm = useTemplateRef("form");
    const displayToggle = computed(() => {
      return toggled.value !== void 0;
    });
    const displayCardBody = computed(() => {
      return toggled.value !== false;
    });
    __expose({
      resetForm: () => {
        veeForm.value?.resetForm();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        title: __props.title,
        description: __props.description,
        "help-link": __props.helpLink,
        "small-spacing": __props.smallSpacing
      }, createSlots({ _: 2 }, [
        displayToggle.value ? {
          name: "actions",
          fn: withCtx(() => [
            createVNode(unref(_sfc_main$2), { text: __props.toggleTooltip }, {
              default: withCtx(() => [
                createVNode(unref(_sfc_main$3), {
                  modelValue: toggledForSwitch.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => toggledForSwitch.value = $event),
                  disabled: __props.disabled || __props.isLoading,
                  class: "flex items-center"
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
            }, 8, ["text"])
          ]),
          key: "0"
        } : void 0,
        displayCardBody.value ? {
          name: "default",
          fn: withCtx(() => [
            createVNode(unref(Form), {
              id: unref(formId),
              ref: "form",
              onSubmit: _cache[1] || (_cache[1] = ($event) => emit("submit"))
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id"])
          ]),
          key: "1"
        } : void 0,
        displayCardBody.value ? {
          name: "footer",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "footer", { formId: unref(formId) }, () => [
              createVNode(_sfc_main$4, {
                "has-modifications": __props.hasModifications,
                "reset-cta": __props.resetCta,
                "save-cta": __props.saveCta,
                "is-loading": __props.isLoading,
                disabled: __props.disabled,
                "form-id": unref(formId),
                "hide-reset-cta": __props.hideResetCta,
                onReset: _cache[2] || (_cache[2] = ($event) => emit("reset"))
              }, null, 8, ["has-modifications", "reset-cta", "save-cta", "is-loading", "disabled", "form-id", "hide-reset-cta"])
            ])
          ]),
          key: "2"
        } : void 0
      ]), 1032, ["title", "description", "help-link", "small-spacing"]);
    };
  }
});
export {
  _sfc_main as default
};
