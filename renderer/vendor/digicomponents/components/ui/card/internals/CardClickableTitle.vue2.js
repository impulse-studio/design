import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, createVNode } from "vue";
import { Primitive } from "../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/Primitive.js";
import _sfc_main$4 from "../../actions/button/DigiButton.vue.js";
import _sfc_main$1 from "../../actions/link/DigiLink.vue.js";
import _sfc_main$3 from "../../actions/router-link/DigiRouterLink.vue.js";
/* empty css                            */
import _sfc_main$2 from "../row/internals/DigiRowCardTitle.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardClickableTitle",
  props: {
    name: {},
    disabled: { type: Boolean }
  },
  emits: ["titleClick"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        "as-child": "",
        class: normalizeClass(__props.disabled && "opacity-60")
      }, {
        default: withCtx(() => [
          __props.name.kind === "link" && "href" in __props.name ? (openBlock(), createBlock(unref(_sfc_main$1), {
            key: 0,
            href: __props.name.href,
            class: "min-w-0 shrink-[0.8]",
            variant: "link"
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                title: __props.name.name
              }, null, 8, ["title"])
            ]),
            _: 1
          }, 8, ["href"])) : __props.name.kind === "link" && "to" in __props.name ? (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            to: __props.name.to,
            class: "min-w-0 shrink-[0.8]",
            variant: "link"
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                title: __props.name.name
              }, null, 8, ["title"])
            ]),
            _: 1
          }, 8, ["to"])) : __props.name.kind === "text" ? (openBlock(), createBlock(_sfc_main$2, {
            key: 2,
            title: __props.name.name
          }, null, 8, ["title"])) : (openBlock(), createBlock(unref(_sfc_main$4), {
            key: 3,
            variant: "link",
            onClick: _cache[0] || (_cache[0] = ($event) => emits("titleClick"))
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                title: __props.name.name
              }, null, 8, ["title"])
            ]),
            _: 1
          }))
        ]),
        _: 1
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
