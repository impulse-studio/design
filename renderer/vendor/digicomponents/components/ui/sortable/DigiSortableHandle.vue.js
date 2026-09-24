import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot } from "vue";
import { Slot } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/Slot.js";
import { useSortableConfig } from "./consts.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSortableHandle",
  setup(__props) {
    const { handleClass } = useSortableConfig();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Slot), {
        class: normalizeClass(unref(handleClass))
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
