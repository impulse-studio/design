import { defineComponent, ref, readonly, openBlock, createBlock, unref, withCtx, renderSlot } from "vue";
import { PopoverRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Popover/PopoverRoot.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPopover",
  setup(__props, { expose: __expose }) {
    const open = ref(false);
    __expose({
      close: () => {
        open.value = false;
      },
      open: () => {
        open.value = true;
      },
      state: readonly(open)
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopoverRoot_default), {
        open: open.value,
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => open.value = $event)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["open"]);
    };
  }
});
export {
  _sfc_main as default
};
