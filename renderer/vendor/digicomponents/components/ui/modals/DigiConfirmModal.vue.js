import { defineComponent, useTemplateRef, ref, computed, openBlock, createBlock, withCtx, createVNode, unref, createTextVNode, toDisplayString, renderSlot, createCommentVNode } from "vue";
import { parseDigiLabelFormat } from "../../../lib/parseSlug/parseDigiLabelFormat.js";
import { useReadonlyDefaultTexts, useReadonlyConfig } from "../../../config/composables.js";
import _sfc_main$6 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import _sfc_main$1 from "./DigiBaseModal.vue.js";
import _sfc_main$4 from "./internals/DigiModalDescription.vue2.js";
import _sfc_main$5 from "./internals/DigiModalFooter.vue.js";
import _sfc_main$2 from "./internals/DigiModalHeader.vue.js";
import _sfc_main$3 from "./internals/DigiModalTitle.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiConfirmModal",
  props: {
    variant: { default: "destructive" },
    title: {},
    confirmBody: {},
    confirmCta: {},
    confirmIconName: {},
    cancelCta: {},
    action: {}
  },
  emits: ["cancel", "actionExecuted"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modal = useTemplateRef("modal");
    const errorMessage = ref(null);
    const isLoading = ref(false);
    const defaultTexts = useReadonlyDefaultTexts();
    const config = useReadonlyConfig();
    const parsedTitle = computed(() => parseDigiLabelFormat(props.title));
    const computedTitle = computed(() => parsedTitle.value.label);
    const computedConfirmBody = computed(
      () => props.confirmBody ?? parsedTitle.value.description
    );
    async function runAction() {
      isLoading.value = true;
      try {
        await props.action();
        modal.value?.close();
        emits("actionExecuted");
      } catch (error) {
        errorMessage.value = config.value.extractErrorMessage(error);
      } finally {
        isLoading.value = false;
      }
    }
    function cancel() {
      modal.value?.close();
      emits("cancel");
    }
    __expose({
      open: () => {
        errorMessage.value = null;
        modal.value?.open();
      },
      close: () => modal.value?.close()
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "modal",
        ref: modal
      }, {
        default: withCtx(() => [
          createVNode(unref(_sfc_main$2), null, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$3), null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(computedTitle.value), 1)
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$4), null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createTextVNode(toDisplayString(computedConfirmBody.value), 1)
                  ])
                ]),
                _: 3
              }),
              errorMessage.value ? (openBlock(), createBlock(unref(_sfc_main$4), {
                key: 0,
                class: "text-destructive"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(errorMessage.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ]),
            _: 3
          }),
          createVNode(unref(_sfc_main$5), null, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$6), {
                variant: "secondary",
                onClick: cancel
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.cancelCta || unref(defaultTexts).cancelCta), 1)
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$6), {
                variant: __props.variant,
                "is-loading": isLoading.value,
                "icon-name": __props.confirmIconName,
                onClick: runAction
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.confirmCta || unref(defaultTexts).confirmCta), 1)
                ]),
                _: 1
              }, 8, ["variant", "is-loading", "icon-name"])
            ]),
            _: 1
          })
        ]),
        _: 3
      }, 512);
    };
  }
});
export {
  _sfc_main as default
};
