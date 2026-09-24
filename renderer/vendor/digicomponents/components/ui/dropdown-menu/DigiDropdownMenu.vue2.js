import { defineComponent, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js";
import { DropdownMenuRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/DropdownMenu/DropdownMenuRoot.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDropdownMenu",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DropdownMenuRoot_default), normalizeProps(guardReactiveProps(unref(forwarded))), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
