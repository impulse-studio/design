import { defineComponent, renderSlot, normalizeProps, guardReactiveProps, unref } from "vue";
import { provideFormItemContext } from "../injectionKeys.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormItem",
  setup(__props) {
    const context = provideFormItemContext();
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(context))));
    };
  }
});
export {
  _sfc_main as default
};
