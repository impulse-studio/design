import { defineComponent, openBlock, createBlock, unref, withCtx, renderSlot } from "vue";
import { Slot } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
import { useFormField } from "../useFormField.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormControl",
  setup(__props) {
    const { error, formDescriptionId, formMessageId, state } = useFormField();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Slot), {
        "aria-describedby": !unref(error) ? `${unref(formDescriptionId)}` : `${unref(formDescriptionId)} ${unref(formMessageId)}`,
        "aria-invalid": !!unref(error)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", { state: unref(state) })
        ]),
        _: 3
      }, 8, ["aria-describedby", "aria-invalid"]);
    };
  }
});
export {
  _sfc_main as default
};
