import { defineComponent, useModel, useTemplateRef, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, renderSlot, createBlock, createCommentVNode, withDirectives, mergeProps, withKeys, vModelDynamic, mergeModels } from "vue";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../lib/cn.js";
import { inputVariants } from "./variants.js";
const _hoisted_1 = { class: "input-prepend border-input bg-muted text-muted-foreground flex items-center rounded-l-md border border-r-0 px-3 text-sm empty:hidden" };
const _hoisted_2 = ["disabled", "placeholder", "type", "accept", "max", "min", "step"];
const _hoisted_3 = {
  key: 0,
  class: "input-append border-input bg-muted text-muted-foreground flex items-center rounded-r-md border border-l-0 px-3 text-sm empty:hidden"
};
const _sfc_main = /* @__PURE__ */ defineComponent(/* @__PURE__ */ (() => ({
  ...{
    inheritAttrs: false
  },
  __name: "BaseInput",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    placeholder: {},
    disabled: { type: Boolean, default: false },
    state: { type: [Boolean, null], default: () => void 0 },
    iconName: {},
    min: {},
    max: {},
    step: {},
    accept: {},
    onChange: { type: Function },
    autocomplete: {},
    inputClass: {},
    class: {},
    type: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["blur", "onEnterPressed", "focusout", "change"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const emit = __emit;
    const input = useTemplateRef("input");
    __expose({
      setInputValue: (value2) => {
        if (input.value) {
          input.value.value = value2;
        }
      },
      focus: () => {
        input.value?.focus();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)("flex h-9 w-full", __props.class))
      }, [
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "prepend", {}, void 0, true)
        ]),
        createElementVNode("div", {
          class: normalizeClass(
            unref(cn)(
              unref(inputVariants)({ state: __props.state }),
              "input-wrapper relative flex-1",
              __props.inputClass
            )
          )
        }, [
          __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
            key: 0,
            name: __props.iconName,
            class: "mr-2 shrink-0"
          }, null, 8, ["name"])) : createCommentVNode("", true),
          withDirectives(createElementVNode("input", mergeProps({
            ref_key: "input",
            ref: input,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
            disabled: __props.disabled,
            placeholder: __props.placeholder,
            type: __props.type,
            accept: __props.accept
          }, _ctx.$attrs, {
            class: "h-full w-full bg-inherit py-2 outline-hidden disabled:cursor-not-allowed",
            max: __props.max,
            min: __props.min,
            step: __props.step,
            onBlur: _cache[1] || (_cache[1] = ($event) => emit("blur")),
            onKeydown: _cache[2] || (_cache[2] = withKeys(($event) => emit("onEnterPressed"), ["enter"])),
            onFocusout: _cache[3] || (_cache[3] = ($event) => emit("focusout")),
            onChange: _cache[4] || (_cache[4] = ($event) => emit("change", $event))
          }), null, 16, _hoisted_2), [
            [vModelDynamic, value.value]
          ])
        ], 2),
        _ctx.$slots.append ? (openBlock(), createElementBlock("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "append", {}, void 0, true)
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
}))());
export {
  _sfc_main as default
};
