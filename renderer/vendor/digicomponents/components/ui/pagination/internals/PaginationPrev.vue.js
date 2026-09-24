import { defineComponent, computed, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, createVNode } from "vue";
import { PaginationPrev_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Pagination/PaginationPrev.js";
import _sfc_main$1 from "./PaginationButton.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaginationPrev",
  props: {
    asChild: { type: Boolean, default: true },
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
      return openBlock(), createBlock(unref(PaginationPrev_default), normalizeProps(guardReactiveProps(delegatedProps.value)), {
        default: withCtx(() => [
          createVNode(_sfc_main$1, { "icon-name": "arrow-left-s-line" })
        ]),
        _: 1
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
