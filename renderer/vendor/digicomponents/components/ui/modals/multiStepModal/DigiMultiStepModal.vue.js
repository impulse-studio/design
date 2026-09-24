import { defineComponent, ref, watchEffect, useTemplateRef, computed, openBlock, createBlock, withCtx, createVNode, createElementBlock, Fragment, renderList, KeepAlive, resolveDynamicComponent, createCommentVNode } from "vue";
import _sfc_main$3 from "../../stepper/DigiStepper.vue.js";
import _sfc_main$1 from "../DigiBaseModal.vue.js";
import _sfc_main$2 from "../internals/DigiModalFullHeader.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiMultiStepModal",
  props: {
    title: {},
    description: {},
    size: {},
    builder: {},
    input: {}
  },
  emits: ["submit", "hide"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentStepIndex = ref(-1);
    const stepInputs = ref([props.input]);
    watchEffect(() => {
      stepInputs.value[0] = props.input;
    });
    const modal = useTemplateRef("modalRef");
    const steps = computed(() => props.builder.build());
    function next(data) {
      let nextStepIndex = currentStepIndex.value + 1;
      stepInputs.value[nextStepIndex] = data;
      while (nextStepIndex < steps.value.length) {
        const step = steps.value[nextStepIndex];
        const skipResult = step.skipStep?.({ input: data });
        if (skipResult?.skip) {
          nextStepIndex += 1;
          stepInputs.value[nextStepIndex] = skipResult.next;
          data = skipResult.next;
        } else {
          break;
        }
      }
      if (nextStepIndex >= steps.value.length) {
        emit("submit", data);
        close();
        return;
      }
      currentStepIndex.value = nextStepIndex;
    }
    function back() {
      let previousStepIndex = currentStepIndex.value - 1;
      while (previousStepIndex >= 0) {
        const step = steps.value[previousStepIndex];
        const skipResult = step.skipStep?.({
          input: stepInputs.value[previousStepIndex]
        });
        if (skipResult?.skip) {
          previousStepIndex -= 1;
        } else {
          break;
        }
      }
      if (previousStepIndex < 0) {
        close();
        return;
      }
      currentStepIndex.value = previousStepIndex;
    }
    function open() {
      modal.value?.open();
      next(props.input);
    }
    function close() {
      modal.value?.close();
    }
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref: "modalRef",
        scrollable: "",
        class: "gap-0",
        size: props.size,
        onHide: _cache[1] || (_cache[1] = ($event) => emit("hide"))
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, {
            title: props.title,
            description: props.description,
            class: "p-6"
          }, null, 8, ["title", "description"]),
          createVNode(_sfc_main$3, {
            modelValue: currentStepIndex.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currentStepIndex.value = $event),
            steps: steps.value.map((step) => step.stepperProps),
            class: "px-6"
          }, null, 8, ["modelValue", "steps"]),
          (openBlock(true), createElementBlock(Fragment, null, renderList(steps.value.length, (i) => {
            return openBlock(), createBlock(KeepAlive, { key: i }, [
              i - 1 === currentStepIndex.value ? (openBlock(), createBlock(resolveDynamicComponent(steps.value[i - 1].component), {
                key: 0,
                next,
                back,
                input: stepInputs.value[i - 1]
              }, null, 8, ["input"])) : createCommentVNode("", true)
            ], 1024);
          }), 128))
        ]),
        _: 1
      }, 8, ["size"]);
    };
  }
});
export {
  _sfc_main as default
};
