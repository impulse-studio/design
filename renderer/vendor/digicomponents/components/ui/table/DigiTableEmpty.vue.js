import { defineComponent, computed, openBlock, createBlock, withCtx, createVNode, mergeProps, unref, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
import _sfc_main$2 from "./DigiTableCell.vue.js";
import _sfc_main$1 from "./DigiTableRow.vue.js";
const _hoisted_1 = { class: "flex items-center justify-center py-10" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableEmpty",
  props: {
    class: {},
    colspan: { default: 1 }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, null, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, mergeProps({
            class: unref(cn)(
              "text-foreground p-4 align-middle text-sm whitespace-nowrap",
              props.class
            )
          }, delegatedProps.value), {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "default")
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
