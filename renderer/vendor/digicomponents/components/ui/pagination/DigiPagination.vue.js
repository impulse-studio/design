import { defineComponent, useModel, openBlock, createBlock, unref, withCtx, createVNode, createElementBlock, Fragment, renderList, mergeModels } from "vue";
import { PaginationRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Pagination/PaginationRoot.js";
import { PaginationList_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Pagination/PaginationList.js";
import _sfc_main$4 from "./internals/PaginationEllipsis.vue.js";
import _sfc_main$1 from "./internals/PaginationFirst.vue.js";
import _sfc_main$3 from "./internals/PaginationItem.vue.js";
import _sfc_main$6 from "./internals/PaginationLast.vue.js";
import _sfc_main$5 from "./internals/PaginationNext.vue.js";
import _sfc_main$2 from "./internals/PaginationPrev.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPagination",
  props: /* @__PURE__ */ mergeModels({
    defaultPage: { default: 1 },
    itemsPerPage: { default: 10 },
    total: {},
    disabled: { type: Boolean }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const currentPage = useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PaginationRoot_default), {
        page: currentPage.value,
        "onUpdate:page": _cache[0] || (_cache[0] = ($event) => currentPage.value = $event),
        total: __props.total,
        "items-per-page": __props.itemsPerPage,
        "sibling-count": 1,
        "show-edges": "",
        "default-page": __props.defaultPage
      }, {
        default: withCtx(({ page }) => [
          createVNode(unref(PaginationList_default), { class: "flex items-center gap-1" }, {
            default: withCtx(({ items }) => [
              createVNode(_sfc_main$1),
              createVNode(_sfc_main$2),
              (openBlock(true), createElementBlock(Fragment, null, renderList(items, (item, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  item.type === "page" ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 0,
                    value: item.value,
                    "is-active": item.value === page,
                    disabled: __props.disabled
                  }, null, 8, ["value", "is-active", "disabled"])) : (openBlock(), createBlock(_sfc_main$4, { key: 1 }))
                ], 64);
              }), 128)),
              createVNode(_sfc_main$5),
              createVNode(_sfc_main$6)
            ]),
            _: 2
          }, 1024)
        ]),
        _: 1
      }, 8, ["page", "total", "items-per-page", "default-page"]);
    };
  }
});
export {
  _sfc_main as default
};
