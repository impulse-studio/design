import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTextPlaceholder",
  props: {
    size: { default: "1rem" },
    backgroundColor: {},
    width: {}
  },
  setup(__props) {
    const props = __props;
    const style = computed(() => {
      return {
        width: props.width,
        backgroundColor: props.backgroundColor,
        height: props.size
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "inline-block rounded-sm",
        style: normalizeStyle(style.value)
      }, null, 4);
    };
  }
});
export {
  _sfc_main as default
};
