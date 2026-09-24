import { defineComponent, ref, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, createVNode, toDisplayString, createBlock, withCtx, createTextVNode, createCommentVNode } from "vue";
import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import { cn } from "../../../lib/cn.js";
import _sfc_main$1 from "../actions/button/DigiButton.vue.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$2 from "../actions/icons/DigiIconButton.vue.js";
const _hoisted_1 = { class: "flex flex-1 items-center gap-2" };
const _hoisted_2 = { class: "flex-1 wrap-anywhere" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiToast",
  props: {
    class: {},
    text: {},
    variant: { default: "info" },
    copyable: { type: Boolean }
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const isCopied = ref(0);
    const defaultTexts = useReadonlyDefaultTexts();
    const toastStyle = cva(
      "border-border bg-background flex w-fit max-w-4xl min-w-80 items-center gap-2 rounded-md border p-2 pl-4 shadow-lg",
      {
        variants: {
          variant: {
            success: "bg-success text-success-foreground",
            destructive: "bg-destructive text-destructive-foreground",
            info: "border-border",
            warning: "bg-warning text-warning-foreground"
          }
        }
      }
    );
    const icon = {
      success: "checkbox-circle-line",
      destructive: "error-warning-line",
      info: "information-line",
      warning: "alert-line"
    };
    const closeIconStyle = {
      success: "text-success-foreground",
      destructive: "text-destructive-foreground",
      info: "text-foreground",
      warning: "text-warning-foreground"
    };
    function copyTextToClipboard(text) {
      isCopied.value += 1;
      setTimeout(() => {
        isCopied.value -= 1;
      }, 2e3);
      navigator.clipboard.writeText(text);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(cn)(unref(toastStyle)({ variant: __props.variant }), props.class))
      }, [
        createElementVNode("div", _hoisted_1, [
          createVNode(DigiRemixIcon, {
            name: icon[__props.variant],
            size: "lg"
          }, null, 8, ["name"]),
          createElementVNode("span", _hoisted_2, toDisplayString(__props.text), 1)
        ]),
        __props.copyable ? (openBlock(), createBlock(unref(_sfc_main$1), {
          key: 0,
          "icon-name": isCopied.value ? "check-line" : "file-copy-line",
          variant: "secondary",
          size: "sm",
          onClick: _cache[0] || (_cache[0] = ($event) => copyTextToClipboard(__props.text))
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(isCopied.value ? unref(defaultTexts).copiedToClipboard : unref(defaultTexts).copyToClipboardCta), 1)
          ]),
          _: 1
        }, 8, ["icon-name"])) : createCommentVNode("", true),
        createVNode(unref(_sfc_main$2), {
          "icon-name": "close-line",
          tooltip: unref(defaultTexts).closeTooltip,
          size: "sm",
          class: "bg-transparent!",
          "icon-class": closeIconStyle[__props.variant],
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
        }, null, 8, ["tooltip", "icon-class"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
