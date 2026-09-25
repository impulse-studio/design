import { defineComponent, useModel, openBlock, createBlock, unref, mergeProps, withCtx, createElementBlock, Fragment, renderList, createCommentVNode, createVNode, normalizeClass, createElementVNode, createTextVNode, toDisplayString, mergeModels } from "vue";
import { StepperRoot_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Stepper/StepperRoot.js";
import { cn } from "../../../lib/cn.js";
/* empty css                         */
/* empty css                          */
import _sfc_main$4 from "../actions/icons/DigiIconButton.vue.js";
import _sfc_main$6 from "./internals/StepperDescription.vue.js";
import _sfc_main$1 from "./internals/StepperItem.vue.js";
import _sfc_main$2 from "./internals/StepperSeparator.vue.js";
import _sfc_main$5 from "./internals/StepperTitle.vue.js";
import _sfc_main$3 from "./internals/StepperTrigger.vue.js";
import { reactiveOmit } from "../../../external/.pnpm/@vueuse_shared@14.2.1_vue@3.5.28_typescript@5.9.3_/external/@vueuse/shared/dist/index.js";
const _hoisted_1 = { class: "mt-1 flex flex-col items-center text-center" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiStepper",
  props: /* @__PURE__ */ mergeModels({
    defaultValue: {},
    orientation: {},
    dir: {},
    linear: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    steps: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const delegatedProps = reactiveOmit(props, ["class", "steps"]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(StepperRoot_default), mergeProps({
        "model-value": model.value,
        class: unref(cn)("flex max-w-full gap-2", props.class)
      }, unref(delegatedProps), {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event ?? 0)
      }), {
        default: withCtx(({ modelValue }) => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.steps, (step, i) => {
            return openBlock(), createBlock(_sfc_main$1, {
              key: i,
              disabled: modelValue !== void 0 && modelValue < i,
              class: "relative flex w-full flex-col items-center justify-center",
              step: i
            }, {
              default: withCtx(({ state }) => [
                i !== __props.steps.length - 1 ? (openBlock(), createBlock(_sfc_main$2, {
                  key: 0,
                  class: "bg-muted absolute top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] block h-0.5 shrink-0 rounded-full"
                })) : createCommentVNode("", true),
                createVNode(_sfc_main$3, { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$4), {
                      "icon-name": state === "completed" ? "check-line" : step.iconName ?? "circle-line",
                      tooltip: "",
                      class: normalizeClass(["z-10 shrink-0 rounded-full border transition-all", [
                        state !== "inactive" && "bg-background ring-ring ring-offset-background ring-2",
                        state === "inactive" && "cursor-default"
                      ]]),
                      size: "lg"
                    }, null, 8, ["icon-name", "class"])
                  ]),
                  _: 2
                }, 1024),
                createElementVNode("div", _hoisted_1, [
                  createVNode(_sfc_main$5, {
                    class: normalizeClass(["text-sm font-semibold transition", [
                      state === "inactive" && "text-muted-foreground",
                      state === "active" && "font-bold"
                    ]])
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(step.title), 1)
                    ]),
                    _: 2
                  }, 1032, ["class"]),
                  step.description ? (openBlock(), createBlock(_sfc_main$6, {
                    key: 0,
                    class: "text-muted-foreground text-xs transition lg:text-sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(step.description), 1)
                    ]),
                    _: 2
                  }, 1024)) : createCommentVNode("", true)
                ])
              ]),
              _: 2
            }, 1032, ["disabled", "step"]);
          }), 128))
        ]),
        _: 1
      }, 16, ["model-value", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
