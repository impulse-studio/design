import { defineComponent, openBlock, createElementBlock, createElementVNode, toDisplayString, renderSlot, createBlock, unref, createCommentVNode } from "vue";
/* empty css                         */
/* empty css                          */
import _sfc_main$1 from "../actions/icons/DigiIconButton.vue.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
const _hoisted_1 = { class: "flex min-h-14 items-center justify-between border-b px-5 py-2" };
const _hoisted_2 = { class: "flex items-center gap-1" };
const _hoisted_3 = { class: "line-clamp-2 text-lg font-bold" };
const _hoisted_4 = { class: "flex gap-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSidePanelHeader",
  props: {
    title: {},
    noCloseButton: { type: Boolean }
  },
  emits: ["close"],
  setup(__props) {
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("span", _hoisted_3, toDisplayString(__props.title), 1),
          renderSlot(_ctx.$slots, "title-append")
        ]),
        createElementVNode("div", _hoisted_4, [
          renderSlot(_ctx.$slots, "actions", {}, () => [
            !__props.noCloseButton ? (openBlock(), createBlock(unref(_sfc_main$1), {
              key: 0,
              "icon-name": "close-line",
              tooltip: unref(defaultTexts).closeTooltip,
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
            }, null, 8, ["tooltip"])) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
