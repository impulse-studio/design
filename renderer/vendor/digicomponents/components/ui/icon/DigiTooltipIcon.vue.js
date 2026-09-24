import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode, mergeProps } from "vue";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
import DigiRemixIcon from "./DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "DigiTooltipIcon",
  props: {
    iconName: {},
    text: {},
    size: {},
    side: {},
    delay: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: __props.text,
        side: __props.side,
        delay: __props.delay,
        class: "inline"
      }, {
        default: withCtx(() => [
          createVNode(DigiRemixIcon, mergeProps({
            name: __props.iconName,
            size: __props.size
          }, _ctx.$attrs), null, 16, ["name", "size"])
        ]),
        _: 1
      }, 8, ["text", "side", "delay"]);
    };
  }
}))());
export {
  _sfc_main as default
};
