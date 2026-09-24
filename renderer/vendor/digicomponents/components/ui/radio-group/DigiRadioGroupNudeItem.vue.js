import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createVNode, mergeProps, withCtx, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { useForwardProps } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { RadioGroupItem_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/RadioGroup/RadioGroupItem.js";
import { RadioGroupIndicator_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/RadioGroup/RadioGroupIndicator.js";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = { class: "col-start-2 row-start-1" };
const _hoisted_2 = {
  key: 0,
  class: "col-start-2 row-start-2 text-sm whitespace-pre-line text-gray-500"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioGroupNudeItem",
  props: {
    disabled: { type: Boolean },
    required: { type: Boolean },
    value: {},
    name: {},
    class: {},
    containerClass: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    const optionId = props.value + "-" + Math.random().toString(36).substring(7);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          "grid grid-cols-[min-content] items-center gap-x-1",
          unref(cn)(
            {
              "opacity-50": props.disabled,
              "cursor-not-allowed": props.disabled
            },
            props.containerClass
          )
        ])
      }, [
        createVNode(unref(RadioGroupItem_default), mergeProps(unref(forwardedProps), {
          id: optionId,
          class: unref(cn)(
            "border-primary focus-visible:ring-ring col-start-1 row-start-1 h-4 w-4 rounded-full border bg-white focus-visible:ring-2 focus-visible:ring-offset-2",
            props.class
          )
        }), {
          default: withCtx(() => [
            createVNode(unref(RadioGroupIndicator_default), { class: "h-full w-full" }, {
              default: withCtx(() => [..._cache[0] || (_cache[0] = [
                createElementVNode("div", { class: "bg-primary h-full w-full rounded-full border-2 border-white" }, null, -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 16, ["class"]),
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default", { optionId })
        ]),
        _ctx.$slots.description ? (openBlock(), createElementBlock("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "description")
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
