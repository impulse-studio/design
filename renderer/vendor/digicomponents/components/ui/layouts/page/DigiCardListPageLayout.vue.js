import { defineComponent, openBlock, createBlock, normalizeClass, unref, withCtx, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementBlock, createElementVNode } from "vue";
import { cn } from "../../../../lib/cn.js";
import _sfc_main$3 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
import _sfc_main$2 from "../headers/DigiPageHeader.vue.js";
import _sfc_main$1 from "./DigiPageContainer.vue.js";
const _hoisted_1 = {
  key: 1,
  class: "mb-4 flex flex-wrap gap-2"
};
const _hoisted_2 = { class: "flex grow flex-col gap-2" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCardListPageLayout",
  props: {
    title: {},
    feature: {},
    parentRoute: {},
    parentRouteText: {},
    createCta: {},
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
        class: normalizeClass(unref(cn)("flex flex-col", props.class))
      }, {
        default: withCtx(() => [
          __props.title ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            title: __props.title,
            "full-width": __props.fullWidthHeader,
            feature: __props.feature,
            "parent-route": __props.parentRoute,
            "parent-route-text": __props.parentRouteText
          }, {
            actions: withCtx(() => [
              renderSlot(_ctx.$slots, "header-actions", {}, () => [
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
          }, 8, ["title", "full-width", "feature", "parent-route", "parent-route-text"])) : createCommentVNode("", true),
          _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "actions")
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_2, [
            renderSlot(_ctx.$slots, "items")
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
