import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot } from "vue";
import { TabsContent_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tabs/TabsContent.js";
import { cn } from "../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTabContent",
  props: {
    class: {},
    value: {},
    forceMount: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TabsContent_default), mergeProps({
        class: [
          unref(cn)(
            "ring-offset-background focus-visible:ring-ring mt-2 grow focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
            props.class
          ),
          "tabsContent"
        ]
      }, delegatedProps.value), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
