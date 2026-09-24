import { defineComponent, openBlock, createBlock, unref, withCtx, createTextVNode, toDisplayString } from "vue";
import _sfc_main$1 from "../../actions/button/DigiButton.vue.js";
import _sfc_main$2 from "../../actions/link/DigiLink.vue.js";
import _sfc_main$3 from "../../actions/router-link/DigiRouterLink.vue.js";
/* empty css                            */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GettingStartedTaskAction",
  props: {
    action: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.action.kind === "button" ? (openBlock(), createBlock(unref(_sfc_main$1), {
        key: 0,
        variant: "primary",
        size: "sm",
        "icon-name": __props.action.iconName,
        "is-loading": __props.action.isLoading,
        disabled: __props.action.disabled,
        onClick: __props.action.handler
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.action.label), 1)
        ]),
        _: 1
      }, 8, ["icon-name", "is-loading", "disabled", "onClick"])) : __props.action.kind === "link" ? (openBlock(), createBlock(unref(_sfc_main$2), {
        key: 1,
        variant: "primary",
        size: "sm",
        href: __props.action.href,
        "icon-name": __props.action.iconName
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.action.label), 1)
        ]),
        _: 1
      }, 8, ["href", "icon-name"])) : (openBlock(), createBlock(unref(_sfc_main$3), {
        key: 2,
        variant: "primary",
        size: "sm",
        to: __props.action.to,
        "new-tab": __props.action.openInNewTab,
        "icon-name": __props.action.iconName
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.action.label), 1)
        ]),
        _: 1
      }, 8, ["to", "new-tab", "icon-name"]));
    };
  }
});
export {
  _sfc_main as default
};
