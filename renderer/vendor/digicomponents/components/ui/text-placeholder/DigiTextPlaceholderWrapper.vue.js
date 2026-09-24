import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle, renderSlot } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextPlaceholderWrapper",
  props: {
    centered: { type: Boolean, default: true },
    direction: { default: "row" }
  },
  setup(__props) {
    const props = __props;
    const style = computed(() => {
      return {
        flexDirection: props.direction,
        flexWrap: props.direction === "row" ? "wrap" : "nowrap",
        justifyContent: props.centered ? "center" : "flex-start"
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "flex gap-2",
        style: normalizeStyle(style.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};
