import { defineComponent, resolveComponent, openBlock, createBlock, normalizeClass, unref, withCtx, createVNode, createElementVNode, toDisplayString } from "vue";
import { cn } from "../../../lib/cn.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { iconSidebarItemVariants } from "./variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIconSidebarLink",
  props: {
    label: {},
    iconName: {},
    selected: { type: Boolean },
    disabled: { type: Boolean },
    to: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createBlock(_component_RouterLink, {
        to: __props.disabled ? "" : __props.to,
        disabled: __props.disabled,
        class: normalizeClass(unref(cn)(unref(iconSidebarItemVariants)({ selected: __props.selected, disabled: __props.disabled })))
      }, {
        default: withCtx(() => [
          createVNode(unref(DigiRemixIcon), {
            name: __props.iconName,
            size: "2x"
          }, null, 8, ["name"]),
          createElementVNode("span", null, toDisplayString(__props.label), 1)
        ]),
        _: 1
      }, 8, ["to", "disabled", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
