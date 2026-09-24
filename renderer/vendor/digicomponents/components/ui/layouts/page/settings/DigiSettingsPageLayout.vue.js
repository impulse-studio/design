import { defineComponent, useTemplateRef, openBlock, createBlock, normalizeClass, withCtx, renderSlot, createCommentVNode, createVNode, unref, createElementVNode } from "vue";
import { provideTableOfContentLinkContext } from "../../../table-of-content/utils.js";
import _sfc_main$4 from "../../../table-of-content/DigiTableOfContent.vue.js";
import _sfc_main$3 from "../../../table-of-content/DigiTableOfContentLinkContainer.vue.js";
import _sfc_main$2 from "../../headers/DigiPageHeader.vue.js";
import _sfc_main$1 from "../DigiPageContainer.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSettingsPageLayout",
  props: {
    title: {},
    description: {},
    helpLink: {},
    feature: {},
    parentRoute: {},
    parentRouteText: {},
    fullWidth: { type: Boolean },
    fullWidthHeader: { type: Boolean },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const containerRef = useTemplateRef("containerRef");
    const cardsContainerRef = useTemplateRef("cardsContainerRef");
    provideTableOfContentLinkContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "containerRef",
        ref: containerRef,
        "full-width": __props.fullWidth,
        class: normalizeClass(props.class)
      }, {
        default: withCtx(() => [
          __props.title ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            title: __props.title,
            description: __props.description,
            "help-link": __props.helpLink,
            "parent-route": __props.parentRoute,
            "parent-route-text": __props.parentRouteText,
            "full-width": __props.fullWidthHeader,
            feature: __props.feature
          }, {
            actions: withCtx(() => [
              renderSlot(_ctx.$slots, "header-actions")
            ]),
            "header-title": withCtx(() => [
              renderSlot(_ctx.$slots, "header-title")
            ]),
            _: 3
          }, 8, ["title", "description", "help-link", "parent-route", "parent-route-text", "full-width", "feature"])) : createCommentVNode("", true),
          createVNode(unref(_sfc_main$3), null, {
            default: withCtx(() => [
              createElementVNode("div", {
                ref_key: "cardsContainerRef",
                ref: cardsContainerRef,
                class: "flex flex-col gap-5"
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 512)
            ]),
            _: 3
          }),
          createVNode(unref(_sfc_main$4), {
            "cards-container-ref": cardsContainerRef.value,
            "container-ref": containerRef.value?.containerEl ?? null
          }, null, 8, ["cards-container-ref", "container-ref"])
        ]),
        _: 3
      }, 8, ["full-width", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
