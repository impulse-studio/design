import { defineComponent, useTemplateRef, openBlock, createBlock, withCtx, createVNode, unref, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import _sfc_main$3 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import { Form } from "../../../external/.pnpm/vee-validate@5.0.0-beta.0_vue@3.5.28_typescript@5.9.3_/external/vee-validate/dist/vee-validate.js";
import { provideFormFieldContext } from "../form/injectionKeys.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import "zod";
/* empty css                          */
/* empty css                            */
/* empty css                     */
/* empty css                                */
/* empty css                                      */
/* empty css                               */
import "../../../lib/zodSchemas.js";
/* empty css                                     */
import "lodash-es";
import "../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                      */
/* empty css                                */
/* empty css                                   */
import _sfc_main$2 from "./internals/SheetFooter.vue.js";
import _sfc_main$1 from "./DigiSheet.vue.js";
const _hoisted_1 = { class: "mt-2 mb-4 space-y-4" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormSheet",
  props: {
    title: {},
    description: {},
    cancelCta: {},
    submitCta: {},
    isLoading: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["submit"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const sheet = useTemplateRef("sheet");
    const defaultTexts = useReadonlyDefaultTexts();
    provideFormFieldContext("modal");
    function close() {
      sheet.value?.close();
    }
    __expose({
      open: () => {
        sheet.value?.open();
      },
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "sheet",
        ref: sheet,
        title: __props.title,
        description: __props.description
      }, {
        default: withCtx(() => [
          createVNode(unref(Form), {
            onSubmit: _cache[0] || (_cache[0] = ($event) => emit("submit"))
          }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "default")
              ]),
              createVNode(_sfc_main$2, { class: "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), {
                    variant: "secondary",
                    onClick: close
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.cancelCta || unref(defaultTexts).cancelCta), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$3), {
                    type: "submit",
                    variant: "success",
                    "is-loading": __props.isLoading,
                    disabled: __props.disabled
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.submitCta || unref(defaultTexts).submitCta), 1)
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
      }, 8, ["title", "description"]);
    };
  }
});
export {
  _sfc_main as default
};
