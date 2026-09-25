import { defineComponent, useModel, computed, openBlock, createBlock, unref, normalizeClass, withCtx, createElementVNode, createVNode, mergeModels } from "vue";
import { CheckboxRoot_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Checkbox/CheckboxRoot.js";
import { CheckboxIndicator_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Checkbox/CheckboxIndicator.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../lib/cn.js";
const _hoisted_1 = { class: "flex h-full w-full items-center justify-center text-current" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCheckbox",
  props: /* @__PURE__ */ mergeModels({
    disabled: { type: Boolean },
    class: {},
    id: {}
  }, {
    "modelValue": /* @__PURE__ */ (() => ({ type: Boolean, ...{ required: true } }))(),
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const checked = useModel(__props, "modelValue");
    const props = __props;
    const asBoolean = computed({
      get() {
        return checked.value;
      },
      set(value) {
        if (typeof value === "string" && value === "indeterminate") {
          checked.value = false;
        }
        checked.value = value;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CheckboxRoot_default), {
        id: props.id,
        modelValue: asBoolean.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => asBoolean.value = $event),
        disabled: __props.disabled,
        class: normalizeClass(
          unref(cn)(
            "peer border-off-black ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-border h-4 w-4 shrink-0 rounded-sm border align-middle focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-black",
            props.class
          )
        )
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(CheckboxIndicator_default), { "as-child": "" }, {
              default: withCtx(() => [
                createVNode(DigiRemixIcon, {
                  name: "check-line",
                  size: "xs",
                  class: "fixed-icon"
                })
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["id", "modelValue", "disabled", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
