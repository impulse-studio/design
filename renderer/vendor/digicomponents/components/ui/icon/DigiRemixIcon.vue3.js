import { defineComponent, openBlock, createElementBlock, normalizeClass } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRemixIcon",
  props: {
    name: {},
    size: { default: "1x" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("i", {
        class: normalizeClass(["remix-icon", [`ri-${__props.name}`, `ri-${__props.size}`]]),
        onClick: _cache[0] || (_cache[0] = ($event) => emits("click", $event))
      }, null, 2);
    };
  }
});
export {
  _sfc_main as default
};
