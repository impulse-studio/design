import { defineComponent, useModel, computed, openBlock, createBlock, mergeProps, withCtx, createElementVNode, createVNode, unref, createCommentVNode, mergeModels } from "vue";
import { z } from "zod";
import _sfc_main$1 from "../DigiFormFieldContextRenderer.vue.js";
import _sfc_main$3 from "./TimezoneIndicator.vue.js";
/* empty css                            */
/* empty css                        */
/* empty css                                   */
/* empty css                                         */
/* empty css                                  */
import _sfc_main$2 from "../../input/timeRangePicker/DigiTimeRangePicker.vue2.js";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
/* empty css                             */
const _hoisted_1 = { class: "w-fit" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTimeRangePickerFormField",
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
    day: {},
    timezone: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const computedZodSchema = computed(() => {
      return props.zodSchema || z.tuple([z.date(), z.date()]).refine((value2) => {
        return value2[0] < value2[1];
      }, defaultTexts.value.timeRangeDefaultError);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps({
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event)
      }, props, { "zod-schema": computedZodSchema.value }), {
        default: withCtx(({ componentField }) => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(_sfc_main$2), mergeProps(componentField, {
              day: __props.day,
              timezone: __props.timezone
            }), null, 16, ["day", "timezone"]),
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
