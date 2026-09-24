import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, Fragment, renderList, renderSlot, toDisplayString, createCommentVNode } from "vue";
import { injectFormFieldContext } from "../form/injectionKeys.js";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = {
  key: 0,
  class: "grid w-full gap-1"
};
const _hoisted_2 = {
  key: 0,
  class: "font-weight-bold"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiItemsSelectionPreview",
  props: {
    items: {},
    max: { default: 5 },
    canAdd: { type: Boolean, default: true },
    buttonTop: { type: Boolean, default: false },
    itemLabel: {}
  },
  setup(__props) {
    const props = __props;
    const computedItemLabel = computed(() => {
      return props.itemLabel.toLowerCase();
    });
    const displayedItems = computed(() => {
      return props.items.slice(0, props.max);
    });
    const hiddenItemsCount = computed(() => {
      const rest = props.items.length - props.max;
      return rest > 0 ? rest : void 0;
    });
    const context = injectFormFieldContext("card");
    const classes = computed(() => {
      return {
        "flex-col-reverse": props.buttonTop,
        "items-start": context === "modal"
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["", unref(cn)("flex w-full flex-col items-start gap-2", classes.value)])
      }, [
        displayedItems.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(displayedItems.value, (item, i) => {
            return renderSlot(_ctx.$slots, "default", {
              key: i,
              item
            });
          }), 128)),
          hiddenItemsCount.value ? (openBlock(), createElementBlock("p", _hoisted_2, " + " + toDisplayString(hiddenItemsCount.value) + " " + toDisplayString(computedItemLabel.value), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        __props.canAdd ? renderSlot(_ctx.$slots, "footer", { key: 1 }) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
