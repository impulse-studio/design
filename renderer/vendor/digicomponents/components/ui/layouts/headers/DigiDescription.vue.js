import { defineComponent, openBlock, createElementBlock, toDisplayString } from "vue";
const _hoisted_1 = { class: "text-muted-foreground block" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDescription",
  props: {
    description: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(__props.description), 1);
    };
  }
});
export {
  _sfc_main as default
};
