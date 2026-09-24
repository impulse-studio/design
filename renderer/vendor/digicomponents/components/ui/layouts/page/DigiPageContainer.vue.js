import { defineComponent, useTemplateRef, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = {
  key: 1,
  class: "mx-auto h-full w-full max-w-4xl"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPageContainer",
  props: {
    fullWidth: { type: Boolean },
    class: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const containerEl = useTemplateRef("containerEl");
    __expose({
      containerEl
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "containerEl",
        ref: containerEl,
        class: normalizeClass(unref(cn)("grow p-8", props.class))
      }, [
        __props.fullWidth ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createElementBlock("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ]))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
