import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { DropdownMenuItem_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/DropdownMenu/DropdownMenuItem.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDropdownMenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean },
    variant: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DropdownMenuItem_default), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
          __props.inset && "pl-8",
          __props.variant === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive",
          props.class
        )
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
