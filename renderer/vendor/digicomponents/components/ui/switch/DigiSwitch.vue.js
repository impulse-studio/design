import { defineComponent, useModel, computed, openBlock, createElementBlock, normalizeClass, unref, createVNode, withCtx, renderSlot, createElementVNode, toDisplayString, mergeModels } from "vue";
import { SwitchRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Switch/SwitchRoot.js";
import { SwitchThumb_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Switch/SwitchThumb.js";
import { cn } from "../../../lib/cn.js";
import { switchVariants } from "./variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSwitch",
  props: /* @__PURE__ */ mergeModels({
    size: {},
    disabled: { type: Boolean },
    class: {},
    id: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const checked = useModel(__props, "modelValue");
    const props = __props;
    const modelForSwitch = computed({
      get() {
        return checked.value ?? null;
      },
      set(value) {
        checked.value = value ?? false;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)("flex items-center gap-1.5", props.class))
      }, [
        createVNode(unref(SwitchRoot_default), {
          id: props.id,
          modelValue: modelForSwitch.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelForSwitch.value = $event),
          disabled: __props.disabled,
          class: normalizeClass(unref(switchVariants)({ size: __props.size }))
        }, {
          default: withCtx(() => [
            createVNode(unref(SwitchThumb_default), {
              class: normalizeClass(
                unref(cn)(
                  "bg-background pointer-events-none block aspect-square h-full rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-full"
                )
              )
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "thumb")
              ]),
              _: 3
            }, 8, ["class"])
          ]),
          _: 3
        }, 8, ["id", "modelValue", "disabled", "class"]),
        createElementVNode("span", {
          class: normalizeClass(
            unref(cn)(
              "min-w-[3ch] text-sm font-medium",
              (!checked.value || __props.disabled) && "text-muted-foreground"
            )
          )
        }, toDisplayString(checked.value ? "ON" : "OFF"), 3)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
