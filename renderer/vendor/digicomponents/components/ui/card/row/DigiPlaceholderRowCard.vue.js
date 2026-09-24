import { defineComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, createElementVNode, renderSlot, createCommentVNode } from "vue";
import DigiRowCardActions from "./internals/DigiRowCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiRowCardContainer.vue.js";
import _sfc_main$2 from "./internals/DigiRowLeftPartContainer.vue.js";
const _hoisted_1 = { class: "max-w-full overflow-hidden text-ellipsis" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPlaceholderRowCard",
  props: {
    size: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, mergeProps(props, { class: "bg-muted text-muted-foreground border-dashed" }), {
        default: withCtx(() => [
          createVNode(_sfc_main$2, { "icon-name": __props.iconName }, {
            title: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                renderSlot(_ctx.$slots, "default")
              ])
            ]),
            _: 3
          }, 8, ["icon-name"]),
          _ctx.$slots.actions ? (openBlock(), createBlock(DigiRowCardActions, { key: 0 }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "actions")
            ]),
            _: 3
          })) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};
