import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, createVNode, unref, withCtx, createTextVNode, toDisplayString, renderSlot } from "vue";
import _sfc_main$1 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
const _hoisted_1 = { class: "flex h-full flex-col" };
const _hoisted_2 = { class: "grid grid-cols-5 gap-4 border-b px-6 py-2" };
const _hoisted_3 = { class: "text-md col-span-3 min-w-max self-center text-center font-bold uppercase" };
const _hoisted_4 = { class: "justify-self-end" };
const _hoisted_5 = { class: "overflow-y-auto" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiVerticalMenuSub",
  props: {
    title: {},
    backLabel: {}
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const backLabelValue = computed(
      () => props.backLabel ?? defaultTexts.value.backButtonLabel
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(_sfc_main$1), {
            class: "align-self-center items-center justify-self-start",
            "icon-name": "arrow-left-line",
            variant: "link",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(backLabelValue.value), 1)
            ]),
            _: 1
          }),
          createElementVNode("div", _hoisted_3, toDisplayString(__props.title), 1),
          createElementVNode("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "actions")
          ])
        ]),
        createElementVNode("div", _hoisted_5, [
          renderSlot(_ctx.$slots, "default")
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
