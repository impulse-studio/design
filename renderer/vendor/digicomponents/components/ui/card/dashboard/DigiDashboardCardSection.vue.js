import { defineComponent, openBlock, createElementBlock, createElementVNode, createBlock, unref, createCommentVNode, toDisplayString, renderSlot } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "not-first:mt-2" };
const _hoisted_2 = { class: "flex items-center gap-1" };
const _hoisted_3 = { class: "font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDashboardCardSection",
  props: {
    sectionTitle: {},
    iconName: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
            key: 0,
            name: __props.iconName
          }, null, 8, ["name"])) : createCommentVNode("", true),
          createElementVNode("h3", _hoisted_3, toDisplayString(__props.sectionTitle), 1),
          renderSlot(_ctx.$slots, "action")
        ]),
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
