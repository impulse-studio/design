import { defineComponent, useModel, computed, ref, watch, openBlock, createBlock, mergeModels } from "vue";
import { fromDate as $11d87f3f76e88657$export$e57ff100d91bd4b9 } from "../../../../node_modules/.pnpm/@internationalized_date@3.11.0/node_modules/@internationalized/date/dist/conversion.js";
import { parseDate as $fae977aafc393c5c$export$6b862160d295c8e } from "../../../../node_modules/.pnpm/@internationalized_date@3.11.0/node_modules/@internationalized/date/dist/string.js";
import BaseInput from "../BaseInput.vue2.js";
const gmtTimezone = "Europe/London";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDatePicker",
  props: /* @__PURE__ */ mergeModels({
    min: {},
    max: {},
    disabled: { type: Boolean },
    class: {},
    timezone: {},
    required: { type: Boolean },
    state: { type: [Boolean, null] }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const timezone = computed(() => props.timezone ?? gmtTimezone);
    const calendarLocalValue = computed(() => {
      if (!value.value) return void 0;
      const date = $11d87f3f76e88657$export$e57ff100d91bd4b9(value.value, timezone.value);
      return date.toDate();
    });
    const localDate = ref();
    watch(
      calendarLocalValue,
      (newValue) => {
        if (newValue) {
          localDate.value = formatDate(newValue);
        } else {
          localDate.value = void 0;
        }
      },
      { immediate: true }
    );
    function onUpdate() {
      if (props.required && localDate.value === void 0) {
        return;
      }
      const newVal = localDate.value ? withSafeTime($fae977aafc393c5c$export$6b862160d295c8e(localDate.value)) : void 0;
      value.value = newVal;
    }
    function withSafeTime(date) {
      return new Date(Date.UTC(date.year, date.month - 1, date.day, 11, 0, 0));
    }
    function formatDate(date) {
      const split = date.toISOString().split("T");
      if (!split[0]) {
        throw new Error("Invalid date format");
      }
      return split[0];
    }
    const computedMin = computed(() => {
      if (!props.min) return void 0;
      return $11d87f3f76e88657$export$e57ff100d91bd4b9(props.min, timezone.value);
    });
    const inputMin = computed(() => {
      if (!computedMin.value) return void 0;
      return formatDate(computedMin.value.toDate());
    });
    const computedMax = computed(() => {
      if (!props.max) return void 0;
      return $11d87f3f76e88657$export$e57ff100d91bd4b9(props.max, timezone.value);
    });
    const inputMax = computed(() => {
      if (!computedMax.value) return void 0;
      return formatDate(computedMax.value.toDate());
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(BaseInput, {
        modelValue: localDate.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localDate.value = $event),
        type: "date",
        "input-class": props.class,
        class: "max-w-44",
        min: inputMin.value,
        max: inputMax.value,
        disabled: __props.disabled,
        state: __props.state,
        onBlur: onUpdate,
        onOnEnterPressed: onUpdate
      }, null, 8, ["modelValue", "input-class", "min", "max", "disabled", "state"]);
    };
  }
});
export {
  _sfc_main as default
};
