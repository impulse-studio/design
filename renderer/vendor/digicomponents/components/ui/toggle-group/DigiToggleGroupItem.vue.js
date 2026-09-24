import { defineComponent, inject, computed, openBlock, createBlock, unref, withCtx, createElementVNode, createVNode, mergeProps, renderSlot, createCommentVNode } from "vue";
import { useForwardProps } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { ToggleGroupItem_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/ToggleGroup/ToggleGroupItem.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { toggleVariants } from "../toggle/toggleVariants.js";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
import { cn } from "../../../lib/cn.js";
import { toggleGroupInjectionKey } from "./types.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToggleGroupItem",
  props: {
    value: {},
    iconName: {},
    tooltip: {},
    class: {},
    variant: {},
    size: {}
  },
  setup(__props) {
    const props = __props;
    const context = inject(toggleGroupInjectionKey);
    const delegatedProps = computed(() => {
      const { class: _, variant, size, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: __props.tooltip,
        side: "top"
      }, {
        default: withCtx(() => [
          createElementVNode("div", null, [
            createVNode(unref(ToggleGroupItem_default), mergeProps(unref(forwardedProps), {
              class: unref(cn)(
                unref(toggleVariants)({
                  variant: __props.variant || unref(context)?.variant,
                  size: __props.size || unref(context)?.size
                }),
                props.class
              )
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
