import { defineComponent, computed, openBlock, createBlock, unref, withCtx, createVNode, normalizeClass, createElementVNode, createTextVNode, toDisplayString, createCommentVNode, createElementBlock, renderSlot } from "vue";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
/* empty css                         */
/* empty css                          */
import _sfc_main$6 from "../actions/link/DigiLink.vue.js";
import _sfc_main$1 from "../table-of-content/DigiTableOfContentLink.vue.js";
import _sfc_main$4 from "./DigiCardTitle.vue.js";
import _sfc_main$2 from "./internals/BaseCard.vue.js";
import _sfc_main$7 from "./internals/CardContent.vue.js";
import _sfc_main$5 from "./internals/CardDescription.vue.js";
import _sfc_main$8 from "./internals/CardFooter.vue.js";
import _sfc_main$3 from "./internals/CardHeader.vue.js";
const _hoisted_1 = { class: "flex items-center justify-between" };
const _hoisted_2 = { class: "max-w-[70%]" };
const _hoisted_3 = {
  key: 0,
  class: "flex items-center gap-4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCardLayout1",
  props: {
    title: {},
    description: {},
    helpLink: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const parsedLabel = computed(() => parseDigiLabelFormat(props.title));
    const computedTitle = computed(() => {
      return parsedLabel.value.label;
    });
    const computedDescription = computed(() => {
      return props.description ?? parsedLabel.value.description;
    });
    const computedHelpLink = computed(() => {
      return props.helpLink ?? parsedLabel.value.helpLink;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        title: computedTitle.value,
        description: computedDescription.value ?? void 0
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, null, {
            default: withCtx(() => [
              createVNode(_sfc_main$3, {
                class: normalizeClass(!_ctx.$slots.default && "border-none")
              }, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_1, [
                    createElementVNode("div", _hoisted_2, [
                      createVNode(_sfc_main$4, { "icon-name": __props.iconName }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(computedTitle.value), 1)
                        ]),
                        _: 1
                      }, 8, ["icon-name"]),
                      computedDescription.value || computedHelpLink.value ? (openBlock(), createBlock(_sfc_main$5, {
                        key: 0,
                        class: "mt-1"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(computedDescription.value), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      computedHelpLink.value ? (openBlock(), createBlock(unref(_sfc_main$6), {
                        key: 1,
                        href: computedHelpLink.value,
                        "icon-name": "question-line",
                        size: "sm",
                        variant: "link"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(defaultTexts).helpText), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true)
                    ]),
                    _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_3, [
                      renderSlot(_ctx.$slots, "actions")
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 3
              }, 8, ["class"]),
              _ctx.$slots.default ? (openBlock(), createBlock(_sfc_main$7, { key: 0 }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })) : createCommentVNode("", true),
              createVNode(_sfc_main$8, { class: "pt-3 empty:hidden" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "footer")
                ]),
                _: 3
              })
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["title", "description"]);
    };
  }
});
export {
  _sfc_main as default
};
