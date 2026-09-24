import { defineComponent, ref, openBlock, createElementBlock, createVNode, unref, createBlock } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCopyIconButton",
  props: {
    textToCopy: {}
  },
  setup(__props) {
    const props = __props;
    const isCopied = ref(false);
    const copyTimeoutId = ref();
    async function copyText() {
      await navigator.clipboard.writeText(props.textToCopy);
      isCopied.value = true;
      if (copyTimeoutId.value) {
        clearTimeout(copyTimeoutId.value);
      }
      copyTimeoutId.value = window.setTimeout(() => {
        isCopied.value = false;
      }, 3500);
    }
    return (_ctx, _cache) => {
      return !isCopied.value ? (openBlock(), createElementBlock("button", {
        key: 0,
        onClick: copyText
      }, [
        createVNode(unref(DigiRemixIcon), {
          name: "file-copy-line",
          size: "sm"
        })
      ])) : (openBlock(), createBlock(unref(DigiRemixIcon), {
        key: 1,
        name: "check-line",
        size: "sm"
      }));
    };
  }
});
export {
  _sfc_main as default
};
