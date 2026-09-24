import { defineComponent, defineAsyncComponent, openBlock, createBlock, unref, withCtx, createElementBlock, Fragment, renderList, renderSlot } from "vue";
/* empty css                            */
import _sfc_main$1 from "./command/CommandGroup.vue.js";
import { useOptionKey } from "./optionKey.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SelectGroup",
  props: {
    group: {},
    selectedValues: {}
  },
  setup(__props) {
    const getKey = useOptionKey();
    const SelectItem = defineAsyncComponent(() => import("./SelectItem.vue2.js"));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        heading: __props.group.label,
        "icon-name": __props.group.iconName
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.group.options, (option) => {
            return openBlock(), createBlock(unref(SelectItem), {
              key: unref(getKey)(option),
              option,
              "selected-values": __props.selectedValues
            }, {
              append: withCtx(() => [
                renderSlot(_ctx.$slots, "append-item", { option })
              ]),
              _: 2
            }, 1032, ["option", "selected-values"]);
          }), 128))
        ]),
        _: 3
      }, 8, ["heading", "icon-name"]);
    };
  }
});
export {
  _sfc_main as default
};
