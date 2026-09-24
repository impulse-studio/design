import { defineComponent, openBlock, createBlock, withCtx, createVNode, renderSlot, createElementVNode } from "vue";
import DigiGroupCardActions from "./internals/DigiGroupCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiGroupCardContainer.vue.js";
import DigiGroupTopPartContainer from "./internals/DigiGroupTopPartContainer.vue.js";
const _hoisted_1 = { class: "font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiGroupCard",
  props: {
    disabled: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { disabled: __props.disabled }, {
        default: withCtx(() => [
          createVNode(DigiGroupTopPartContainer, null, {
            title: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "title")
              ])
            ]),
            "title-more-info": withCtx(() => [
              renderSlot(_ctx.$slots, "title-more-info")
            ]),
            actions: withCtx(() => [
              createVNode(DigiGroupCardActions, null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "actions")
                ]),
                _: 3
              })
            ]),
            _: 3
          }),
          renderSlot(_ctx.$slots, "body")
        ]),
        _: 3
      }, 8, ["disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
