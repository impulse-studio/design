import { defineComponent, openBlock, createBlock, withCtx, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../basics/DigiDropdownMenuItem.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiBasicDropdownItem",
  props: {
    text: {},
    iconName: {},
    iconSize: {},
    disabled: { type: Boolean },
    variant: {}
  },
  emits: ["select"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        disabled: __props.disabled,
        variant: __props.variant,
        onSelect: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("select", $event))
      }, {
        default: withCtx(() => [
          __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
            key: 0,
            name: __props.iconName,
            size: __props.iconSize
          }, null, 8, ["name", "size"])) : createCommentVNode("", true),
          createTextVNode(" " + toDisplayString(__props.text), 1)
        ]),
        _: 1
      }, 8, ["disabled", "variant"]);
    };
  }
});
export {
  _sfc_main as default
};
