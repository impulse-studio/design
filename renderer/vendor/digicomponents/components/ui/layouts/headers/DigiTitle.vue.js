import { defineComponent, openBlock, createElementBlock, toDisplayString } from "vue";
const _hoisted_1 = { class: "text-xl font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTitle",
  props: {
    title: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("h2", _hoisted_1, toDisplayString(__props.title), 1);
    };
  }
});
export {
  _sfc_main as default
};
