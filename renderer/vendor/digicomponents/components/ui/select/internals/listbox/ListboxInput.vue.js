import { defineComponent, computed, openBlock, createElementBlock, createVNode, unref, mergeProps } from "vue";
import { useForwardProps } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js";
import { ListboxFilter_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Listbox/ListboxFilter.js";
import { cn } from "../../../../../lib/cn.js";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "flex items-center border-b px-3" };
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "ListboxInput",
  props: {
    modelValue: {},
    autoFocus: { type: Boolean },
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(DigiRemixIcon, {
          name: "search-line",
          class: "mr-2 shrink-0 opacity-50"
        }),
        createVNode(unref(ListboxFilter_default), mergeProps({ ...unref(forwardedProps), ..._ctx.$attrs }, {
          "auto-focus": "",
          class: unref(cn)(
            "placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            props.class
          )
        }), null, 16, ["class"])
      ]);
    };
  }
}))());
export {
  _sfc_main as default
};
