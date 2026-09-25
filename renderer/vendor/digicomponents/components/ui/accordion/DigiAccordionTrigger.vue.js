import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, createElementVNode, createCommentVNode, renderSlot } from "vue";
import { AccordionHeader_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Accordion/AccordionHeader.js";
import { AccordionTrigger_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Accordion/AccordionTrigger.js";
import { cn } from "../../../lib/cn.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "flex min-w-0 flex-1 items-center gap-2" };
const _hoisted_2 = { class: "flex items-center gap-2" };
const _hoisted_3 = { class: "collapse-arrow shrink-0 transition-transform duration-200" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAccordionTrigger",
  props: {
    iconName: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(AccordionHeader_default), { class: "flex" }, {
        default: withCtx(() => [
          createVNode(unref(AccordionTrigger_default), mergeProps(delegatedProps.value, {
            class: unref(cn)(
              "flex flex-1 cursor-pointer items-center justify-between gap-2 font-medium transition-all [&[data-state=open]_.collapse-arrow]:rotate-180",
              props.class
            )
          }), {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                  key: 0,
                  name: __props.iconName,
                  size: "lg"
                }, null, 8, ["name"])) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "default")
              ]),
              createElementVNode("div", _hoisted_2, [
                renderSlot(_ctx.$slots, "append"),
                createElementVNode("div", _hoisted_3, [
                  renderSlot(_ctx.$slots, "icon", {}, () => [
                    createVNode(DigiRemixIcon, {
                      size: "lg",
                      name: "arrow-down-s-line"
                    })
                  ])
                ])
              ])
            ]),
            _: 3
          }, 16, ["class"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
