import { defineComponent, useModel, computed, openBlock, createElementBlock, createVNode, createTextVNode, mergeModels } from "vue";
import { fromDate as $11d87f3f76e88657$export$e57ff100d91bd4b9 } from "../../../../external/.pnpm/@internationalized_date@3.11.0/external/@internationalized/date/dist/conversion.js";
import { useReadonlyConfig } from "../../../../config/composables.js";
import _sfc_main$1 from "../time/DigiTimePicker.vue3.js";
/* empty css                         */
import { useTimeRangePickerConverters } from "./useTimeRangePickerConverters.js";
const _hoisted_1 = { class: "flex items-center gap-2" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTimeRangePicker",
  props: /* @__PURE__ */ mergeModels({
    day: {},
    state: { type: [Boolean, null], default: void 0 },
    timezone: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const dateRange = useModel(__props, "modelValue");
    const props = __props;
    const timezone = computed(
      () => props.timezone ?? config.value.dateConfig.timezone
    );
    const config = useReadonlyConfig();
    const dayDateValue = computed(() => {
      return $11d87f3f76e88657$export$e57ff100d91bd4b9(props.day, timezone.value);
    });
    const { getDateFromString, getInputTimeStringFromDate } = useTimeRangePickerConverters({
      timezone: timezone.value,
      locale: config.value.dateConfig.locale
    });
    const startTime = computed({
      get: () => getInputTimeStringFromDate(dateRange.value?.[0]),
      set: (value) => {
        const startDate = getDateFromString(value, dayDateValue.value);
        dateRange.value = [startDate, dateRange.value?.[1]];
      }
    });
    const endTime = computed({
      get: () => getInputTimeStringFromDate(dateRange.value?.[1]),
      set: (value) => {
        const endDate = getDateFromString(value, dayDateValue.value);
        dateRange.value = [dateRange.value?.[0], endDate];
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_sfc_main$1, {
          modelValue: startTime.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => startTime.value = $event),
          state: __props.state
        }, null, 8, ["modelValue", "state"]),
        _cache[2] || (_cache[2] = createTextVNode(" - ", -1)),
        createVNode(_sfc_main$1, {
          modelValue: endTime.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => endTime.value = $event),
          state: __props.state
        }, null, 8, ["modelValue", "state"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
