import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["data-disabled"];
const _hoisted_2 = { class: "mr-3 flex w-full flex-col items-start justify-center gap-1 @sm:mr-5 @sm:w-7/12" };
const _hoisted_3 = { class: "flex w-full flex-col items-start justify-center gap-1 @sm:w-5/12" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFormRowContainer",
  props: {
    disabled: { type: Boolean },
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "data-disabled": __props.disabled,
        class: normalizeClass(
          unref(cn)(
            "@container flex w-full flex-col justify-between gap-2 data-[disabled=true]:opacity-60 sm:flex-row",
            props.class
          )
        )
      }, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "label")
        ]),
        createElementVNode("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "item")
        ])
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
