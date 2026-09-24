import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createElementVNode, createVNode, normalizeClass } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../../tooltip/DigiTextTooltip.vue.js";
import _sfc_main$2 from "../link/DigiLink.vue.js";
import { getRemixSize } from "./remix.js";
import { iconVariants } from "./variants.js";
const _hoisted_1 = { class: "w-fit" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIconLink",
  props: {
    href: {},
    iconName: {},
    size: { default: "md" },
    variant: { default: "primary" },
    tooltipSide: { default: "top" },
    disabled: { type: Boolean, default: false },
    tooltip: {}
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
        side: __props.tooltipSide
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createVNode(_sfc_main$2, {
              href: __props.href,
              size: "icon",
              disabled: __props.disabled,
              variant: "ghost",
              class: normalizeClass(iconVariant.value),
              onClick: _cache[0] || (_cache[0] = ($event) => emits("click"))
            }, {
              default: withCtx(() => [
                createVNode(DigiRemixIcon, {
                  name: __props.iconName,
                  class: normalizeClass(iconVariant.value),
                  size: remixSize.value
                }, null, 8, ["name", "class", "size"])
              ]),
              _: 1
            }, 8, ["href", "disabled", "class"])
          ])
        ]),
        _: 1
      }, 8, ["text", "side"]);
    };
  }
});
export {
  _sfc_main as default
};
