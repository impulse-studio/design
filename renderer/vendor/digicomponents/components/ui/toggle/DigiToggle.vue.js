import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createElementVNode, createVNode, mergeProps, renderSlot, createCommentVNode } from "vue";
import { useForwardPropsEmits } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { Toggle_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Toggle/Toggle.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { toggleVariants } from "./toggleVariants.js";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
import { cn } from "../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToggle",
  props: {
    class: {},
    variant: { default: "default" },
    size: { default: "default" },
    tooltip: {},
    iconName: {},
    defaultValue: { type: Boolean },
    disabled: { type: Boolean, default: false },
    modelValue: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, size, variant, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: __props.tooltip,
        side: "top"
      }, {
        default: withCtx(() => [
          createElementVNode("div", null, [
            createVNode(unref(Toggle_default), mergeProps(unref(forwarded), {
              class: unref(cn)(unref(toggleVariants)({ variant: __props.variant, size: __props.size }), props.class)
            }), {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                    key: 0,
                    name: __props.iconName
                  }, null, 8, ["name"])) : createCommentVNode("", true)
                ])
              ]),
              _: 3
            }, 16, ["class"])
          ])
        ]),
        _: 3
      }, 8, ["text"]);
    };
  }
});
export {
  _sfc_main as default
};
