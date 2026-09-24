import { defineComponent, openBlock, createBlock, withCtx, createElementVNode, unref, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../basics/DigiDropdownMenuItem.vue.js";
const _hoisted_1 = ["href"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiLinkDropdownItem",
  props: {
    href: {},
    text: {},
    iconName: {},
    iconSize: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { disabled: __props.disabled }, {
        default: withCtx(() => [
          createElementVNode("a", {
            href: __props.href,
            target: "_blank"
          }, [
            __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
              key: 0,
              name: __props.iconName,
              size: __props.iconSize
            }, null, 8, ["name", "size"])) : createCommentVNode("", true),
            createTextVNode(" " + toDisplayString(__props.text), 1)
          ], 8, _hoisted_1)
        ]),
        _: 1
      }, 8, ["disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
