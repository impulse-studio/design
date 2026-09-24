import { defineComponent, openBlock, createBlock, withCtx, createElementVNode, renderSlot, unref, createTextVNode, toDisplayString, createCommentVNode, createVNode } from "vue";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
import _sfc_main$2 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
import _sfc_main$1 from "./DigiModalFooter.vue.js";
const _hoisted_1 = { class: "mr-auto" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormModalFooter",
  props: {
    cancelCta: {},
    submitCta: {},
    submitCtaVariant: {},
    submitCtaIconName: {},
    isLoading: { type: Boolean, default: false },
    hideCancelButton: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["cancel", "submit"],
  setup(__props) {
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { class: "p-6" }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "footer-left")
          ]),
          __props.hideCancelButton !== true ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            variant: "secondary",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cancel"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.cancelCta || unref(defaultTexts).cancelCta), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(unref(_sfc_main$2), {
            type: "submit",
            variant: __props.submitCtaVariant ?? "success",
            "is-loading": __props.isLoading,
            "icon-name": props.submitCtaIconName,
            disabled: __props.disabled,
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("submit"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.submitCta || unref(defaultTexts).submitCta), 1)
            ]),
            _: 1
          }, 8, ["variant", "is-loading", "icon-name", "disabled"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
