import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
const _hoisted_1 = ["id"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowDescription",
  props: {
    class: {},
    id: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("p", {
        id: __props.id,
        class: normalizeClass(unref(cn)("text-muted-foreground text-sm leading-tight", props.class))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
