import { defineComponent, openBlock, createBlock, withCtx, renderSlot } from "vue";
import _sfc_main$2 from "./SelectGroup.vue.js";
import _sfc_main$1 from "./SelectItem.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ItemOrGroupRenderer",
  props: {
    option: {},
    selectedValues: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.option.kind === "option" ? (openBlock(), createBlock(_sfc_main$1, {
        key: 0,
        option: __props.option,
        "selected-values": __props.selectedValues
      }, {
        append: withCtx(() => [
          renderSlot(_ctx.$slots, "append-item", { option: __props.option })
        ]),
        _: 3
      }, 8, ["option", "selected-values"])) : (openBlock(), createBlock(_sfc_main$2, {
        key: 1,
        group: __props.option,
        "selected-values": __props.selectedValues
      }, {
        "append-item": withCtx(({ option: optionItem }) => [
          renderSlot(_ctx.$slots, "append-item", { option: optionItem })
        ]),
        _: 3
      }, 8, ["group", "selected-values"]));
    };
  }
});
export {
  _sfc_main as default
};
