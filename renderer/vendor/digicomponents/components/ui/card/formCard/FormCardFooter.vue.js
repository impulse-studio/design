import { defineComponent, openBlock, createElementBlock, Fragment, createBlock, unref, withCtx, createTextVNode, toDisplayString, createCommentVNode, createVNode } from "vue";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
import _sfc_main$1 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormCardFooter",
  props: {
    hasModifications: { type: Boolean },
    resetCta: {},
    saveCta: {},
    isLoading: { type: Boolean },
    disabled: { type: Boolean },
    formId: {},
    hideResetCta: { type: Boolean }
  },
  emits: ["reset"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        !__props.hideResetCta ? (openBlock(), createBlock(unref(_sfc_main$1), {
          key: 0,
          variant: "secondary",
          disabled: !__props.hasModifications,
          onClick: _cache[0] || (_cache[0] = ($event) => emit("reset"))
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(__props.resetCta || unref(defaultTexts).resetCta), 1)
          ]),
          _: 1
        }, 8, ["disabled"])) : createCommentVNode("", true),
        createVNode(unref(_sfc_main$1), {
          type: "submit",
          variant: "success",
          "form-id": __props.formId,
          "is-loading": __props.isLoading,
          disabled: __props.disabled || !__props.hasModifications
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(__props.saveCta || unref(defaultTexts).saveCta), 1)
          ]),
          _: 1
        }, 8, ["form-id", "is-loading", "disabled"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
