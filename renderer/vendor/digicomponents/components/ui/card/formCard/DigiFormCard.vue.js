import { defineComponent, useTemplateRef, openBlock, createBlock, createSlots, withCtx, renderSlot, createVNode, unref } from "vue";
import { useId } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useId.js";
import { Form } from "../../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "../../form/injectionKeys.js";
/* empty css                            */
/* empty css                             */
import "zod";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import "../../../../lib/zodSchemas.js";
/* empty css                                       */
import "lodash-es";
import "../../../../node_modules/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/node_modules/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
/* empty css                                      */
import _sfc_main$2 from "./FormCardFooter.vue.js";
import _sfc_main$1 from "./FormCardLayout.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormCard",
  props: {
    title: {},
    description: {},
    helpLink: {},
    isLoading: { type: Boolean },
    disabled: { type: Boolean },
    hasModifications: { type: Boolean },
    resetCta: {},
    saveCta: {},
    smallSpacing: { type: Boolean },
    hideResetCta: { type: Boolean, default: false }
  },
  emits: ["submit", "reset"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const formId = useId();
    provideFormFieldContext("card");
    const veeForm = useTemplateRef("form");
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
        _ctx.$slots.actions ? {
          name: "actions",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "actions")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.default ? {
          name: "default",
          fn: withCtx(() => [
            createVNode(unref(Form), {
              id: unref(formId),
              ref: "form",
              onSubmit: _cache[0] || (_cache[0] = ($event) => emit("submit"))
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id"])
          ]),
          key: "1"
        } : void 0,
        _ctx.$slots.default ? {
          name: "footer",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "footer", { formId: unref(formId) }, () => [
              createVNode(_sfc_main$2, {
                "has-modifications": __props.hasModifications,
                "reset-cta": __props.resetCta,
                "save-cta": __props.saveCta,
                "is-loading": __props.isLoading,
                disabled: __props.disabled,
                "form-id": unref(formId),
                "hide-reset-cta": __props.hideResetCta,
                onReset: _cache[1] || (_cache[1] = ($event) => emit("reset"))
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
