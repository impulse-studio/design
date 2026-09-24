import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, withModifiers, renderSlot, createElementVNode, createCommentVNode } from "vue";
import { cva } from "../../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
import { useForwardPropsEmits } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { DialogClose_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogClose.js";
import { DialogContent_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogContent.js";
import { DialogOverlay_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogOverlay.js";
import { DialogPortal_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogPortal.js";
import { cn } from "../../../../lib/cn.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiModalContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    scrollable: { type: Boolean, default: false },
    size: { default: "md" },
    hideCloseButton: { type: Boolean, default: false }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    const contentVariants = cva(
      "border-border bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 overflow-x-hidden border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
      {
        variants: {
          scrollable: {
            true: "p-0"
          },
          size: {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-4xl"
          }
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DialogPortal_default), null, {
        default: withCtx(() => [
          createVNode(unref(DialogOverlay_default), { class: "z-modal bg-off-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 grid place-items-center overflow-y-auto" }, {
            default: withCtx(() => [
              createVNode(unref(DialogContent_default), mergeProps({
                class: unref(cn)(unref(contentVariants)({ scrollable: __props.scrollable, size: __props.size }), props.class)
              }, unref(forwarded), {
                onInteractOutside: _cache[0] || (_cache[0] = withModifiers(() => {
                }, ["prevent"]))
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  !__props.hideCloseButton ? (openBlock(), createBlock(unref(DialogClose_default), {
                    key: 0,
                    class: "hover:bg-secondary absolute top-5 right-3 cursor-pointer rounded-md p-0.5 transition-colors"
                  }, {
                    default: withCtx(() => [
                      createVNode(DigiRemixIcon, {
                        name: "close-line",
                        size: "xl"
                      }),
                      _cache[1] || (_cache[1] = createElementVNode("span", { class: "sr-only" }, "Close", -1))
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 3
              }, 16, ["class"])
            ]),
            _: 3
          })
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
