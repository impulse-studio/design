import { defineComponent, computed, openBlock, createBlock, normalizeProps, guardReactiveProps, createSlots, withCtx, createCommentVNode, createVNode, unref, createTextVNode, toDisplayString, renderSlot } from "vue";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$2 from "../label/DigiLabel.vue.js";
import _sfc_main$1 from "./DigiRadioGroupNudeItem.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioGroupItem",
  props: {
    disabled: { type: Boolean },
    required: { type: Boolean },
    value: {},
    name: {},
    class: {},
    label: {},
    description: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.label);
    });
    const itemDescription = computed(() => {
      return props.description ?? parsedLabel.value.description;
    });
    const delegatedProps = computed(() => {
      const { label, description, iconName, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, normalizeProps(guardReactiveProps(delegatedProps.value)), createSlots({
        default: withCtx(({ optionId }) => [
          __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
            key: 0,
            name: __props.iconName,
            class: "flex h-4 w-4 items-center gap-1"
          }, null, 8, ["name"])) : createCommentVNode("", true),
          createVNode(unref(_sfc_main$2), { for: optionId }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(parsedLabel.value.label), 1)
            ]),
            _: 1
          }, 8, ["for"])
        ]),
        _: 2
      }, [
        itemDescription.value || _ctx.$slots.description ? {
          name: "description",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "description", {}, () => [
              createTextVNode(toDisplayString(itemDescription.value), 1)
            ])
          ]),
          key: "0"
        } : void 0
      ]), 1040);
    };
  }
});
export {
  _sfc_main as default
};
