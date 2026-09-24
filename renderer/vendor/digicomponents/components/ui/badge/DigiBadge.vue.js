import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createBlock, createCommentVNode, toDisplayString, renderSlot } from "vue";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../lib/cn.js";
import { badgeVariants } from "./badgeVariants.js";
const _hoisted_1 = {
  key: 1,
  class: "ellipse-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiBadge",
  props: {
    color: {},
    class: {},
    text: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)(unref(badgeVariants)({ color: __props.color, hasIcon: !!__props.iconName }), props.class))
      }, [
        __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
          key: 0,
          name: __props.iconName
        }, null, 8, ["name"])) : createCommentVNode("", true),
        __props.text ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(props.text), 1)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "append")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
