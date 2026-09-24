import { defineComponent, openBlock, createBlock, normalizeClass, withCtx, renderSlot, unref, createTextVNode, toDisplayString, createCommentVNode, createElementBlock, createElementVNode } from "vue";
import _sfc_main$3 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
import _sfc_main$2 from "../headers/DigiPageHeader.vue.js";
import _sfc_main$1 from "./DigiPageContainer.vue.js";
const _hoisted_1 = {
  key: 1,
  class: "mb-4"
};
const _hoisted_2 = { class: "mb-4" };
const _hoisted_3 = { class: "flex justify-center" };
const _hoisted_4 = { class: "flex items-center justify-end" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTablePageLayout",
  props: {
    title: {},
    description: {},
    helpLink: {},
    feature: {},
    createCta: {},
    parentRoute: {},
    parentRouteText: {},
    fullWidth: { type: Boolean },
    fullWidthHeader: { type: Boolean },
    class: {}
  },
  emits: ["create"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        "full-width": __props.fullWidth,
        class: normalizeClass(props.class)
      }, {
        default: withCtx(() => [
          __props.title ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            title: __props.title,
            description: __props.description,
            "help-link": __props.helpLink,
            feature: __props.feature,
            "parent-route": __props.parentRoute,
            "parent-route-text": __props.parentRouteText,
            "full-width": __props.fullWidthHeader
          }, {
            actions: withCtx(() => [
              renderSlot(_ctx.$slots, "create-action", {}, () => [
                __props.createCta ? (openBlock(), createBlock(unref(_sfc_main$3), {
                  key: 0,
                  variant: "primary",
                  "icon-name": "add-line",
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("create"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.createCta), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ])
            ]),
            _: 3
          }, 8, ["title", "description", "help-link", "feature", "parent-route", "parent-route-text", "full-width"])) : createCommentVNode("", true),
          _ctx.$slots["search-form"] ? (openBlock(), createElementBlock("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "search-form")
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_2, [
            renderSlot(_ctx.$slots, "table")
          ]),
          createElementVNode("div", _hoisted_3, [
            renderSlot(_ctx.$slots, "pagination")
          ]),
          createElementVNode("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "footer-actions")
          ])
        ]),
        _: 3
      }, 8, ["full-width", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
