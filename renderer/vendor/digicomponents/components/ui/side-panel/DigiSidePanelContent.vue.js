import { defineComponent, openBlock, createElementBlock, renderSlot } from "vue";
import { provideFormFieldContext } from "../form/injectionKeys.js";
const _hoisted_1 = { class: "flex flex-col gap-5 overflow-y-auto p-5" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSidePanelContent",
  setup(__props) {
    provideFormFieldContext("modal");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
