import { defineComponent, useModel, computed, openBlock, createBlock, mergeProps, unref, mergeModels } from "vue";
import BaseInput from "../BaseInput.vue2.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTimePicker",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    placeholder: {},
    disabled: { type: Boolean },
    state: { type: [Boolean, null], default: void 0 },
    iconName: {},
    min: {},
    max: {},
    step: {},
    accept: {},
    onChange: {},
    autocomplete: {},
    inputClass: {},
    minuteStep: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const secondStep = computed(() => {
      const minuteStep = props.minuteStep ?? 5;
      return minuteStep * 60;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(BaseInput, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props, {
        type: "time",
        "input-class": unref(cn)("block", props.inputClass),
        step: secondStep.value
      }), null, 16, ["modelValue", "input-class", "step"]);
    };
  }
});
export {
  _sfc_main as default
};
