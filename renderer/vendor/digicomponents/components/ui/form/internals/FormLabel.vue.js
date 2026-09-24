import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, createElementBlock, renderSlot } from "vue";
import { cn } from "../../../../lib/cn.js";
import _sfc_main$1 from "../DigiRowLabel.vue.js";
import { useFormField } from "../useFormField.js";
const _hoisted_1 = {
  key: 0,
  class: "flex items-center"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const { error, formItemId } = useFormField();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        class: normalizeClass(unref(cn)(unref(error) && "text-destructive", props.class)),
        for: unref(formItemId)
      }, {
        default: withCtx(() => [
          _ctx.$slots.labelPrepend ? (openBlock(), createElementBlock("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "labelPrepend"),
            renderSlot(_ctx.$slots, "default")
          ])) : renderSlot(_ctx.$slots, "default", { key: 1 })
        ]),
        _: 3
      }, 8, ["class", "for"]);
    };
  }
});
export {
  _sfc_main as default
};
