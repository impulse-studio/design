import { defineComponent, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { AccordionRoot_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Accordion/AccordionRoot.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAccordion",
  props: {
    collapsible: { type: Boolean },
    modelValue: {},
    disabled: { type: Boolean },
    type: {},
    defaultValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(AccordionRoot_default), normalizeProps(guardReactiveProps(unref(forwarded))), {
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
