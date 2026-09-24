import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, normalizeClass } from "vue";
import { cn } from "../../../../lib/cn.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../../tooltip/DigiTextTooltip.vue.js";
import _sfc_main$2 from "../button/DigiButton.vue.js";
import { getRemixSize } from "./remix.js";
import { iconVariants } from "./variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "DigiIconButton",
  props: {
    iconName: {},
    size: { default: "md" },
    variant: { default: "primary" },
    tooltipSide: { default: "top" },
    disabled: { type: Boolean, default: false },
    tooltip: {},
    class: {},
    iconClass: {},
    isLoading: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const iconVariant = computed(
      () => iconVariants({ size: props.size, variant: props.variant })
    );
    const remixSize = computed(() => getRemixSize(props.size));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: __props.tooltip,
        side: __props.tooltipSide,
        class: "inline"
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, mergeProps({
            size: "icon",
            disabled: __props.disabled,
            variant: "ghost",
            class: unref(cn)(iconVariant.value, props.class),
            "is-loading": __props.isLoading
          }, _ctx.$attrs, {
            onClick: _cache[0] || (_cache[0] = ($event) => emits("click", $event))
          }), {
            default: withCtx(() => [
              createVNode(DigiRemixIcon, {
                name: __props.iconName,
                class: normalizeClass(unref(cn)(iconVariant.value, __props.iconClass)),
                size: remixSize.value
              }, null, 8, ["name", "class", "size"])
            ]),
            _: 1
          }, 16, ["disabled", "class", "is-loading"])
        ]),
        _: 1
      }, 8, ["text", "side"]);
    };
  }
}))());
export {
  _sfc_main as default
};
