import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode, createElementVNode, renderSlot } from "vue";
import { Form } from "../../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
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
/* empty css                                        */
import _sfc_main$1 from "../internals/DigiModalScrollArea.vue.js";
import "lodash-es";
import "../../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
/* empty css                                      */
import _sfc_main$2 from "../internals/DigiFormModalFooter.vue.js";
const _hoisted_1 = { class: "space-y-4 px-6 py-0.5" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiMultiStepModalFormStep",
  props: {
    submitCta: {},
    submitCtaVariant: {},
    submitCtaIconName: {},
    cancelCta: {},
    isLoading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideCancelButton: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    provideFormFieldContext("modal");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Form), {
        class: "mt-4 max-w-full overflow-x-hidden",
        onSubmit: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("submit"))
      }, {
        default: withCtx(() => [
          createVNode(unref(_sfc_main$1), { class: "max-h-[65dvh]" }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "default")
              ])
            ]),
            _: 3
          }),
          createVNode(_sfc_main$2, {
            "submit-cta": __props.submitCta,
            "submit-cta-variant": __props.submitCtaVariant,
            "submit-cta-icon-name": __props.submitCtaIconName,
            "cancel-cta": __props.cancelCta,
            "is-loading": __props.isLoading,
            disabled: __props.disabled,
            "hide-cancel-button": __props.hideCancelButton,
            onCancel: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cancel"))
          }, null, 8, ["submit-cta", "submit-cta-variant", "submit-cta-icon-name", "cancel-cta", "is-loading", "disabled", "hide-cancel-button"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
