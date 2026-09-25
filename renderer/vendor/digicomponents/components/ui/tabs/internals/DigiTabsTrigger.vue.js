import { defineComponent, createPropsRestProxy, openBlock, createBlock, normalizeClass, withCtx, createVNode, unref, normalizeProps, guardReactiveProps, createElementVNode, renderSlot } from "vue";
import { useForwardProps } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/shared/useForwardProps.js";
import { TabsTrigger_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tabs/TabsTrigger.js";
import _sfc_main$1 from "../TabPrimitive.vue.js";
const _hoisted_1 = { class: "truncate" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTabsTrigger",
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    orientation: {}
  },
  setup(__props) {
    const delegatedProps = createPropsRestProxy(__props, ["class"]);
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        class: normalizeClass(__props.class),
        orientation: __props.orientation
      }, {
        default: withCtx(() => [
          createVNode(unref(TabsTrigger_default), normalizeProps(guardReactiveProps(unref(forwardedProps))), {
            default: withCtx(() => [
              createElementVNode("span", _hoisted_1, [
                renderSlot(_ctx.$slots, "default")
              ]),
              renderSlot(_ctx.$slots, "append")
            ]),
            _: 3
          }, 16)
        ]),
        _: 3
      }, 8, ["class", "orientation"]);
    };
  }
});
export {
  _sfc_main as default
};
