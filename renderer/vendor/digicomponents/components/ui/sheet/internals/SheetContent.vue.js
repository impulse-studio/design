import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { DialogClose_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Dialog/DialogClose.js";
import { DialogContent_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Dialog/DialogContent.js";
import { DialogOverlay_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Dialog/DialogOverlay.js";
import { DialogPortal_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Dialog/DialogPortal.js";
import { cn } from "../../../../lib/cn.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "SheetContent",
  props: {
    class: {},
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DialogPortal_default), null, {
        default: withCtx(() => [
          createVNode(unref(DialogOverlay_default), {
            class: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
            onClick: _cache[0] || (_cache[0] = () => emits("close"))
          }),
          createVNode(unref(DialogContent_default), mergeProps({
            class: unref(cn)(
              `bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 h-full w-80 border-l shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 md:w-[500px]`,
              props.class
            )
          }, { ...unref(forwarded), ..._ctx.$attrs }, {
            onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
              event.preventDefault();
            })
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default"),
              createVNode(unref(DialogClose_default), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                default: withCtx(() => [
                  createVNode(unref(DigiRemixIcon), {
                    name: "close-line",
                    class: "text-muted-foreground",
                    size: "lg"
                  })
                ]),
                _: 1
              })
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
