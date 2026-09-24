import { defineComponent, openBlock, createElementBlock, createBlock, unref, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "flex items-center gap-1" };
const _hoisted_2 = { class: "text-muted-foreground text-sm font-medium uppercase" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFeatureName",
  props: {
    title: {},
    iconName: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
          key: 0,
          name: __props.iconName,
          class: "text-muted-foreground"
        }, null, 8, ["name"])) : createCommentVNode("", true),
        createElementVNode("span", _hoisted_2, toDisplayString(__props.title), 1)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
