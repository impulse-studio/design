import { defineComponent, openBlock, createElementBlock, createElementVNode, renderSlot, createVNode } from "vue";
import _sfc_main$1 from "../internals/DigiFormModalFooter.vue.js";
const _hoisted_1 = { class: "mt-4 max-w-full overflow-x-hidden" };
const _hoisted_2 = { class: "space-y-4 px-6 py-0.5" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiMultiStepModalInfoStep",
  props: {
    submitCta: {},
    submitCtaVariant: {},
    submitCtaIconName: {},
    cancelCta: {},
    hideCancelButton: { type: Boolean },
    next: {},
    back: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "default")
        ]),
        createVNode(_sfc_main$1, {
          "submit-cta": __props.submitCta,
          "submit-cta-variant": __props.submitCtaVariant,
          "submit-cta-icon-name": __props.submitCtaIconName,
          "cancel-cta": __props.cancelCta,
          "hide-cancel-button": __props.hideCancelButton,
          onCancel: __props.back,
          onSubmit: __props.next
        }, null, 8, ["submit-cta", "submit-cta-variant", "submit-cta-icon-name", "cancel-cta", "hide-cancel-button", "onCancel", "onSubmit"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
