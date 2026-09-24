import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode, createTextVNode, toDisplayString } from "vue";
import { PaginationListItem_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Pagination/PaginationListItem.js";
import _sfc_main$1 from "./PaginationButton.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaginationItem",
  props: {
    value: {},
    isActive: { type: Boolean },
    disabled: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PaginationListItem_default), {
        value: __props.value,
        "as-child": ""
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$1, {
            variant: __props.isActive ? "secondary" : "ghost",
            disabled: __props.disabled
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.value), 1)
            ]),
            _: 1
          }, 8, ["variant", "disabled"])
        ]),
        _: 1
      }, 8, ["value"]);
    };
  }
});
export {
  _sfc_main as default
};
