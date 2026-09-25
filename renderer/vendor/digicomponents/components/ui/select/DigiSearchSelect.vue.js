import { defineComponent, useModel, ref, watchEffect, computed, openBlock, createBlock, unref, withCtx, createVNode, createSlots, renderSlot, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, createElementBlock, Fragment, renderList, mergeModels } from "vue";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import _sfc_main$1 from "../popover/DigiPopover.vue.js";
/* empty css                         */
import _sfc_main$3 from "../popover/DigiPopoverBasicContent.vue.js";
import _sfc_main$4 from "./internals/command/CommandRoot.vue.js";
import _sfc_main$6 from "./internals/command/CommandEmpty.vue.js";
import _sfc_main$5 from "./internals/command/CommandInput.vue.js";
import _sfc_main$7 from "./internals/command/CommandList.vue.js";
import _sfc_main$8 from "./internals/ItemOrGroupRenderer.vue.js";
import _sfc_main$2 from "./internals/MultipleSelectValues.vue.js";
import { provideOptionKey } from "./internals/optionKey.js";
import SelectTrigger from "./internals/SelectTrigger.vue.js";
import { filterOptionOrGroups, computeValueText, getSelectedOptionsFromValues, getValueFromOptions } from "./utils.js";
const _hoisted_1 = { class: "border-b p-2 empty:hidden" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSearchSelect",
  props: /* @__PURE__ */ mergeModels({
    id: {},
    multiple: { type: Boolean, default: void 0 },
    options: {},
    valuePlaceholder: {},
    searchPlaceholder: {},
    emptySearchText: {},
    filterFunction: {},
    state: { type: [Boolean, null], default: void 0 },
    selectedText: {},
    disabled: { type: Boolean },
    triggerIcon: {},
    hideBadges: { type: Boolean }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["open"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const open = ref(false);
    watchEffect(() => {
      if (open.value) {
        emit("open");
      }
    });
    const getKey = provideOptionKey();
    const searchTerm = ref("");
    const filteredOptions = computed(() => {
      return filterOptionOrGroups(props.options, searchTerm.value);
    });
    const valueText = computed(() => {
      return computeValueText({
        value: value.value,
        options: props.options,
        selectedText: props.selectedText,
        defaultTexts: defaultTexts.value
      });
    });
    const defaultTexts = useReadonlyDefaultTexts();
    const selectedOptions = computed(() => {
      return getSelectedOptionsFromValues(props.options, value.value);
    });
    function onUpdate(newOption) {
      if (!props.multiple) {
        open.value = false;
      }
      value.value = getValueFromOptions({
        options: newOption,
        multiple: props.multiple
      });
    }
    function onRemove(v) {
      if (Array.isArray(value.value)) {
        value.value = value.value.filter((value2) => value2 !== v);
      } else {
        value.value = void 0;
      }
    }
    function togglePopover(value2) {
      if (props.disabled && !open.value) return;
      open.value = value2;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        open: open.value,
        "onUpdate:open": togglePopover
      }, {
        default: withCtx(() => [
          createVNode(SelectTrigger, {
            id: __props.id,
            "value-text": valueText.value,
            "is-open": open.value,
            placeholder: __props.valuePlaceholder,
            disabled: __props.disabled,
            state: __props.state,
            "icon-name": __props.triggerIcon
          }, createSlots({ _: 2 }, [
            _ctx.$slots.prepend ? {
              name: "prepend",
              fn: withCtx(() => [
                renderSlot(_ctx.$slots, "prepend")
              ]),
              key: "0"
            } : void 0,
            _ctx.$slots.append ? {
              name: "append",
              fn: withCtx(() => [
                renderSlot(_ctx.$slots, "append")
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["id", "value-text", "is-open", "placeholder", "disabled", "state", "icon-name"]),
          __props.multiple && !__props.hideBadges && selectedOptions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            class: "mt-2",
            "selected-items": selectedOptions.value,
            onRemove
          }, null, 8, ["selected-items"])) : createCommentVNode("", true),
          createVNode(_sfc_main$3, { class: "w-(--reka-popover-trigger-width) p-0" }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$4), {
                "model-value": selectedOptions.value,
                multiple: __props.multiple,
                "ignore-filter": true,
                class: "max-h-(--reka-popover-content-available-height)",
                "onUpdate:modelValue": onUpdate
              }, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_1, [
                    renderSlot(_ctx.$slots, "popover-header")
                  ]),
                  createVNode(unref(_sfc_main$5), {
                    modelValue: searchTerm.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchTerm.value = $event),
                    class: "h-9",
                    placeholder: __props.searchPlaceholder
                  }, null, 8, ["modelValue", "placeholder"]),
                  createVNode(unref(_sfc_main$6), null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.emptySearchText ?? unref(defaultTexts).selectEmptySearch), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$7), null, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(filteredOptions.value, (option) => {
                        return openBlock(), createBlock(_sfc_main$8, {
                          key: unref(getKey)(option),
                          option,
                          "selected-values": Array.isArray(value.value) ? value.value : [value.value]
                        }, {
                          "append-item": withCtx(({ option: optionItem }) => [
                            renderSlot(_ctx.$slots, "append-item", { option: optionItem })
                          ]),
                          _: 3
                        }, 8, ["option", "selected-values"]);
                      }), 128))
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              }, 8, ["model-value", "multiple"])
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["open"]);
    };
  }
});
export {
  _sfc_main as default
};
