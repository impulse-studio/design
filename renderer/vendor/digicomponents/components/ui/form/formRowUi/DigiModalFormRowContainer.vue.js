import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["data-disabled"];
const _hoisted_2 = { class: "mb-2 flex flex-col items-start gap-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiModalFormRowContainer",
  props: {
    disabled: { type: Boolean },
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "data-disabled": __props.disabled,
        class: normalizeClass(unref(cn)("data-[disabled=true]:opacity-60", props.class))
      }, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "label")
        ]),
        renderSlot(_ctx.$slots, "item")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
