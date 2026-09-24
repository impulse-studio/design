import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { useForwardProps } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { ListboxContent_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Listbox/ListboxContent.js";
import { cn } from "../../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ListboxContent",
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
    const forwarded = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxContent_default), mergeProps(unref(forwarded), {
        class: unref(cn)("max-h-[300px] overflow-x-hidden overflow-y-auto", props.class)
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
