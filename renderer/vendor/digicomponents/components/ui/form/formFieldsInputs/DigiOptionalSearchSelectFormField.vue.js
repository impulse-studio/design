import { defineComponent, useModel, computed, openBlock, createBlock, mergeProps, withCtx, createCommentVNode, renderSlot, createVNode, unref, mergeModels } from "vue";
import _sfc_main$3 from "../../select/DigiSearchSelect.vue.js";
import "lodash-es";
/* empty css                            */
/* empty css                             */
import _sfc_main$2 from "../../select/internals/MultipleSelectValues.vue.js";
/* empty css                                        */
import { getSelectedOptionsFromValues } from "../../select/utils.js";
import _sfc_main$1 from "./DigiOptionalFormField.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalSearchSelectFormField",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    context: {},
    selectProps: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["toggleChange", "open"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const selectedOptions = computed(() => {
      return getSelectedOptionsFromValues(props.selectProps.options, value.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event)
      }, props, {
        onToggleChange: _cache[2] || (_cache[2] = ($event) => emit("toggleChange", $event))
      }), {
        default: withCtx(({ componentField }) => [
          createVNode(unref(_sfc_main$3), mergeProps({
            ...componentField,
            ...__props.selectProps,
            modelValue: value.value,
            valuePlaceholder: componentField.placeholder,
            hideBadges: true
          }, {
            onOpen: _cache[0] || (_cache[0] = ($event) => emit("open"))
          }), {
            "popover-header": withCtx(() => [
              renderSlot(_ctx.$slots, "popover-header")
            ]),
            "append-item": withCtx(({ option }) => [
              renderSlot(_ctx.$slots, "append-item", { option })
            ]),
            _: 3
          }, 16)
        ]),
        bottom: withCtx(() => [
          __props.selectProps.multiple && selectedOptions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            "selected-items": selectedOptions.value,
            class: "mt-2"
          }, null, 8, ["selected-items"])) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "bottom")
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
