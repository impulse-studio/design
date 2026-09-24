import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, createBlock, createCommentVNode, renderSlot } from "vue";
import { hasIcon, actionVariants, actionContentVariants } from "../variants.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["href", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiLink",
  props: {
    href: {},
    variant: {},
    size: {},
    disabled: { type: Boolean },
    iconName: {},
    class: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const icon = computed(() => hasIcon(props.iconName));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        href: __props.disabled ? void 0 : props.href,
        target: "_blank",
        "aria-disabled": __props.disabled,
        class: normalizeClass(unref(cn)(unref(actionVariants)({ variant: __props.variant, size: __props.size, icon: icon.value }), props.class)),
        onClick: _cache[0] || (_cache[0] = ($event) => emits("click", $event))
      }, [
        createElementVNode("span", {
          class: normalizeClass(unref(actionContentVariants)({ size: __props.size, hasIcon: icon.value }))
        }, [
          __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
            key: 0,
            name: __props.iconName
          }, null, 8, ["name"])) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
