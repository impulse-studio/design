import { defineComponent, createPropsRestProxy, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { cva } from "../../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
import { TabsList_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Tabs/TabsList.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTabsList",
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    orientation: { default: "horizontal" },
    singleLine: { type: Boolean }
  },
  setup(__props) {
    const delegatedProps = createPropsRestProxy(__props, ["class", "orientation", "singleLine"]);
    const tabsListVariants = cva("flex", {
      variants: {
        orientation: {
          horizontal: "text-muted-foreground flex-wrap items-center gap-y-2 rounded-md",
          vertical: "sticky top-0 mr-8 flex-col self-start"
        },
        singleLine: {
          true: "flex-nowrap",
          false: ""
        }
      }
    });
    const computedClass = computed(
      () => cn(tabsListVariants({ orientation: __props.orientation, singleLine: __props.singleLine }), __props.class)
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TabsList_default), mergeProps(delegatedProps, { class: computedClass.value }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
