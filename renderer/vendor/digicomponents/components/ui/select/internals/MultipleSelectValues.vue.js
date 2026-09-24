import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createBlock } from "vue";
import _sfc_main$1 from "../../badge/DigiRemovableChip.vue.js";
const _hoisted_1 = { class: "flex flex-wrap gap-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MultipleSelectValues",
  props: {
    selectedItems: {}
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.selectedItems, (item, i) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: i,
            label: item.label,
            onRemove: ($event) => emits("remove", item.value)
          }, null, 8, ["label", "onRemove"]);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
