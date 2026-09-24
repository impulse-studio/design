import { defineComponent, ref, shallowRef, openBlock, createBlock, unref, withCtx, createVNode, normalizeClass, createElementBlock, Fragment, createTextVNode, toDisplayString, createCommentVNode, renderList, renderSlot, nextTick } from "vue";
import { debounce } from "lodash-es";
import _sfc_main$5 from "./internals/DropdownItemSlot.vue.js";
import DigiSpinner from "../spinner/DigiSpinner.vue.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import _sfc_main$1 from "./internals/command/CommandRoot.vue.js";
/* empty css                         */
import _sfc_main$3 from "./internals/command/CommandEmpty.vue.js";
import _sfc_main$6 from "./internals/command/CommandGroup.vue.js";
import _sfc_main$2 from "./internals/command/CommandInput.vue.js";
import _sfc_main$4 from "./internals/command/CommandList.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCustomSearchSelect",
  props: {
    searchPlaceholder: {},
    searchFormatter: {},
    emptySearchText: {},
    getOptions: {},
    debounce: { default: 500 },
    deactivateRowClick: { type: Boolean },
    suggestions: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchTerm = ref();
    const options = shallowRef([]);
    const loadingRequests = ref(0);
    const defaultTexts = useReadonlyDefaultTexts();
    function onSelect(value) {
      emit("select", value);
    }
    const debouncedSearch = debounce(async (term) => {
      if (!term) {
        options.value = [];
        return Promise.resolve();
      }
      loadingRequests.value += 1;
      try {
        options.value = await props.getOptions(term);
      } finally {
        loadingRequests.value -= 1;
      }
    }, props.debounce);
    function onSearch(term) {
      if (props.searchFormatter) {
        const formattedTerm = props.searchFormatter(term);
        nextTick(() => {
          searchTerm.value = formattedTerm;
        });
        debouncedSearch(formattedTerm);
      } else {
        debouncedSearch(term);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        "ignore-filter": "",
        class: "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border outline-hidden"
      }, {
        default: withCtx(() => [
          createVNode(unref(_sfc_main$2), {
            "model-value": searchTerm.value,
            class: normalizeClass({
              "border-none": !searchTerm.value && !options.value.length && (!__props.suggestions || __props.suggestions.length === 0)
            }),
            placeholder: __props.searchPlaceholder,
            "onUpdate:modelValue": onSearch
          }, null, 8, ["model-value", "class", "placeholder"]),
          !loadingRequests.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            searchTerm.value !== "" && searchTerm.value !== void 0 ? (openBlock(), createBlock(unref(_sfc_main$3), { key: 0 }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.emptySearchText ?? unref(defaultTexts).selectEmptySearch), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(unref(_sfc_main$4), null, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (option, i) => {
                  return openBlock(), createBlock(_sfc_main$5, {
                    key: i,
                    value: option,
                    "deactivate-row-click": props.deactivateRowClick,
                    onSelect
                  }, {
                    default: withCtx(({ value }) => [
                      renderSlot(_ctx.$slots, "item", { value })
                    ]),
                    _: 3
                  }, 8, ["value", "deactivate-row-click"]);
                }), 128)),
                __props.suggestions && __props.suggestions.length > 0 && loadingRequests.value === 0 && (!searchTerm.value?.length || searchTerm.value?.length === 0) ? (openBlock(), createBlock(_sfc_main$6, {
                  key: 0,
                  heading: unref(defaultTexts).selectSuggestionsHeading
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.suggestions, (suggestion, i) => {
                      return openBlock(), createBlock(_sfc_main$5, {
                        key: i,
                        value: suggestion,
                        "deactivate-row-click": props.deactivateRowClick,
                        onSelect
                      }, {
                        default: withCtx(({ value }) => [
                          renderSlot(_ctx.$slots, "item", { value })
                        ]),
                        _: 3
                      }, 8, ["value", "deactivate-row-click"]);
                    }), 128))
                  ]),
                  _: 3
                }, 8, ["heading"])) : createCommentVNode("", true)
              ]),
              _: 3
            })
          ], 64)) : (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            class: "w-full"
          }, {
            default: withCtx(() => [
              createVNode(unref(DigiSpinner))
            ]),
            _: 1
          }))
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
