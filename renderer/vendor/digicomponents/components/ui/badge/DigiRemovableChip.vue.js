import { defineComponent, openBlock, createBlock, unref, withCtx, createElementVNode, toDisplayString, createVNode } from "vue";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
const _hoisted_1 = { class: "bg-secondary flex h-6 items-center space-x-2 rounded-sm px-2 py-1 text-sm" };
const _hoisted_2 = { class: "ellipse-text max-w-28" };
const _hoisted_3 = ["aria-label"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRemovableChip",
  props: {
    label: {}
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: __props.label,
        side: "top",
        delay: 500
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("span", _hoisted_2, toDisplayString(__props.label), 1),
            createElementVNode("button", {
              type: "button",
              class: "flex cursor-pointer items-center",
              "aria-label": `Remove ${__props.label}`,
              onClick: _cache[0] || (_cache[0] = ($event) => emit("remove"))
            }, [
              createVNode(DigiRemixIcon, { name: "close-line" })
            ], 8, _hoisted_3)
          ])
        ]),
        _: 1
      }, 8, ["text"]);
    };
  }
});
export {
  _sfc_main as default
};
