import { defineComponent, ref, watch, openBlock, createBlock, unref, withCtx, createVNode, mergeProps, renderSlot } from "vue";
import _sfc_main$1 from "./internals/DigiModal.vue.js";
import _sfc_main$2 from "./internals/DigiModalContent.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiBaseModal",
  props: {
    scrollable: { type: Boolean },
    size: {},
    hideCloseButton: { type: Boolean }
  },
  emits: ["hide"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const isOpen = ref(false);
    function open() {
      isOpen.value = true;
    }
    function close() {
      isOpen.value = false;
    }
    watch(isOpen, () => {
      if (!isOpen.value) {
        emits("hide");
      }
    });
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        open: isOpen.value,
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => isOpen.value = $event)
      }, {
        default: withCtx(() => [
          createVNode(unref(_sfc_main$2), mergeProps({
            scrollable: __props.scrollable,
            size: __props.size,
            "hide-close-button": __props.hideCloseButton
          }, _ctx.$attrs), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["scrollable", "size", "hide-close-button"])
        ]),
        _: 3
      }, 8, ["open"]);
    };
  }
});
export {
  _sfc_main as default
};
