import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { TooltipContent_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tooltip/TooltipContent.js";
import { TooltipPortal_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tooltip/TooltipPortal.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "DigiTooltipContent",
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: { default: void 0 },
    alignOffset: { default: 0 },
    avoidCollisions: { type: Boolean, default: true },
    collisionBoundary: { default: void 0 },
    collisionPadding: { default: void 0 },
    arrowPadding: { default: void 0 },
    sticky: { default: "partial" },
    hideWhenDetached: { type: Boolean, default: void 0 },
    positionStrategy: {},
    updatePositionStrategy: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TooltipPortal_default), null, {
        default: withCtx(() => [
          createVNode(unref(TooltipContent_default), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
            class: unref(cn)(
              "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-150 max-w-60 overflow-hidden rounded-md border px-3 py-1.5 text-sm whitespace-pre-wrap shadow-md",
              props.class
            )
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["class"])
        ]),
        _: 3
      });
    };
  }
}))());
export {
  _sfc_main as default
};
