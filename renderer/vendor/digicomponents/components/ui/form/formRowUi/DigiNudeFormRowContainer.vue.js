import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["data-disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNudeFormRowContainer",
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
            "flex flex-col items-start gap-1 data-[disabled=true]:opacity-60",
            props.class
          )
        )
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
