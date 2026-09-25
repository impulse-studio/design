import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createElementVNode, normalizeClass, createVNode, createTextVNode, toDisplayString, renderSlot, createCommentVNode } from "vue";
import { cva } from "../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
const _hoisted_1 = { class: "w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiVerticalMenuTab",
  props: {
    title: {},
    icon: {},
    disabled: { type: [Boolean, Object] },
    hideCaret: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isDisabled = computed(() => {
      return props.disabled === true || typeof props.disabled === "object";
    });
    const classes = cva(
      "flex gap-4 px-6 py-3 transition-colors duration-200 ease-out",
      {
        variants: {
          disabled: {
            true: "cursor-default opacity-60",
            false: "hover:bg-off-white cursor-pointer"
          }
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        "trigger-as-child": "",
        text: typeof __props.disabled === "object" ? __props.disabled.reason : ""
      }, {
        default: withCtx(() => [
          createElementVNode("div", {
            class: normalizeClass(unref(classes)({ disabled: isDisabled.value })),
            onClick: _cache[0] || (_cache[0] = ($event) => __props.disabled === true ? void 0 : emit("click"))
          }, [
            createVNode(DigiRemixIcon, {
              name: __props.icon,
              size: "xl"
            }, null, 8, ["name"]),
            createElementVNode("div", _hoisted_1, [
              createTextVNode(toDisplayString(__props.title) + " ", 1),
              renderSlot(_ctx.$slots, "title-more-info")
            ]),
            __props.hideCaret !== true ? (openBlock(), createBlock(DigiRemixIcon, {
              key: 0,
              name: "arrow-right-s-line",
              size: "xl"
            })) : createCommentVNode("", true)
          ], 2)
        ]),
        _: 3
      }, 8, ["text"]);
    };
  }
});
export {
  _sfc_main as default
};
