import { defineComponent, openBlock, createBlock, normalizeProps, guardReactiveProps, withCtx, createVNode, renderSlot } from "vue";
import _sfc_main$3 from "../internals/CardClickableTitle.vue2.js";
import DigiRowCardActions from "./internals/DigiRowCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiRowCardContainer.vue.js";
import _sfc_main$2 from "./internals/DigiRowLeftPartContainer.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowClickableCard",
  props: {
    name: {},
    iconName: {},
    size: {},
    active: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["titleClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [
          createVNode(_sfc_main$2, {
            "icon-name": props.iconName
          }, {
            title: withCtx(() => [
              renderSlot(_ctx.$slots, "title-prepend"),
              createVNode(_sfc_main$3, {
                name: __props.name,
                disabled: props.disabled,
                onTitleClick: _cache[0] || (_cache[0] = ($event) => emits("titleClick"))
              }, null, 8, ["name", "disabled"])
            ]),
            "title-more-info": withCtx(() => [
              renderSlot(_ctx.$slots, "title-more-info")
            ]),
            "more-info": withCtx(() => [
              renderSlot(_ctx.$slots, "more-info")
            ]),
            _: 3
          }, 8, ["icon-name"]),
          createVNode(DigiRowCardActions, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "actions")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
