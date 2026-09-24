import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createBlock, createCommentVNode, createElementVNode, renderSlot } from "vue";
import { hasIcon, actionVariants, actionContentVariants } from "../variants.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import DigiSpinner from "../../spinner/DigiSpinner.vue.js";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["id", "type", "form", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiButton",
  props: {
    variant: {},
    size: {},
    class: {},
    type: { default: "button" },
    block: { type: Boolean },
    iconName: {},
    disabled: { type: Boolean, default: false },
    formId: {},
    isLoading: { default: false },
    id: {}
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const icon = computed(
      () => hasIcon(props.iconName) || props.size === "icon"
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        id: __props.id,
        type: __props.type,
        form: __props.formId,
        disabled: __props.disabled || __props.isLoading ? true : false,
        class: normalizeClass(
          unref(cn)(
            unref(actionVariants)({ variant: __props.variant, size: __props.size, isLoading: __props.isLoading, block: __props.block, icon: icon.value }),
            "max-w-full",
            props.class
          )
        ),
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
      }, [
        __props.isLoading ? (openBlock(), createBlock(DigiSpinner, {
          key: 0,
          class: "absolute",
          reversed: __props.variant === "primary" || __props.variant === "success"
        }, null, 8, ["reversed"])) : createCommentVNode("", true),
        createElementVNode("span", {
          class: normalizeClass(
            unref(actionContentVariants)({
              isLoading: __props.isLoading,
              hasIcon: icon.value,
              size: __props.size
            })
          )
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
