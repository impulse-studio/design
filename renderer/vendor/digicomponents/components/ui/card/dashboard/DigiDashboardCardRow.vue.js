import { defineComponent, openBlock, createElementBlock, createElementVNode, createBlock, unref, createCommentVNode, withCtx, createTextVNode, toDisplayString, createVNode, renderSlot } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
/* empty css                             */
import _sfc_main$1 from "../../actions/router-link/DigiRouterLink.vue.js";
import _sfc_main$2 from "../../tooltip/DigiTextTooltip.vue.js";
const _hoisted_1 = { class: "flex h-7 w-full items-center justify-between gap-2" };
const _hoisted_2 = { class: "flex min-w-0 items-center gap-2" };
const _hoisted_3 = {
  key: 2,
  class: "flex-1 truncate text-nowrap"
};
const _hoisted_4 = {
  key: 4,
  class: "text-muted-foreground text-sm"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDashboardCardRow",
  props: {
    name: {},
    description: {},
    iconName: {},
    tooltip: {},
    to: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
            key: 0,
            name: __props.iconName,
            size: "md"
          }, null, 8, ["name"])) : createCommentVNode("", true),
          __props.to ? (openBlock(), createBlock(unref(_sfc_main$1), {
            key: 1,
            to: __props.to,
            variant: "link",
            class: "flex-1 truncate text-nowrap"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.name), 1)
            ]),
            _: 1
          }, 8, ["to"])) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(__props.name), 1)),
          __props.tooltip ? (openBlock(), createBlock(_sfc_main$2, {
            key: 3,
            text: __props.tooltip
          }, {
            default: withCtx(() => [
              createVNode(unref(DigiRemixIcon), {
                size: "md",
                name: "information-2-line"
              })
            ]),
            _: 1
          }, 8, ["text"])) : createCommentVNode("", true),
          __props.description ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(__props.description), 1)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "name-append")
        ]),
        renderSlot(_ctx.$slots, "value")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
