import { defineComponent, useModel, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, unref, createVNode, renderSlot, mergeModels } from "vue";
import { cn } from "../../../../lib/cn.js";
import _sfc_main$1 from "../../switch/DigiSwitch.vue.js";
const _hoisted_1 = { class: "flex-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiOptionalInput",
  props: /* @__PURE__ */ mergeModels({
    disabled: { type: Boolean },
    class: {}
  }, {
    "modelValue": { type: Boolean },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const enabled = useModel(__props, "modelValue");
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("div", {
          class: normalizeClass(unref(cn)("flex w-full", props.class))
        }, [
          createVNode(unref(_sfc_main$1), {
            modelValue: enabled.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
            size: "sm",
            disabled: __props.disabled,
            class: normalizeClass(
              unref(cn)(
                "rounded-l-md border border-r-0 px-3",
                (!enabled.value || __props.disabled) && "border-border/50"
              )
            )
          }, null, 8, ["modelValue", "disabled", "class"]),
          createElementVNode("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "default", {
              disabled: !enabled.value || __props.disabled
            }, void 0, true)
          ])
        ], 2),
        renderSlot(_ctx.$slots, "bottom", {}, void 0, true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
