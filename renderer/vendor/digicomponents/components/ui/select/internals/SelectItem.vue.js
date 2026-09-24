import { defineComponent, openBlock, createBlock, unref, withCtx, createCommentVNode, createTextVNode, toDisplayString, createElementVNode, withModifiers, renderSlot } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "./command/CommandItem.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SelectItem",
  props: {
    option: {},
    selectedValues: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        value: __props.option,
        disabled: __props.option.disabled,
        onSelect: _cache[1] || (_cache[1] = (ev) => emits("select", ev.detail.value?.value))
      }, {
        default: withCtx(() => [
          __props.selectedValues.includes(__props.option.value) ? (openBlock(), createBlock(DigiRemixIcon, {
            key: 0,
            name: "check-line",
            class: "mr-1"
          })) : createCommentVNode("", true),
          __props.option.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
            key: 1,
            name: __props.option.iconName,
            class: "mr-1"
          }, null, 8, ["name"])) : createCommentVNode("", true),
          createTextVNode(" " + toDisplayString(__props.option.label) + " ", 1),
          createElementVNode("div", {
            class: "ml-auto",
            onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            }, ["stop"]))
          }, [
            renderSlot(_ctx.$slots, "append", { option: __props.option })
          ])
        ]),
        _: 3
      }, 8, ["value", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
