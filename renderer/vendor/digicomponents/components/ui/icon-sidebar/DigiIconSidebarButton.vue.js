import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createVNode, createElementVNode, toDisplayString } from "vue";
import { cn } from "../../../lib/cn.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { iconSidebarItemVariants } from "./variants.js";
const _hoisted_1 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIconSidebarButton",
  props: {
    label: {},
    iconName: {},
    selected: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        disabled: __props.disabled,
        class: normalizeClass(unref(cn)(unref(iconSidebarItemVariants)({ selected: __props.selected, disabled: __props.disabled }))),
        onClick: _cache[0] || (_cache[0] = ($event) => emit("click"))
      }, [
        createVNode(unref(DigiRemixIcon), {
          name: __props.iconName,
          size: "2x"
        }, null, 8, ["name"]),
        createElementVNode("span", null, toDisplayString(__props.label), 1)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
