import { defineComponent, openBlock, createBlock, withCtx, createVNode, createElementVNode, unref, toDisplayString, createTextVNode, createCommentVNode } from "vue";
import _sfc_main$3 from "../actions/button/DigiButton.vue.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$2 from "./DigiTableCell.vue.js";
import _sfc_main$1 from "./DigiTableRow.vue.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
const _hoisted_1 = { class: "flex flex-col items-center p-3" };
const _hoisted_2 = { class: "text-muted-foreground mb-3" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableEmptyRow",
  props: {
    columnsCount: {},
    emptyText: {},
    hideReset: { type: Boolean }
  },
  emits: ["reset"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, null, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, {
            colspan: __props.columnsCount,
            class: "text-center"
          }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                createVNode(unref(DigiRemixIcon), {
                  name: "ghost-line",
                  size: "2x",
                  class: "mb-2"
                }),
                createElementVNode("div", _hoisted_2, toDisplayString(__props.emptyText ?? unref(defaultTexts).tableEmptyText), 1),
                !__props.hideReset ? (openBlock(), createBlock(unref(_sfc_main$3), {
                  key: 0,
                  "icon-name": "reset-right-line",
                  variant: "secondary",
                  onClick: _cache[0] || (_cache[0] = ($event) => emits("reset"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(defaultTexts).tableEmptyResetCta), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ])
            ]),
            _: 1
          }, 8, ["colspan"])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
