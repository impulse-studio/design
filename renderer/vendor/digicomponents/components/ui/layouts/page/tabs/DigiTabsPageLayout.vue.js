import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, normalizeClass, unref, createBlock, createCommentVNode, createVNode, renderSlot } from "vue";
/* empty css                               */
import { cn } from "../../../../../lib/cn.js";
/* empty css                                */
import _sfc_main$1 from "../../../actions/icons/DigiIconRouterLink.vue.js";
import _sfc_main$3 from "../../headers/DigiTitle.vue.js";
import _sfc_main$4 from "../../headers/DigiDescription.vue.js";
import "vue-router";
import { parseDigiLabelFormat } from "../../../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$2 from "../../headers/DigiFeatureName.vue.js";
import _sfc_main$5 from "../../headers/DigiTutorialLink.vue.js";
const _hoisted_1 = { class: "flex h-full grow flex-col overflow-hidden" };
const _hoisted_2 = { class: "border-b bg-white px-4 pt-8" };
const _hoisted_3 = { class: "mb-2 flex items-center justify-between gap-1" };
const _hoisted_4 = { class: "flex items-center gap-1" };
const _hoisted_5 = { class: "flex gap-2" };
const _hoisted_6 = { class: "translate-y-[0.5px] overflow-x-auto overflow-y-hidden text-nowrap" };
const _hoisted_7 = { class: "relative min-h-0 shrink grow basis-0" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTabsPageLayout",
  props: {
    title: {},
    description: {},
    helpLink: {},
    feature: {},
    backCta: {},
    scrollable: { type: Boolean, default: true },
    fullWidthHeader: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.title);
    });
    const computedTitle = computed(() => {
      return parsedLabel.value.label;
    });
    const computedDescription = computed(() => {
      return props.description || parsedLabel.value.description;
    });
    const computedHelpLink = computed(() => {
      return props.helpLink || parsedLabel.value.helpLink;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("header", _hoisted_2, [
          createElementVNode("div", {
            class: normalizeClass(unref(cn)({ "max-w-4xl": !__props.fullWidthHeader }, "mx-auto"))
          }, [
            createElementVNode("div", _hoisted_3, [
              createElementVNode("div", _hoisted_4, [
                __props.backCta ? (openBlock(), createBlock(unref(_sfc_main$1), {
                  key: 0,
                  "icon-name": "arrow-left-line",
                  tooltip: __props.backCta.title,
                  variant: "link",
                  to: __props.backCta.to
                }, null, 8, ["tooltip", "to"])) : createCommentVNode("", true),
                createElementVNode("div", null, [
                  props.feature ? (openBlock(), createBlock(_sfc_main$2, {
                    key: 0,
                    title: props.feature.name,
                    "icon-name": props.feature.iconName,
                    class: "mb-1"
                  }, null, 8, ["title", "icon-name"])) : createCommentVNode("", true),
                  createVNode(unref(_sfc_main$3), { title: computedTitle.value }, null, 8, ["title"]),
                  computedDescription.value ? (openBlock(), createBlock(_sfc_main$4, {
                    key: 1,
                    description: computedDescription.value,
                    class: "mt-1"
                  }, null, 8, ["description"])) : createCommentVNode("", true),
                  renderSlot(_ctx.$slots, "header-title")
                ])
              ]),
              createElementVNode("div", _hoisted_5, [
                computedHelpLink.value ? (openBlock(), createBlock(_sfc_main$5, {
                  key: 0,
                  "help-link": computedHelpLink.value
                }, null, 8, ["help-link"])) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "header-actions")
              ])
            ]),
            createElementVNode("div", _hoisted_6, [
              renderSlot(_ctx.$slots, "tabs")
            ])
          ], 2)
        ]),
        createElementVNode("div", _hoisted_7, [
          createElementVNode("div", {
            class: normalizeClass(["flex h-full flex-col", __props.scrollable ? "overflow-auto" : ""])
          }, [
            renderSlot(_ctx.$slots, "body")
          ], 2)
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
