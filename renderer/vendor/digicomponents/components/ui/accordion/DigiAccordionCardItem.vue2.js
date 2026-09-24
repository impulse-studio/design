import { defineComponent, openBlock, createBlock, withCtx, createVNode, normalizeClass, unref, renderSlot } from "vue";
import _sfc_main$2 from "../card/internals/BaseCard.vue.js";
import { cardVariants } from "../card/variants.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$4 from "./DigiAccordionContent.vue.js";
import _sfc_main$1 from "./DigiAccordionItem.vue.js";
import _sfc_main$3 from "./DigiAccordionTrigger.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAccordionCardItem",
  props: {
    itemKey: {},
    size: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        value: props.itemKey
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, {
            class: normalizeClass(unref(cardVariants)({ size: __props.size }))
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$3, { class: "p-0" }, {
                icon: withCtx(() => [
                  createVNode(DigiRemixIcon, {
                    class: "icon",
                    name: "arrow-down-s-line"
                  })
                ]),
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "title", {}, void 0, true)
                ]),
                _: 3
              }),
              createVNode(_sfc_main$4, { class: "pt-1 pb-0" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "content", {}, void 0, true)
                ]),
                _: 3
              })
            ]),
            _: 3
          }, 8, ["class"])
        ]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
export {
  _sfc_main as default
};
