import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createBlock, createCommentVNode, createElementVNode, createVNode, renderSlot } from "vue";
import _sfc_main$1 from "./DigiBackButton.vue.js";
import { cn } from "../../../../lib/cn.js";
import { parseDigiLabelFormat } from "../../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$4 from "./DigiDescription.vue.js";
import _sfc_main$2 from "./DigiFeatureName.vue.js";
import _sfc_main$3 from "./DigiTitle.vue.js";
import _sfc_main$5 from "./DigiTutorialLink.vue.js";
const _hoisted_1 = { class: "grow" };
const _hoisted_2 = {
  key: 0,
  class: "flex shrink-0 items-center gap-2"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPageHeader",
  props: {
    title: {},
    description: {},
    helpLink: {},
    feature: {},
    class: {},
    parentRoute: {},
    parentRouteText: {},
    fullWidth: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const parsedSlug = computed(() => {
      return parseDigiLabelFormat(props.title);
    });
    const computedDescription = computed(() => {
      return props.description || parsedSlug.value.description;
    });
    const computedHelpLink = computed(() => {
      return props.helpLink || parsedSlug.value.helpLink;
    });
    const parsedBackText = computed(() => {
      if (!props.parentRouteText) {
        return void 0;
      }
      return parseDigiLabelFormat(props.parentRouteText).label;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(
          unref(cn)(
            "@container mb-8 w-full",
            !props.fullWidth && "mx-auto max-w-4xl",
            props.class
          )
        )
      }, [
        __props.parentRoute && parsedBackText.value ? (openBlock(), createBlock(_sfc_main$1, {
          key: 0,
          to: __props.parentRoute === -1 ? void 0 : __props.parentRoute,
          text: parsedBackText.value
        }, null, 8, ["to", "text"])) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(["flex flex-wrap items-start gap-1 @xl:flex-nowrap", _ctx.$slots.actions ? "justify-between" : "justify-center"])
        }, [
          createElementVNode("div", _hoisted_1, [
            props.feature ? (openBlock(), createBlock(_sfc_main$2, {
              key: 0,
              class: "mb-1",
              title: props.feature.name,
              "icon-name": props.feature.iconName
            }, null, 8, ["title", "icon-name"])) : createCommentVNode("", true),
            createVNode(_sfc_main$3, {
              title: parsedSlug.value.label,
              class: "mb-1 last:mb-0"
            }, null, 8, ["title"]),
            computedDescription.value ? (openBlock(), createBlock(_sfc_main$4, {
              key: 1,
              description: computedDescription.value
            }, null, 8, ["description"])) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "header-title")
          ]),
          _ctx.$slots.actions || computedHelpLink.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
            computedHelpLink.value ? (openBlock(), createBlock(_sfc_main$5, {
              key: 0,
              "help-link": computedHelpLink.value
            }, null, 8, ["help-link"])) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "actions")
          ])) : createCommentVNode("", true)
        ], 2)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
