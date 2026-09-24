import { defineComponent, useCssVars, ref, computed, openBlock, createElementBlock, createElementVNode, toDisplayString, createBlock, unref } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "text-to-copy text-sm opacity-75" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiClipboard",
  props: {
    textToCopy: {},
    fullWidth: { type: Boolean }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "v11e3bb3e": textWidth.value
    }));
    const props = __props;
    const isCopied = ref(false);
    const title = computed(() => "copy : " + props.textToCopy);
    const textWidth = computed(() => {
      return props.fullWidth ? null : "25ch";
    });
    async function copyText() {
      await navigator.clipboard.writeText(props.textToCopy);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 3500);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "copy-text",
        title: title.value,
        onClick: copyText
      }, [
        createElementVNode("div", _hoisted_2, toDisplayString(__props.textToCopy), 1),
        isCopied.value ? (openBlock(), createBlock(unref(DigiRemixIcon), {
          key: 0,
          name: "check-line",
          size: "sm"
        })) : (openBlock(), createBlock(unref(DigiRemixIcon), {
          key: 1,
          name: "file-copy-line",
          size: "sm"
        }))
      ], 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
