import { defineComponent, openBlock, createElementBlock, normalizeClass, unref, createBlock, createCommentVNode, createElementVNode, renderSlot } from "vue";
import { cn } from "../../../lib/cn.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "font-bold" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCardTitle",
  props: {
    class: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("h3", {
        class: normalizeClass(unref(cn)("text-lg leading-none tracking-tight", props.class))
      }, [
        __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
          key: 0,
          name: __props.iconName,
          class: "mr-1 opacity-50"
        }, null, 8, ["name"])) : createCommentVNode("", true),
        createElementVNode("span", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
