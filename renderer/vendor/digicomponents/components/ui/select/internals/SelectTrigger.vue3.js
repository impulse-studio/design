import { defineComponent, openBlock, createBlock, unref, withCtx, createElementVNode, renderSlot, createVNode, normalizeClass, createCommentVNode, toDisplayString, createElementBlock } from "vue";
import { cn } from "../../../../lib/cn.js";
import _sfc_main$2 from "../../actions/button/DigiButton.vue.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../../popover/DigiPopoverTrigger.vue.js";
const _hoisted_1 = {
  class: /* @__PURE__ */ normalizeClass("flex w-full items-stretch")
};
const _hoisted_2 = { class: "input-prepend border-input bg-muted text-muted-foreground flex h-9 items-center rounded-l-md border border-r-0 px-3 text-sm empty:hidden" };
const _hoisted_3 = { class: "relative w-full flex-1" };
const _hoisted_4 = { class: "ellipse-text mr-1 leading-relaxed" };
const _hoisted_5 = {
  key: 0,
  class: "input-append border-input bg-muted text-muted-foreground flex h-9 items-center rounded-r-md border border-l-0 px-3 text-sm empty:hidden"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SelectTrigger",
  props: {
    iconName: {},
    valueText: {},
    placeholder: {},
    state: { type: [Boolean, null], default: void 0 },
    disabled: { type: Boolean, default: void 0 },
    id: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { "as-child": "" }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "prepend", {}, void 0, true)
            ]),
            createElementVNode("div", _hoisted_3, [
              createVNode(unref(_sfc_main$2), {
                id: __props.id,
                disabled: __props.disabled,
                variant: "secondary",
                class: normalizeClass(
                  unref(cn)(
                    "input-wrapper trigger text-md h-9 w-full min-w-[200px] font-normal shadow-none",
                    !__props.valueText && "text-black/70",
                    __props.state === false && "border-destructive text-destructive"
                  )
                ),
                onClick: _cache[0] || (_cache[0] = ($event) => emit("click"))
              }, {
                default: withCtx(() => [
                  __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                    key: 0,
                    name: __props.iconName,
                    class: "mr-2"
                  }, null, 8, ["name"])) : createCommentVNode("", true),
                  createElementVNode("span", _hoisted_4, toDisplayString(__props.valueText || __props.placeholder), 1),
                  createVNode(DigiRemixIcon, {
                    class: normalizeClass([{ "text-destructive": __props.state === false }, "ml-auto"]),
                    name: "expand-up-down-line"
                  }, null, 8, ["class"])
                ]),
                _: 1
              }, 8, ["id", "disabled", "class"])
            ]),
            _ctx.$slots.append ? (openBlock(), createElementBlock("div", _hoisted_5, [
              renderSlot(_ctx.$slots, "append", {}, void 0, true)
            ])) : createCommentVNode("", true)
          ])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
