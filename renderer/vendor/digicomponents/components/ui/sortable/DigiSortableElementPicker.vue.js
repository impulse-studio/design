import { defineComponent, openBlock, createBlock, unref, withCtx, createElementVNode, renderSlot } from "vue";
import Draggable from "vuedraggable";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSortableElementPicker",
  props: {
    groupName: {},
    elements: {},
    clone: { type: Function },
    itemKey: { type: Function }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Draggable), {
        group: { name: __props.groupName, pull: "clone", put: false },
        "model-value": __props.elements,
        "item-key": __props.itemKey,
        clone: __props.clone,
        animation: 150,
        easing: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        sort: false
      }, {
        header: withCtx(() => [
          renderSlot(_ctx.$slots, "prepend")
        ]),
        item: withCtx(({ element }) => [
          createElementVNode("div", null, [
            renderSlot(_ctx.$slots, "item", { element })
          ])
        ]),
        _: 3
      }, 8, ["group", "model-value", "item-key", "clone"]);
    };
  }
});
export {
  _sfc_main as default
};
