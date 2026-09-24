import { defineComponent, openBlock, createElementBlock, normalizeClass, Fragment, createTextVNode, toDisplayString } from "vue";
const _hoisted_1 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiAvatar",
  props: {
    src: {},
    text: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["flex aspect-square w-10 items-center justify-center overflow-hidden rounded-[50%]", { "bg-[#6c757d] text-white": !__props.src }])
      }, [
        __props.src ? (openBlock(), createElementBlock("img", {
          key: 0,
          class: "object-cover",
          src: __props.src
        }, null, 8, _hoisted_1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode(toDisplayString(__props.text), 1)
        ], 64))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
