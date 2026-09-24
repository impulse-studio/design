import { defineComponent, useTemplateRef, ref, computed, openBlock, createBlock, withCtx, createVNode, unref, createTextVNode, toDisplayString, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { z } from "zod";
import _sfc_main$7 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import { Form } from "../../../node_modules/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/node_modules/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "../form/injectionKeys.js";
import { useReadonlyDefaultTexts, useReadonlyConfig } from "../../../config/composables.js";
/* empty css                          */
/* empty css                            */
/* empty css                     */
/* empty css                                */
/* empty css                                      */
/* empty css                               */
import "../../../lib/zodSchemas.js";
/* empty css                                    */
import _sfc_main$4 from "./internals/DigiModalDescription.vue2.js";
import _sfc_main$6 from "./internals/DigiModalFooter.vue.js";
import _sfc_main$2 from "./internals/DigiModalHeader.vue.js";
import _sfc_main$3 from "./internals/DigiModalTitle.vue2.js";
import "lodash-es";
import "../../../node_modules/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/node_modules/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                      */
/* empty css                                */
import _sfc_main$5 from "../form/formFieldsInputs/DigiTextFormField.vue.js";
/* empty css                                   */
import _sfc_main$1 from "./DigiBaseModal.vue.js";
const _hoisted_1 = { class: "my-4" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiConfirmInputModal",
  props: {
    title: {},
    confirmationPhrase: {},
    confirmBody: {},
    confirmCta: {},
    cancelCta: {},
    cancelDisabled: { type: Boolean },
    disabled: { type: Boolean },
    action: { type: Function }
  },
  emits: ["hide"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modal = useTemplateRef("confirmModal");
    const errorMessage = ref(null);
    const isLoading = ref(false);
    const defaultTexts = useReadonlyDefaultTexts();
    const config = useReadonlyConfig();
    async function runAction() {
      isLoading.value = true;
      try {
        await props.action();
        modal.value?.close();
        emit("hide", "confirmed");
      } catch (error) {
        console.error(error);
        errorMessage.value = config.value.extractErrorMessage(error);
      } finally {
        isLoading.value = false;
      }
    }
    function cancel() {
      modal.value?.close();
      emit("hide", "cancelled");
    }
    const userInput = ref("");
    const zodSchema = computed(() => {
      return z.string().refine((value) => value === props.confirmationPhrase, {
        message: defaultTexts.value.confirmationPhraseError
      });
    });
    provideFormFieldContext("nude");
    __expose({
      open: () => {
        errorMessage.value = null;
        modal.value?.open();
      },
      close: () => modal.value?.close()
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { ref: "confirmModal" }, {
        default: withCtx(() => [
          createVNode(unref(Form), { onSubmit: runAction }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.title), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createVNode(unref(_sfc_main$4), null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.confirmBody), 1)
                    ]),
                    _: 1
                  })
                ])
              ]),
              createVNode(unref(_sfc_main$5), {
                modelValue: userInput.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => userInput.value = $event),
                label: unref(defaultTexts).confirmInputIndication(__props.confirmationPhrase),
                placeholder: __props.confirmationPhrase,
                context: "modal",
                "zod-schema": zodSchema.value,
                name: "confirmationInput"
              }, null, 8, ["modelValue", "label", "placeholder", "zod-schema"]),
              errorMessage.value ? (openBlock(), createBlock(unref(_sfc_main$4), {
                key: 0,
                class: "text-destructive mt-4"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(errorMessage.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(_sfc_main$6), { class: "mt-6" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$7), {
                    variant: "secondary",
                    disabled: __props.cancelDisabled,
                    onClick: cancel
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.cancelCta || unref(defaultTexts).cancelCta), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(_sfc_main$7), {
                    variant: "destructive",
                    "is-loading": isLoading.value,
                    disabled: __props.disabled,
                    type: "submit"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.confirmCta || unref(defaultTexts).confirmCta), 1)
                    ]),
                    _: 1
                  }, 8, ["is-loading", "disabled"])
                ]),
                _: 1
              })
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 512);
    };
  }
});
export {
  _sfc_main as default
};
