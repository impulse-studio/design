import { defineComponent, computed, resolveComponent, openBlock, createBlock, normalizeClass, unref, withCtx, createElementVNode, createCommentVNode, renderSlot } from "vue";
import { hasIcon, actionVariants, actionContentVariants } from "../variants.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRouterLink",
  props: {
    to: {},
    variant: {},
    size: {},
    newTab: { type: Boolean },
    disabled: { type: Boolean },
    iconName: {},
    class: {}
  },
  emits: ["click", "mouseenter"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const icon = computed(() => hasIcon(props.iconName));
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createBlock(_component_RouterLink, {
        to: __props.disabled ? "" : __props.to,
        target: __props.newTab ? "_blank" : void 0,
        "aria-disabled": __props.disabled === true ? true : void 0,
        disabled: __props.disabled,
        class: normalizeClass(unref(cn)(unref(actionVariants)({ variant: __props.variant, size: __props.size, icon: icon.value }), props.class)),
        onClick: _cache[0] || (_cache[0] = ($event) => emit("click", $event)),
        onMouseenter: _cache[1] || (_cache[1] = () => emit("mouseenter"))
      }, {
        default: withCtx(() => [
          createElementVNode("span", {
            class: normalizeClass(unref(actionContentVariants)({ size: __props.size, hasIcon: icon.value }))
          }, [
            __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
              key: 0,
              name: __props.iconName
            }, null, 8, ["name"])) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "default")
          ], 2)
        ]),
        _: 3
      }, 8, ["to", "target", "aria-disabled", "disabled", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
