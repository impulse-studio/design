import { defineComponent, openBlock, createBlock, unref, withCtx, renderSlot } from "vue";
import _sfc_main$1 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaginationButton",
  props: {
    iconName: {},
    disabled: { type: Boolean },
    variant: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        class: "h-8 w-8 p-0",
        size: "icon",
        variant: __props.variant || "ghost",
        "icon-name": __props.iconName,
        disabled: __props.disabled
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["variant", "icon-name", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
