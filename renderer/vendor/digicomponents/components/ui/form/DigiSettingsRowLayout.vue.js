import { defineComponent, computed, unref, openBlock, createBlock, withCtx, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createVNode, createElementVNode } from "vue";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$3 from "./DigiRowLabel.vue.js";
import _sfc_main$1 from "./formRowUi/DigiFormRowContainer.vue.js";
import _sfc_main$6 from "./formRowUi/DigiModalFormRowContainer.vue.js";
import _sfc_main$5 from "./formRowUi/DigiNudeFormRowContainer.vue.js";
import _sfc_main$2 from "./formRowUi/DigiRowDescription.vue.js";
import { injectFormFieldContext } from "./injectionKeys.js";
import _sfc_main$4 from "./internals/FormHelpLink.vue.js";
const _hoisted_1 = { class: "mb-2 flex flex-col items-start gap-1 empty:hidden" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSettingsRowLayout",
  props: {
    label: {},
    description: {},
    helpLink: {},
    indications: {},
    disabled: { type: Boolean },
    context: {}
  },
  setup(__props) {
    const props = __props;
    const context = props.context ?? injectFormFieldContext("card");
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.label);
    });
    const computedDescription = computed(
      () => props.description || parsedLabel.value.description
    );
    const computedHelpLink = computed(
      () => props.helpLink || parsedLabel.value.helpLink
    );
    return (_ctx, _cache) => {
      return unref(context) === "card" ? (openBlock(), createBlock(_sfc_main$1, {
        key: 0,
        disabled: __props.disabled
      }, {
        label: withCtx(() => [
          renderSlot(_ctx.$slots, "top"),
          createVNode(_sfc_main$3, null, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(parsedLabel.value.label), 1)
            ]),
            _: 1
          }),
          computedDescription.value ? (openBlock(), createBlock(_sfc_main$2, { key: 0 }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(computedDescription.value), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(_sfc_main$4, { "help-link": computedHelpLink.value }, null, 8, ["help-link"])
        ]),
        item: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          __props.indications ? (openBlock(), createBlock(_sfc_main$2, { key: 0 }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.indications), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["disabled"])) : unref(context) === "nude" ? (openBlock(), createBlock(_sfc_main$5, {
        key: 1,
        disabled: __props.disabled
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["disabled"])) : (openBlock(), createBlock(_sfc_main$6, {
        key: 2,
        disabled: __props.disabled
      }, {
        label: withCtx(() => [
          renderSlot(_ctx.$slots, "top"),
          createVNode(_sfc_main$3, { class: "only:mb-2" }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(parsedLabel.value.label), 1)
            ]),
            _: 1
          }),
          createElementVNode("div", _hoisted_1, [
            computedDescription.value ? (openBlock(), createBlock(_sfc_main$2, { key: 0 }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(computedDescription.value), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(_sfc_main$4, { "help-link": computedHelpLink.value }, null, 8, ["help-link"])
          ])
        ]),
        item: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          __props.indications ? (openBlock(), createBlock(_sfc_main$2, { key: 0 }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.indications), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["disabled"]));
    };
  }
});
export {
  _sfc_main as default
};
