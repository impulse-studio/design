import { defineComponent, useModel, computed, openBlock, createBlock, unref, mergeProps, withCtx, createElementVNode, createVNode, createCommentVNode, mergeModels } from "vue";
import { fromDate as $11d87f3f76e88657$export$e57ff100d91bd4b9 } from "../../../../external/.pnpm/@internationalized_date@3.11.0/external/@internationalized/date/dist/conversion.js";
import { DateFormatter as $fb18d541ea1ad717$export$ad991b66133851cf } from "../../../../external/.pnpm/@internationalized_date@3.11.0/external/@internationalized/date/dist/DateFormatter.js";
import z from "zod";
import { useReadonlyDefaultTexts, useReadonlyConfig } from "../../../../config/composables.js";
/* empty css                            */
/* empty css                             */
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
/* empty css                               */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import _sfc_main$2 from "../../input/datetime/DigiDateTimePicker.vue2.js";
import "../../../../lib/zodSchemas.js";
import _sfc_main$3 from "./TimezoneIndicator.vue.js";
/* empty css                                        */
import "lodash-es";
import "../../../../external/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/external/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
/* empty css                                   */
/* empty css                              */
const _hoisted_1 = { class: "w-fit" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDateTimePickerFormField",
  props: /* @__PURE__ */ mergeModels({
    min: {},
    max: {},
    disabled: { type: Boolean },
    timezone: {},
    state: { type: [Boolean, null] },
    id: {},
    name: {},
    zodSchema: {},
    indications: {},
    label: {},
    description: {},
    placeholder: {},
    required: { type: Boolean },
    context: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const config = useReadonlyConfig();
    function formatDateTime(date) {
      const dateTime = $11d87f3f76e88657$export$e57ff100d91bd4b9(date, props.timezone ?? "Europe/London").toDate();
      const formatter = new $fb18d541ea1ad717$export$ad991b66133851cf(config.value.dateConfig.locale, {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: props.timezone ?? "Europe/London"
      });
      return formatter.format(dateTime);
    }
    const defaultZodSchema = computed(() => {
      let schema = z.date();
      if (props.min) {
        schema = schema.min(props.min, {
          message: defaultTexts.value.dateMinError(formatDateTime(props.min))
        });
      }
      if (props.max) {
        schema = schema.max(props.max, {
          message: defaultTexts.value.dateMaxError(formatDateTime(props.max))
        });
      }
      if (!props.required) {
        return schema.optional();
      }
      return schema;
    });
    const computedZodSchema = computed(() => {
      return props.zodSchema ?? defaultZodSchema.value;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props, { "zod-schema": computedZodSchema.value }), {
        default: withCtx(({ componentField }) => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(_sfc_main$2), mergeProps(componentField, {
              timezone: __props.timezone,
              min: __props.min,
              max: __props.max
            }), null, 16, ["timezone", "min", "max"]),
            __props.timezone ? (openBlock(), createBlock(_sfc_main$3, {
              key: 0,
              "local-timezone": __props.timezone
            }, null, 8, ["local-timezone"])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 16, ["modelValue", "zod-schema"]);
    };
  }
});
export {
  _sfc_main as default
};
