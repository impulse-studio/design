import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot, createVNode } from "vue";
import { useForwardPropsEmits } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { ListboxItem_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Listbox/ListboxItem.js";
import { ListboxItemIndicator_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Listbox/ListboxItemIndicator.js";
import { cn } from "../../../../../lib/cn.js";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ListboxItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxItem_default), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "text-md data-highlighted:bg-accent data-highlighted:text-accent-foreground flex w-full cursor-pointer items-center rounded-xs px-2 py-1.5 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50",
          props.class
        )
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          createVNode(unref(ListboxItemIndicator_default), { class: "ml-auto" }, {
            default: withCtx(() => [
              createVNode(DigiRemixIcon, { name: "check-line" })
            ]),
            _: 1
          })
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
