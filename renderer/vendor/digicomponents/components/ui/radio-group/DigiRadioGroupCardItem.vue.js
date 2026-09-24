import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, createVNode, normalizeClass, renderSlot, createCommentVNode, createElementVNode, toDisplayString, createElementBlock } from "vue";
import { RadioGroupItem_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/RadioGroup/RadioGroupItem.js";
import { RadioGroupIndicator_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/RadioGroup/RadioGroupIndicator.js";
import { cn } from "../../../lib/cn.js";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "block text-left leading-tight font-medium" };
const _hoisted_2 = {
  key: 1,
  class: "text-muted mt-1 text-left text-sm"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRadioGroupCardItem",
  props: {
    disabled: { type: Boolean },
    required: { type: Boolean },
    value: {},
    name: {},
    class: {},
    label: {},
    description: {},
    descriptionPlacement: { default: "below" },
    alignment: { default: "left" },
    iconName: {},
    containerClass: {}
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
      const {
        label,
        description,
        descriptionPlacement,
        alignment,
        iconName,
        ...delegated
      } = props;
      return delegated;
    });
    const optionId = props.value + "-" + Math.random().toString(36).substring(7);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(RadioGroupItem_default), mergeProps(delegatedProps.value, {
        id: optionId,
        class: unref(cn)(props.class, "block flex-1")
      }), {
        default: withCtx(() => [
          createVNode(unref(RadioGroupIndicator_default), {
            as: "div",
            "force-mount": "",
            class: normalizeClass(
              unref(cn)(
                "border-input [&:not([data-disabled])]:hover:bg-secondary data-[state=checked]:border-primary data-[state=checked]:bg-secondary block h-100 cursor-pointer rounded-lg border p-4 transition-colors",
                { "cursor-not-allowed opacity-50": props.disabled },
                {
                  "flex flex-1 flex-col justify-center gap-1": !_ctx.$slots.default,
                  "items-center text-center": !_ctx.$slots.default && __props.alignment === "center",
                  "items-start": !_ctx.$slots.default && __props.alignment === "left"
                }
              )
            )
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default", { parsedLabel: parsedLabel.value }, () => [
                __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                  key: 0,
                  name: __props.iconName,
                  size: "lg"
                }, null, 8, ["name"])) : createCommentVNode("", true),
                createElementVNode("span", _hoisted_1, toDisplayString(parsedLabel.value.label), 1),
                itemDescription.value ? (openBlock(), createElementBlock("p", _hoisted_2, toDisplayString(itemDescription.value), 1)) : createCommentVNode("", true)
              ])
            ]),
            _: 3
          }, 8, ["class"])
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
