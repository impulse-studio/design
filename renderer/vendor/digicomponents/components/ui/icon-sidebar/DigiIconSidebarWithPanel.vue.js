import { defineComponent, openBlock, createElementBlock, createVNode, withCtx, renderSlot, createElementVNode, unref } from "vue";
import DigiSidePanel from "../side-panel/DigiSidePanel.vue.js";
/* empty css                         */
/* empty css                          */
import DigiIconSidebar from "./DigiIconSidebar.vue.js";
const _hoisted_1 = { class: "flex" };
const _hoisted_2 = { class: "relative" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIconSidebarWithPanel",
  props: {
    isPanelOpen: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(DigiIconSidebar, null, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default")
          ]),
          footer: withCtx(() => [
            renderSlot(_ctx.$slots, "footer")
          ]),
          _: 3
        }),
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(DigiSidePanel), {
            "is-open": __props.isPanelOpen,
            side: "left"
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "side-panel")
            ]),
            _: 3
          }, 8, ["is-open"])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
