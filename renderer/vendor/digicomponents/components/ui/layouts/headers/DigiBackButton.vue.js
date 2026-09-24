import { defineComponent, openBlock, createBlock, unref, mergeProps, withCtx, createTextVNode, toDisplayString } from "vue";
import { useRouter } from "vue-router";
import _sfc_main$2 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
import _sfc_main$1 from "../../actions/router-link/DigiRouterLink.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiBackButton",
  props: {
    to: {},
    text: {}
  },
  setup(__props) {
    const router = useRouter();
    return (_ctx, _cache) => {
      return __props.to ? (openBlock(), createBlock(unref(_sfc_main$1), mergeProps({ key: 0 }, _ctx.$attrs, {
        class: "mb-2",
        to: __props.to,
        variant: "link",
        "icon-name": "arrow-left-line"
      }), {
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.text), 1)
        ]),
        _: 1
      }, 16, ["to"])) : (openBlock(), createBlock(_sfc_main$2, mergeProps({ key: 1 }, _ctx.$attrs, {
        class: "mb-2",
        variant: "link",
        "icon-name": "arrow-left-line",
        onClick: _cache[0] || (_cache[0] = ($event) => unref(router).back())
      }), {
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.text), 1)
        ]),
        _: 1
      }, 16));
    };
  }
});
export {
  _sfc_main as default
};
