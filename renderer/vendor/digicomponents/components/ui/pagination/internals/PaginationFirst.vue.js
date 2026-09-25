import { defineComponent, computed, openBlock, createBlock, unref, normalizeProps, guardReactiveProps, withCtx, createVNode } from "vue";
import { PaginationFirst_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Pagination/PaginationFirst.js";
import _sfc_main$1 from "./PaginationButton.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaginationFirst",
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
      return openBlock(), createBlock(unref(PaginationFirst_default), normalizeProps(guardReactiveProps(delegatedProps.value)), {
        default: withCtx(() => [
          createVNode(_sfc_main$1, { "icon-name": "arrow-left-double-line" })
        ]),
        _: 1
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
