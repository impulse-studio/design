import { defineComponent, openBlock, createBlock, unref, withCtx, renderSlot } from "vue";
import _sfc_main$1 from "../formRowUi/DigiRowDescription.vue.js";
import { useFormField } from "../useFormField.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormDescription",
  setup(__props) {
    const { formDescriptionId } = useFormField();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { id: unref(formDescriptionId) }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["id"]);
    };
  }
});
export {
  _sfc_main as default
};
