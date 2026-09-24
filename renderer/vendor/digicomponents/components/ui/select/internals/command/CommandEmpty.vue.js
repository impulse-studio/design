import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { ComboboxEmpty_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Combobox/ComboboxEmpty.js";
import { cn } from "../../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CommandEmpty",
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ComboboxEmpty_default), mergeProps(delegatedProps.value, {
        class: unref(cn)("py-6 text-center text-sm", props.class)
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
