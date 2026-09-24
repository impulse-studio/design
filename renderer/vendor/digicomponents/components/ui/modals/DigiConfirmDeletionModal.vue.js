import { defineComponent, useTemplateRef, openBlock, createBlock, unref } from "vue";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import _sfc_main$1 from "./DigiConfirmModal.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiConfirmDeletionModal",
  props: {
    confirmBody: {},
    action: { type: Function }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const defaultTexts = useReadonlyDefaultTexts();
    const modal = useTemplateRef("modal");
    __expose({
      open: () => {
        modal.value?.open();
      },
      close: () => modal.value?.close()
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "modal",
        ref: modal,
        variant: "destructive",
        title: unref(defaultTexts).confirmDeletionModalTitle,
        "confirm-body": props.confirmBody,
        "confirm-cta": unref(defaultTexts).confirmDeletionModalCta,
        "confirm-icon-name": "delete-bin-line",
        action: props.action
      }, null, 8, ["title", "confirm-body", "confirm-cta", "action"]);
    };
  }
});
export {
  _sfc_main as default
};
