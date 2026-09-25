import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, createElementVNode, normalizeClass, renderSlot } from "vue";
import { AccordionContent_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Accordion/AccordionContent.js";
import { cn } from "../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAccordionContent",
  props: {
    class: {},
    renderDomWhenCollapsed: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, renderDomWhenCollapsed, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(AccordionContent_default), mergeProps({
        ...delegatedProps.value
      }, {
        class: unref(cn)(
          "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all",
          {
            "data-[state=closed]:h-0 data-[state=closed]:p-0 data-[state=closed]:opacity-0": props.renderDomWhenCollapsed
          }
        ),
        "force-mount": props.renderDomWhenCollapsed
      }), {
        default: withCtx(() => [
          createElementVNode("div", {
            class: normalizeClass(unref(cn)("pt-2", props.class))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 2)
        ]),
        _: 3
      }, 16, ["class", "force-mount"]);
    };
  }
});
export {
  _sfc_main as default
};
