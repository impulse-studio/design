import { defineComponent, useModel, computed, openBlock, createElementBlock, createVNode, unref, withModifiers, mergeModels } from "vue";
import { fromDate as $11d87f3f76e88657$export$e57ff100d91bd4b9, toTime as $11d87f3f76e88657$export$d33f79e3ffc3dc83 } from "../../../../node_modules/.pnpm/@internationalized_date@3.11.0/node_modules/@internationalized/date/dist/conversion.js";
import { now as $14e0f24ef4ac5c92$export$461939dd4422153 } from "../../../../node_modules/.pnpm/@internationalized_date@3.11.0/node_modules/@internationalized/date/dist/queries.js";
import { parseTime as $fae977aafc393c5c$export$c9698ec7f05a07e1 } from "../../../../node_modules/.pnpm/@internationalized_date@3.11.0/node_modules/@internationalized/date/dist/string.js";
/* empty css                            */
/* empty css               */
/* empty css                          */
/* empty css                                */
import _sfc_main$1 from "../date/DigiDatePicker.vue2.js";
import _sfc_main$2 from "../time/DigiTimePicker.vue3.js";
/* empty css                         */
import { useReadonlyConfig } from "../../../../config/composables.js";
/* empty css                             */
const _hoisted_1 = { class: "flex w-full" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDateTimePicker",
  props: /* @__PURE__ */ mergeModels({
    min: {},
    max: {},
    disabled: { type: Boolean },
    timezone: {},
    state: { type: [Boolean, null] },
    id: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const config = useReadonlyConfig();
    const timezone = computed(() => {
      return props.timezone ?? config.value.dateConfig.timezone;
    });
    const zoneDateTime = computed(() => {
      return value.value ? $11d87f3f76e88657$export$e57ff100d91bd4b9(value.value, timezone.value) : void 0;
    });
    const date = computed({
      get: () => {
        return zoneDateTime.value?.set({
          hour: 11,
          minute: 0,
          second: 0,
          millisecond: 0
        }).toDate();
      },
      set: (newDate) => {
        if (!newDate) {
          value.value = void 0;
          return;
        }
        const time = $11d87f3f76e88657$export$d33f79e3ffc3dc83(zoneDateTime.value ?? $14e0f24ef4ac5c92$export$461939dd4422153(timezone.value));
        value.value = $11d87f3f76e88657$export$e57ff100d91bd4b9(
          newDate,
          props.timezone ?? config.value.dateConfig.timezone
        ).set(time).toDate();
      }
    });
    const timeString = computed({
      get: () => {
        return zoneDateTime.value ? $11d87f3f76e88657$export$d33f79e3ffc3dc83(zoneDateTime.value).toString().slice(0, 5) : void 0;
      },
      set: (newTimeString) => {
        if (!newTimeString) {
          return;
        }
        const newTime = $fae977aafc393c5c$export$c9698ec7f05a07e1(newTimeString);
        value.value = (zoneDateTime.value ?? $14e0f24ef4ac5c92$export$461939dd4422153(timezone.value)).set(newTime).toDate();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(_sfc_main$1), {
          id: __props.id,
          modelValue: date.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => date.value = $event),
          class: "rounded-r-none border-r-0",
          min: __props.min,
          max: __props.max,
          disabled: __props.disabled,
          state: __props.state,
          onChange: _cache[1] || (_cache[1] = withModifiers(() => {
          }, ["stop"])),
          onInput: _cache[2] || (_cache[2] = withModifiers(() => {
          }, ["stop"]))
        }, null, 8, ["id", "modelValue", "min", "max", "disabled", "state"]),
        createVNode(unref(_sfc_main$2), {
          modelValue: timeString.value,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => timeString.value = $event),
          class: "max-w-40",
          "input-class": "rounded-l-none",
          disabled: __props.disabled,
          state: __props.state
        }, null, 8, ["modelValue", "disabled", "state"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
