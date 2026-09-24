import { defineComponent, openBlock, createBlock, withCtx, createVNode, renderSlot, unref, normalizeClass, createTextVNode, toDisplayString } from "vue";
import _sfc_main$3 from "../../actions/button/DigiButton.vue.js";
/* empty css                            */
import DigiDropdownMenuContent from "../basics/DigiDropdownMenuContent.vue2.js";
import _sfc_main$2 from "../basics/DigiDropdownMenuTrigger.vue2.js";
import _sfc_main$1 from "../DigiDropdownMenu.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiBasicDropdownMenu",
  props: {
    triggerText: {},
    triggerVariant: { default: "primary" },
    triggerSize: {},
    triggerIconName: {},
    disabled: { type: Boolean },
    menuSide: {},
    class: {}
  },
  emits: ["update:open"],
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:open", $event))
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, { disabled: __props.disabled }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "trigger", {}, () => [
                createVNode(unref(_sfc_main$3), {
                  variant: __props.triggerVariant,
                  size: __props.triggerSize,
                  "icon-name": __props.triggerIconName,
                  disabled: __props.disabled,
                  class: normalizeClass(props.class)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.triggerText), 1)
                  ]),
                  _: 1
                }, 8, ["variant", "size", "icon-name", "disabled", "class"])
              ])
            ]),
            _: 3
          }, 8, ["disabled"]),
          createVNode(DigiDropdownMenuContent, {
            side: __props.menuSide,
            "collision-padding": 10
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["side"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
