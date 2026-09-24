import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { CollapsibleContent_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Collapsible/CollapsibleContent.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCollapsibleContent",
  props: {
    forceMount: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollapsibleContent_default), mergeProps(props, { class: "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden" }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
