import { defineComponent, ref, openBlock, createElementBlock, createBlock, unref, createCommentVNode, withDirectives, createElementVNode, normalizeStyle, vShow } from "vue";
import DigiSpinner from "../spinner/DigiSpinner.vue.js";
const _hoisted_1 = {
  key: 0,
  class: "flex h-full w-full flex-col items-center justify-center"
};
const _hoisted_2 = ["src", "scrolling", "referrerpolicy"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiIframe",
  props: {
    iframeUrl: {},
    width: {},
    aspectRatio: {},
    scrollable: { type: Boolean },
    referrerPolicy: {}
  },
  setup(__props) {
    const iframeLoaded = ref(false);
    return (_ctx, _cache) => {
      return __props.iframeUrl ? (openBlock(), createElementBlock("div", _hoisted_1, [
        !iframeLoaded.value ? (openBlock(), createBlock(unref(DigiSpinner), { key: 0 })) : createCommentVNode("", true),
        withDirectives(createElementVNode("iframe", {
          src: __props.iframeUrl,
          scrolling: __props.scrollable ? "yes" : "no",
          class: "grow border-none",
          allowfullscreen: "",
          style: normalizeStyle({
            width: __props.width || "100%",
            aspectRatio: __props.aspectRatio || "16 / 9"
          }),
          referrerpolicy: __props.referrerPolicy,
          onLoad: _cache[0] || (_cache[0] = ($event) => iframeLoaded.value = true)
        }, null, 44, _hoisted_2), [
          [vShow, iframeLoaded.value]
        ])
      ])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
