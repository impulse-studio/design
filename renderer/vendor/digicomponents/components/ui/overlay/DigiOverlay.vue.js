import { defineComponent, openBlock, createElementBlock, createElementVNode, renderSlot, normalizeClass, unref, createCommentVNode } from "vue";
import { variants } from "./const.js";
const _hoisted_1 = { class: "relative" };
const _hoisted_2 = { class: "h-full w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOverlay",
  props: {
    disabled: { type: Boolean, default: false },
    noPointer: { type: Boolean, default: false },
    show: { type: Boolean, default: false }
  },
  emits: ["overlayClick"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "content")
        ]),
        !__props.disabled ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(unref(variants)({ disabled: __props.disabled, noPointer: __props.noPointer, show: __props.show })),
          onClick: _cache[0] || (_cache[0] = ($event) => emits("overlayClick"))
        }, [
          renderSlot(_ctx.$slots, "foreground")
        ], 2)) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
