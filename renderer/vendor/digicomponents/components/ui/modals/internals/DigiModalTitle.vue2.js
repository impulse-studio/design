import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardProps } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { DialogTitle_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogTitle.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiModalTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DialogTitle_default), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "max-w-[95%] text-lg leading-none font-bold tracking-tight",
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
