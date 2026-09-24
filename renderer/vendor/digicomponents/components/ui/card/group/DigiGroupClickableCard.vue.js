import { defineComponent, openBlock, createBlock, withCtx, createVNode, renderSlot } from "vue";
import _sfc_main$2 from "../internals/CardClickableTitle.vue2.js";
import DigiGroupCardActions from "./internals/DigiGroupCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiGroupCardContainer.vue.js";
import DigiGroupTopPartContainer from "./internals/DigiGroupTopPartContainer.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiGroupClickableCard",
  props: {
    disabled: { type: Boolean, default: false },
    name: {}
  },
  emits: ["titleClick"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { disabled: __props.disabled }, {
        default: withCtx(() => [
          createVNode(DigiGroupTopPartContainer, null, {
            title: withCtx(() => [
              createVNode(_sfc_main$2, {
                name: __props.name,
                disabled: __props.disabled,
                onTitleClick: _cache[0] || (_cache[0] = ($event) => emits("titleClick"))
              }, null, 8, ["name", "disabled"])
            ]),
            "title-more-info": withCtx(() => [
              renderSlot(_ctx.$slots, "title-more-info")
            ]),
            actions: withCtx(() => [
              createVNode(DigiGroupCardActions, null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "actions")
                ]),
                _: 3
              })
            ]),
            _: 3
          }),
          renderSlot(_ctx.$slots, "body")
        ]),
        _: 3
      }, 8, ["disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
