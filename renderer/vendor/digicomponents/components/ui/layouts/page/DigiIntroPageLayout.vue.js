import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, createVNode, unref, renderSlot, createCommentVNode, createBlock, withCtx, createTextVNode, toDisplayString } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
/* empty css                             */
import _sfc_main$2 from "../../actions/link/DigiLink.vue.js";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
import { parseDigiLabelFormat } from "../../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$1 from "../headers/DigiPageHeader.vue.js";
const _hoisted_1 = { class: "flex h-full w-full grow items-center justify-center self-center px-4" };
const _hoisted_2 = { class: "w-full max-w-3xl items-center text-center" };
const _hoisted_3 = {
  key: 0,
  class: "mb-5"
};
const _hoisted_4 = { class: "flex justify-center gap-4" };
const _hoisted_5 = { class: "mt-4 flex justify-center gap-4" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIntroPageLayout",
  props: {
    title: {},
    description: {},
    helpLink: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    const parsedTitle = computed(() => {
      return parseDigiLabelFormat(props.title);
    });
    const computedHelpLink = computed(() => {
      return props.helpLink || parsedTitle.value.helpLink;
    });
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(DigiRemixIcon), {
            name: __props.iconName,
            class: "mb-3",
            size: "3x"
          }, null, 8, ["name"]),
          createVNode(_sfc_main$1, {
            title: parsedTitle.value.label,
            description: __props.description ?? parsedTitle.value.description ?? void 0,
            class: "mb-5"
          }, null, 8, ["title", "description"]),
          _ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_3, [
            renderSlot(_ctx.$slots, "default")
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_4, [
            computedHelpLink.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
              key: 0,
              href: computedHelpLink.value,
              "icon-name": "question-line",
              variant: "secondary"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(defaultTexts).helpText), 1)
              ]),
              _: 1
            }, 8, ["href"])) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "actions")
          ]),
          createElementVNode("div", _hoisted_5, [
            renderSlot(_ctx.$slots, "secondary-actions")
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
