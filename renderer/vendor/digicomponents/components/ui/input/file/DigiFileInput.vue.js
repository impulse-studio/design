import { defineComponent, useModel, useTemplateRef, openBlock, createElementBlock, createBlock, mergeProps, createElementVNode, toDisplayString, unref, createVNode, mergeModels } from "vue";
import BaseInput from "../BaseInput.vue2.js";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
/* empty css                            */
/* empty css                             */
import _sfc_main$1 from "../../actions/icons/DigiIconButton.vue.js";
import { formatFileSize } from "./formatFileSize.js";
const _hoisted_1 = {
  key: 1,
  class: "border-input flex items-center gap-2 rounded-md border p-3"
};
const _hoisted_2 = { class: "min-w-0 flex-1" };
const _hoisted_3 = { class: "truncate text-sm font-medium" };
const _hoisted_4 = { class: "text-muted-foreground text-xs" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFileInput",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    disabled: { type: Boolean },
    state: { type: [Boolean, null], default: void 0 },
    iconName: {},
    min: {},
    max: {},
    step: {},
    accept: {},
    onChange: {},
    autocomplete: {},
    acceptedFileTypes: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("input");
    const defaultsText = useReadonlyDefaultTexts();
    function onChange(event) {
      const target = event.target;
      const file = target.files?.[0];
      if (file) {
        value.value = file;
      }
    }
    function removeFile() {
      value.value = void 0;
      input.value?.setInputValue("");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        !value.value ? (openBlock(), createBlock(BaseInput, mergeProps({
          key: 0,
          ref_key: "input",
          ref: input
        }, props, {
          type: "file",
          accept: __props.acceptedFileTypes,
          onChange
        }), null, 16, ["accept"])) : (openBlock(), createElementBlock("div", _hoisted_1, [
          createElementVNode("div", _hoisted_2, [
            createElementVNode("div", _hoisted_3, toDisplayString(value.value.name), 1),
            createElementVNode("div", _hoisted_4, toDisplayString(unref(formatFileSize)(value.value.size)), 1)
          ]),
          createVNode(unref(_sfc_main$1), {
            variant: "destructive",
            "icon-name": "delete-bin-line",
            tooltip: unref(defaultsText).removeFileTooltip,
            onClick: removeFile
          }, null, 8, ["tooltip"])
        ]))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
