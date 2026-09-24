import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, createVNode } from "vue";
import { PaginationEllipsis_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Pagination/PaginationEllipsis.js";
import { cn } from "../../../../lib/cn.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaginationEllipsis",
  props: {
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PaginationEllipsis_default), mergeProps(delegatedProps.value, {
        class: unref(cn)("flex h-9 w-9 items-center justify-center", props.class)
      }), {
        default: withCtx(() => [
          createVNode(DigiRemixIcon, { name: "more-line" })
        ]),
        _: 1
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
