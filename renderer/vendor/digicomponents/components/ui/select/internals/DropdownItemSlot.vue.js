import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot } from "vue";
/* empty css                            */
import _sfc_main$1 from "./command/CommandItem.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DropdownItemSlot",
  props: {
    value: {},
    deactivateRowClick: { type: Boolean, default: false }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        value: __props.value,
        class: normalizeClass({
          "pointer-events-none": __props.deactivateRowClick,
          "data-highlighted:bg-inherit": __props.deactivateRowClick
        }),
        onSelect: _cache[0] || (_cache[0] = (ev) => emits("select", ev.detail.value))
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", { value: __props.value })
        ]),
        _: 3
      }, 8, ["value", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
