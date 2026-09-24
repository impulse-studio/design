import { openBlock, createElementBlock, createElementVNode, renderSlot } from "vue";
import _export_sfc from "../../../_virtual/_plugin-vue_export-helper.js";
const _sfc_main = {};
const _hoisted_1 = { class: "bg-background flex h-full flex-col justify-between border-r p-1" };
const _hoisted_2 = { class: "space-y-1" };
const _hoisted_3 = { class: "space-y-1" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("nav", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "default")
    ]),
    createElementVNode("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "footer")
    ])
  ]);
}
const DigiIconSidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  DigiIconSidebar as default
};
