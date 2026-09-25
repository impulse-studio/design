import { defineComponent, useId, computed, useTemplateRef, openBlock, createElementBlock, createElementVNode, createVNode, unref, withCtx, createTextVNode, toDisplayString, renderSlot } from "vue";
import _sfc_main$1 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import "zod";
/* empty css                          */
import _sfc_main$2 from "../form/DigiNudeForm.vue.js";
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
const _hoisted_1 = { class: "flex h-full flex-col" };
const _hoisted_2 = { class: "grid grid-cols-5 gap-4 border-b px-6 py-2" };
const _hoisted_3 = { class: "text-md col-span-3 min-w-max self-center text-center font-bold uppercase" };
const _hoisted_4 = { class: "justify-self-end" };
const _hoisted_5 = { class: "overflow-y-auto" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiVerticalMenuSubForm",
  props: {
    title: {},
    backLabel: {}
  },
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const formId = useId();
    const defaultTexts = useReadonlyDefaultTexts();
    const backLabelValue = computed(
      () => props.backLabel ?? defaultTexts.value.backButtonLabel
    );
    const nudeForm = useTemplateRef("nudeForm");
    __expose({
      isValid: computed(() => nudeForm.value?.isValid ?? false),
      formId
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(_sfc_main$1), {
            class: "align-self-center items-center justify-self-start",
            "icon-name": "arrow-left-line",
            variant: "link",
            "form-id": unref(formId),
            type: "submit"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(backLabelValue.value), 1)
            ]),
            _: 1
          }, 8, ["form-id"]),
          createElementVNode("div", _hoisted_3, toDisplayString(__props.title), 1),
          createElementVNode("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "actions")
          ])
        ]),
        createElementVNode("div", _hoisted_5, [
          createVNode(unref(_sfc_main$2), {
            id: unref(formId),
            ref_key: "nudeForm",
            ref: nudeForm,
            context: "modal",
            onSubmit: _cache[0] || (_cache[0] = () => {
              emits("close");
            })
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["id"])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
