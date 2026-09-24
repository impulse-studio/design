import { defineComponent, useTemplateRef, ref, openBlock, createBlock, withCtx, createElementBlock, Fragment, createVNode, unref, createTextVNode, toDisplayString } from "vue";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import _sfc_main$4 from "../actions/button/DigiButton.vue.js";
/* empty css                         */
import _sfc_main$1 from "./DigiBaseModal.vue.js";
import _sfc_main$3 from "./internals/DigiModalFooter.vue.js";
import _sfc_main$2 from "./internals/DigiModalFullHeader.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiMessageModal",
  setup(__props, { expose: __expose }) {
    const modal = useTemplateRef("modal");
    const openProps = ref(null);
    const defaultTexts = useReadonlyDefaultTexts();
    function close() {
      modal.value?.close();
    }
    __expose({
      open: (props) => {
        openProps.value = props;
        modal.value?.open();
      },
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "modal",
        ref: modal
      }, {
        default: withCtx(() => [
          openProps.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createVNode(_sfc_main$2, {
              title: openProps.value.title,
              description: openProps.value.body
            }, null, 8, ["title", "description"]),
            createVNode(unref(_sfc_main$3), { class: "items-end" }, {
              default: withCtx(() => [
                createVNode(unref(_sfc_main$4), {
                  variant: openProps.value.variant ?? "secondary",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(openProps.value.okCta || unref(defaultTexts).confirmCta), 1)
                  ]),
                  _: 1
                }, 8, ["variant"])
              ]),
              _: 1
            })
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(" No content ")
          ], 64))
        ]),
        _: 1
      }, 512);
    };
  }
});
export {
  _sfc_main as default
};
