import { defineComponent, computed, openBlock, createBlock, normalizeClass, unref, withCtx, createElementVNode, createVNode, createTextVNode, toDisplayString, renderSlot, createCommentVNode, createElementBlock } from "vue";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import { cn } from "../../../lib/cn.js";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$5 from "../actions/button/DigiButton.vue.js";
import _sfc_main$4 from "../actions/link/DigiLink.vue.js";
import _sfc_main$6 from "../actions/router-link/DigiRouterLink.vue.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import DigiSpinner from "../spinner/DigiSpinner.vue.js";
import _sfc_main$3 from "./internals/AlertDescription.vue.js";
import _sfc_main$1 from "./internals/AlertRoot.vue.js";
import _sfc_main$2 from "./internals/AlertTitle.vue.js";
const _hoisted_1 = { class: "flex w-full flex-row items-center gap-2" };
const _hoisted_2 = { class: "flex flex-col gap-1" };
const _hoisted_3 = { class: "flex gap-2" };
const _hoisted_4 = {
  key: 0,
  class: "flex items-center @sm:ml-auto"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAlert",
  props: {
    title: {},
    description: {},
    action: {},
    variant: {},
    isLoading: { type: Boolean },
    class: {}
  },
  setup(__props) {
    const defaultTexts = useReadonlyDefaultTexts();
    const iconName = computed(() => {
      switch (__props.variant) {
        case "info":
          return "information-line";
        case "warning":
          return "error-warning-line";
        case "destructive":
          return "alarm-warning-line";
        default:
          return "information-line";
      }
    });
    const parsedLabel = computed(() => parseDigiLabelFormat(__props.title));
    const computedDescription = computed(
      () => __props.description ?? parsedLabel.value.description ?? ""
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        variant: __props.variant,
        class: normalizeClass([unref(cn)(!__props.description && "items-center", __props.class), "@container"])
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", _hoisted_2, [
              createElementVNode("div", _hoisted_3, [
                __props.isLoading ? (openBlock(), createBlock(unref(DigiSpinner), {
                  key: 0,
                  size: "sm",
                  class: "self-start"
                })) : (openBlock(), createBlock(DigiRemixIcon, {
                  key: 1,
                  name: iconName.value,
                  class: "self-start"
                }, null, 8, ["name"])),
                createVNode(_sfc_main$2, null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(parsedLabel.value.label), 1)
                  ]),
                  _: 1
                })
              ]),
              computedDescription.value || _ctx.$slots.default ? (openBlock(), createBlock(_sfc_main$3, { key: 0 }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createTextVNode(toDisplayString(computedDescription.value), 1)
                  ])
                ]),
                _: 3
              })) : createCommentVNode("", true)
            ]),
            parsedLabel.value.helpLink || __props.action ? (openBlock(), createElementBlock("div", _hoisted_4, [
              parsedLabel.value.helpLink ? (openBlock(), createBlock(unref(_sfc_main$4), {
                key: 0,
                href: parsedLabel.value.helpLink,
                "icon-name": "book-open-line",
                size: "sm",
                variant: "secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(defaultTexts).helpText), 1)
                ]),
                _: 1
              }, 8, ["href"])) : __props.action?.kind === "button" ? (openBlock(), createBlock(_sfc_main$5, {
                key: 1,
                "icon-name": __props.action.iconName,
                "is-loading": __props.action.isLoading,
                disabled: __props.action.disabled,
                variant: "secondary",
                size: "sm",
                onClick: __props.action.handler
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.action.label), 1)
                ]),
                _: 1
              }, 8, ["icon-name", "is-loading", "disabled", "onClick"])) : __props.action?.kind === "link" ? (openBlock(), createBlock(unref(_sfc_main$4), {
                key: 2,
                href: __props.action.href,
                "icon-name": __props.action.iconName,
                size: "sm",
                variant: "secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.action.label), 1)
                ]),
                _: 1
              }, 8, ["href", "icon-name"])) : __props.action?.kind === "router-link" ? (openBlock(), createBlock(unref(_sfc_main$6), {
                key: 3,
                "icon-name": __props.action.iconName,
                to: __props.action.to,
                size: "sm",
                variant: "secondary",
                "new-tab": __props.action.openInNewTab
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.action.label), 1)
                ]),
                _: 1
              }, 8, ["icon-name", "to", "new-tab"])) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ])
        ]),
        _: 3
      }, 8, ["variant", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
