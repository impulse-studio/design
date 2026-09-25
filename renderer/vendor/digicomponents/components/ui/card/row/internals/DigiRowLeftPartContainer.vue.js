import { defineComponent, openBlock, createElementBlock, createElementVNode, createBlock, unref, createCommentVNode, createVNode, withCtx, renderSlot } from "vue";
import { Slot } from "../../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "w-full min-w-0 overflow-hidden" };
const _hoisted_2 = { class: "flex min-w-0 items-center gap-2 overflow-hidden" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowLeftPartContainer",
  props: {
    iconName: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
            key: 0,
            name: __props.iconName,
            size: "md"
          }, null, 8, ["name"])) : createCommentVNode("", true),
          createVNode(unref(Slot), { class: "shrink-0" }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "title")
            ]),
            _: 3
          }),
          createVNode(unref(Slot), { class: "shrink" }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "title-more-info")
            ]),
            _: 3
          })
        ]),
        renderSlot(_ctx.$slots, "more-info")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
