import { defineComponent, computed, openBlock, createBlock, normalizeProps, guardReactiveProps, unref, withCtx, createVNode, createElementVNode, toDisplayString, renderSlot } from "vue";
import { useForwardPropsEmits } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardPropsEmits.js";
import { PopoverClose_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Popover/PopoverClose.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "./DigiPopoverBasicContent.vue.js";
const _hoisted_1 = { class: "pr-5 font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "DigiPopoverContent",
  props: {
    side: {},
    alignOffset: {},
    align: { default: "center" },
    class: {},
    title: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, normalizeProps(guardReactiveProps({ ...unref(forwarded), ..._ctx.$attrs })), {
        default: withCtx(() => [
          createVNode(unref(PopoverClose_default), { class: "absolute top-4 right-4" }, {
            default: withCtx(() => [
              createVNode(DigiRemixIcon, { name: "close-line" })
            ]),
            _: 1
          }),
          createElementVNode("b", _hoisted_1, toDisplayString(__props.title), 1),
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16);
    };
  }
}))());
export {
  _sfc_main as default
};
