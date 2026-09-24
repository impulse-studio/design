import { defineComponent, useTemplateRef, computed, openBlock, createBlock, withCtx, createVNode, unref, createElementVNode, renderSlot, createElementBlock } from "vue";
import { Form } from "../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "../form/injectionKeys.js";
/* empty css                         */
/* empty css                          */
import "zod";
/* empty css                            */
/* empty css                     */
/* empty css                                */
/* empty css                                      */
/* empty css                               */
import "../../../lib/zodSchemas.js";
/* empty css                                    */
import _sfc_main$3 from "./internals/DigiModalScrollArea.vue.js";
import "lodash-es";
import "../../../node_modules/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/node_modules/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                      */
/* empty css                                */
/* empty css                                   */
import _sfc_main$1 from "./DigiBaseModal.vue.js";
import _sfc_main$4 from "./internals/DigiFormModalFooter.vue.js";
import _sfc_main$2 from "./internals/DigiModalFullHeader.vue.js";
const _hoisted_1 = { class: "space-y-4 px-6 py-0.5" };
const _hoisted_2 = {
  key: 1,
  class: "space-y-4 px-6 py-0.5"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormModal",
  props: {
    title: {},
    description: {},
    cancelCta: {},
    submitCta: {},
    submitCtaVariant: {},
    submitCtaIconName: {},
    isLoading: { type: Boolean },
    hideCancelButton: { type: Boolean, default: false },
    disabled: { type: Boolean },
    scrollable: { type: Boolean, default: true },
    size: {},
    hideCloseButton: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const modal = useTemplateRef("modal");
    provideFormFieldContext("modal");
    function open() {
      modal.value?.open();
    }
    function close() {
      modal.value?.close();
    }
    function onCancel() {
      emits("cancel");
      close();
    }
    function onSubmit() {
      emits("submit");
    }
    const nudeForm = useTemplateRef("form");
    const isValid = computed(
      () => nudeForm.value?.meta.touched ? nudeForm.value?.meta.valid : void 0
    );
    __expose({
      open,
      close,
      isValid
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "modal",
        ref: modal,
        size: __props.size,
        scrollable: "",
        "hide-close-button": __props.hideCloseButton,
        onHide: onCancel
      }, {
        default: withCtx(() => [
          createVNode(unref(Form), {
            ref: "form",
            class: "max-w-full overflow-x-hidden",
            onSubmit
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                title: __props.title,
                description: __props.description,
                class: "p-6"
              }, null, 8, ["title", "description"]),
              __props.scrollable ? (openBlock(), createBlock(unref(_sfc_main$3), { key: 0 }, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_1, [
                    renderSlot(_ctx.$slots, "default")
                  ])
                ]),
                _: 3
              })) : (openBlock(), createElementBlock("div", _hoisted_2, [
                renderSlot(_ctx.$slots, "default")
              ])),
              createVNode(_sfc_main$4, {
                "cancel-cta": __props.cancelCta,
                "submit-cta": __props.submitCta,
                "submit-cta-variant": __props.submitCtaVariant,
                "submit-cta-icon-name": __props.submitCtaIconName,
                "is-loading": __props.isLoading,
                disabled: __props.disabled,
                "hide-cancel-button": __props.hideCancelButton,
                onCancel
              }, {
                "footer-left": withCtx(() => [
                  renderSlot(_ctx.$slots, "footer-left")
                ]),
                _: 3
              }, 8, ["cancel-cta", "submit-cta", "submit-cta-variant", "submit-cta-icon-name", "is-loading", "disabled", "hide-cancel-button"])
            ]),
            _: 3
          }, 512)
        ]),
        _: 3
      }, 8, ["size", "hide-close-button"]);
    };
  }
});
export {
  _sfc_main as default
};
