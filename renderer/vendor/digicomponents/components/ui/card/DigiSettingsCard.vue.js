import { defineComponent, openBlock, createBlock, createSlots, withCtx, renderSlot, createElementVNode } from "vue";
import _sfc_main$1 from "./formCard/FormCardLayout.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSettingsCard",
  props: {
    title: {},
    description: {},
    helpLink: {},
    iconName: {},
    smallSpacing: { type: Boolean },
    hideContents: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        title: __props.title,
        description: __props.description,
        "help-link": __props.helpLink,
        "icon-name": __props.iconName,
        "small-spacing": __props.smallSpacing
      }, createSlots({
        actions: withCtx(() => [
          renderSlot(_ctx.$slots, "actions")
        ]),
        footer: withCtx(() => [
          renderSlot(_ctx.$slots, "footer")
        ]),
        _: 2
      }, [
        !__props.hideContents && _ctx.$slots.default ? {
          name: "default",
          fn: withCtx(() => [
            createElementVNode("div", null, [
              renderSlot(_ctx.$slots, "default")
            ])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["title", "description", "help-link", "icon-name", "small-spacing"]);
    };
  }
});
export {
  _sfc_main as default
};
