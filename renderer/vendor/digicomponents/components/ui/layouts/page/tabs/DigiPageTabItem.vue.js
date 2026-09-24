import { defineComponent, resolveComponent, openBlock, createBlock, withCtx, unref, createCommentVNode, createElementVNode, toDisplayString, mergeProps } from "vue";
import "vue-router";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
import _sfc_main$2 from "../../../tooltip/DigiTextTooltip.vue.js";
import _sfc_main$1 from "../../../tabs/TabPrimitive.vue.js";
const _hoisted_1 = { class: "truncate" };
const _hoisted_2 = ["href", "data-state", "onClick"];
const _hoisted_3 = { class: "truncate" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPageTabItem",
  props: {
    to: {},
    iconName: {},
    label: {},
    disableState: { default: () => ({
      isDisabled: false
    }) },
    newTab: { type: Boolean },
    orientation: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createBlock(_sfc_main$1, { orientation: __props.orientation }, {
        default: withCtx(() => [
          props.disableState.isDisabled ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            text: props.disableState.reason,
            class: "cursor-default opacity-50"
          }, {
            default: withCtx(() => [
              __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
                key: 0,
                name: __props.iconName,
                class: "mr-2"
              }, null, 8, ["name"])) : createCommentVNode("", true),
              createElementVNode("span", _hoisted_1, toDisplayString(__props.label), 1)
            ]),
            _: 1
          }, 8, ["text"])) : (openBlock(), createBlock(_component_RouterLink, {
            key: 1,
            to: __props.to,
            custom: "",
            target: __props.newTab ? "_blank" : void 0
          }, {
            default: withCtx(({ isActive, href, navigate }) => [
              createElementVNode("a", mergeProps({
                href,
                "data-state": isActive ? "active" : "inactive"
              }, _ctx.$attrs, { onClick: navigate }), [
                __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
                  key: 0,
                  name: __props.iconName,
                  class: "mr-2"
                }, null, 8, ["name"])) : createCommentVNode("", true),
                createElementVNode("span", _hoisted_3, toDisplayString(__props.label), 1)
              ], 16, _hoisted_2)
            ]),
            _: 1
          }, 8, ["to", "target"]))
        ]),
        _: 1
      }, 8, ["orientation"]);
    };
  }
});
export {
  _sfc_main as default
};
