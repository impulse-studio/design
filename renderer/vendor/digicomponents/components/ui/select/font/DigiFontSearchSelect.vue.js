import { defineComponent, useModel, ref, computed, onMounted, openBlock, createElementBlock, Fragment, renderList, createVNode, unref, withCtx, normalizeStyle, createBlock, createCommentVNode, createTextVNode, toDisplayString, mergeModels } from "vue";
import { ListboxVirtualizer_default } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Listbox/ListboxVirtualizer.js";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
import _sfc_main$1 from "../../popover/DigiPopover.vue.js";
/* empty css                            */
import _sfc_main$3 from "../../popover/DigiPopoverBasicContent.vue.js";
import _sfc_main$4 from "../internals/listbox/ListboxRoot.vue.js";
import _sfc_main$5 from "../internals/listbox/ListboxInput.vue.js";
import _sfc_main$6 from "../internals/listbox/ListboxContent.vue.js";
import _sfc_main$7 from "../internals/listbox/ListboxItem.vue.js";
import _sfc_main$2 from "../internals/MultipleSelectValues.vue.js";
import SelectTrigger from "../internals/SelectTrigger.vue2.js";
import { useFontsStore } from "./store.js";
const _hoisted_1 = ["href"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiFontSearchSelect",
  props: /* @__PURE__ */ mergeModels({
    multiple: { type: Boolean, default: void 0 },
    valuePlaceholder: {},
    state: { type: [Boolean, null], default: void 0 },
    selectedText: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const fontsStore = useFontsStore();
    const options = ref([]);
    const styleSheets = ref([]);
    const open = ref(false);
    const searchTerm = ref("");
    const valueText = computed(() => {
      if (value.value === void 0) return "";
      if (Array.isArray(value.value)) {
        if (value.value.length === 0) return "";
        if (value.value.length === 1) return value.value[0];
        return `${value.value.length} ${props.selectedText ?? defaultTexts.value.selectedItemsText ?? ""}`;
      }
      return value.value;
    });
    const filteredOptions = computed(() => {
      if (searchTerm.value === "") return options.value;
      return options.value.filter(
        (option) => option.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });
    function onUpdate(v) {
      if (!props.multiple) {
        open.value = false;
      }
      value.value = v;
    }
    function onRemove(v) {
      if (Array.isArray(value.value)) {
        value.value = value.value.filter((value2) => value2 !== v);
      } else {
        value.value = void 0;
      }
    }
    onMounted(async () => {
      const { fonts, styleSheetUrls } = await fontsStore.load();
      options.value = fonts.map((font) => font.family);
      styleSheets.value = styleSheetUrls;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(styleSheets.value, (url, i) => {
          return openBlock(), createElementBlock("link", {
            key: i,
            href: url,
            rel: "stylesheet"
          }, null, 8, _hoisted_1);
        }), 128)),
        createVNode(unref(_sfc_main$1), {
          open: open.value,
          "onUpdate:open": _cache[2] || (_cache[2] = ($event) => open.value = $event)
        }, {
          default: withCtx(() => [
            createVNode(SelectTrigger, {
              "value-text": valueText.value,
              "is-open": open.value,
              placeholder: __props.valuePlaceholder,
              state: __props.state,
              style: normalizeStyle(
                (!Array.isArray(value.value) || value.value.length === 1) && `font-family: ${value.value}, Poppins, sans-serif;`
              )
            }, null, 8, ["value-text", "is-open", "placeholder", "state", "style"]),
            Array.isArray(value.value) && value.value.length > 0 ? (openBlock(), createBlock(_sfc_main$2, {
              key: 0,
              class: "mt-2",
              "selected-items": value.value.map((value2) => ({ value: value2, label: value2, kind: "option" })),
              onRemove
            }, null, 8, ["selected-items"])) : createCommentVNode("", true),
            createVNode(_sfc_main$3, { class: "w-(--reka-popover-trigger-width) p-0" }, {
              default: withCtx(() => [
                createVNode(unref(_sfc_main$4), {
                  "model-value": value.value,
                  multiple: __props.multiple,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = (value2) => onUpdate(value2))
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), {
                      modelValue: searchTerm.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchTerm.value = $event),
                      class: "h-9"
                    }, null, 8, ["modelValue"]),
                    createVNode(unref(_sfc_main$6), null, {
                      default: withCtx(() => [
                        createVNode(unref(ListboxVirtualizer_default), { options: filteredOptions.value }, {
                          default: withCtx(({ option }) => [
                            createVNode(unref(_sfc_main$7), {
                              value: option,
                              style: normalizeStyle(`font-family: ${option}, Poppins, sans-serif;`)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(option), 1)
                              ]),
                              _: 2
                            }, 1032, ["value", "style"])
                          ]),
                          _: 1
                        }, 8, ["options"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["model-value", "multiple"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["open"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
