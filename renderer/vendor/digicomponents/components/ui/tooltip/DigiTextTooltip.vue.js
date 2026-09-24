import { defineComponent, openBlock, createBlock, withCtx, createVNode, mergeProps, unref, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { cn } from "../../../lib/cn.js";
import _sfc_main$1 from "./internals/DigiTooltip.vue.js";
import _sfc_main$3 from "./internals/DigiTooltipContent.vue.js";
import _sfc_main$2 from "./internals/DigiTooltipTrigger.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextTooltip",
  props: {
    text: {},
    side: {},
    delay: {},
    triggerAsChild: { type: Boolean, default: false },
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { "delay-duration": __props.delay }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, mergeProps(_ctx.$attrs, {
            as: "div",
            class: unref(cn)({ "h-fit w-fit": !__props.triggerAsChild }, props.class),
            "as-child": __props.triggerAsChild
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["class", "as-child"]),
          __props.text?.length ? (openBlock(), createBlock(_sfc_main$3, {
            key: 0,
            side: __props.side
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.text), 1)
            ]),
            _: 1
          }, 8, ["side"])) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["delay-duration"]);
    };
  }
});
export {
  _sfc_main as default
};
