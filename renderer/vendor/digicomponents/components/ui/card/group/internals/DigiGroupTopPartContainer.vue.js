import { openBlock, createElementBlock, createElementVNode, renderSlot } from "vue";
import _export_sfc from "../../../../../_virtual/_plugin-vue_export-helper.js";
const _sfc_main = {};
const _hoisted_1 = { class: "flex w-full min-w-0 items-center justify-between" };
const _hoisted_2 = { class: "flex min-w-0 items-center gap-2" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "title"),
      renderSlot(_ctx.$slots, "title-more-info")
    ]),
    renderSlot(_ctx.$slots, "middle-zone"),
    renderSlot(_ctx.$slots, "actions")
  ]);
}
const DigiGroupTopPartContainer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  DigiGroupTopPartContainer as default
};
