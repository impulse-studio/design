import { defineComponent, useCssVars, useModel, useTemplateRef, computed, ref, onMounted, nextTick, readonly, openBlock, createBlock, unref, mergeModels } from "vue";
import { useElementBounding } from "../../../../node_modules/.pnpm/@vueuse_core@14.2.1_vue@3.5.28_typescript@5.9.3_/node_modules/@vueuse/core/dist/index.js";
import { cva } from "../../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
import { VueTelInput as Ke } from "../../../../node_modules/.pnpm/vue-tel-input@9.6.0_libphonenumber-js@1.13.8_vue@3.5.28_typescript@5.9.3_/node_modules/vue-tel-input/dist/vue-tel-input.js";
/* empty css                                                                                                                                                         */
import { cn } from "../../../../lib/cn.js";
import { inputVariants } from "../variants.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiPhoneInput",
  props: /* @__PURE__ */ mergeModels({
    preferredCountries: {},
    defaultCountry: {},
    onlyCountries: {},
    placeholder: {},
    disabled: { type: Boolean },
    state: { type: [Boolean, null], default: void 0 }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["enter"], ["update:modelValue"]),
  setup(__props, { expose: __expose }) {
    useCssVars((_ctx) => ({
      "v2b892fb1": dropdownPositionHorizontal.value,
      "e8987958": dropdownPositionLower.value,
      "e79a1e16": dropdownPositionUpper.value
    }));
    const model = useModel(__props, "modelValue");
    const props = __props;
    const input = useTemplateRef("inputRef");
    const inputPosition = useElementBounding(
      () => input.value?.$el
    );
    const dropdownPositionHorizontal = computed(() => {
      return `${inputPosition.left.value}px`;
    });
    const dropdownPositionLower = computed(() => {
      return `${inputPosition.bottom.value}px`;
    });
    const dropdownPositionUpper = computed(() => {
      return `${window.innerHeight - inputPosition.top.value}px`;
    });
    const classes = computed(
      () => cn(
        inputVariants({ state: props.state }),
        variants({ state: props.state, disabled: props.disabled })
      )
    );
    const variants = cva("border-input! rounded-md! p-0 shadow-none!", {
      variants: {
        state: {
          true: "border-success!",
          false: "border-destructive!"
        },
        disabled: {
          true: "cursor-not-allowed"
        }
      }
    });
    const value = ref(model.value);
    const valid = ref(false);
    onMounted(() => {
      const initialValue = value.value;
      value.value = "invalid value";
      nextTick(() => {
        value.value = initialValue;
      });
    });
    function onInput(_, phone) {
      model.value = phone.number || "";
    }
    function onValidate(phone) {
      valid.value = phone.valid;
    }
    __expose({ valid: readonly(valid) });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Ke), {
        ref: "inputRef",
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
        "input-options": {
          placeholder: __props.placeholder,
          styleClasses: __props.disabled && "cursor-not-allowed!"
        },
        "style-classes": classes.value,
        "preferred-countries": __props.preferredCountries,
        "default-country": __props.defaultCountry,
        "only-countries": __props.onlyCountries,
        disabled: __props.disabled,
        onOnInput: onInput,
        onEnter: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("enter")),
        onValidate
      }, null, 8, ["modelValue", "input-options", "style-classes", "preferred-countries", "default-country", "only-countries", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
