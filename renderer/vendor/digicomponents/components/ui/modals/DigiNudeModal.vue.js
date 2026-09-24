import { defineComponent, useTemplateRef, openBlock, createBlock, withCtx, createVNode, unref, renderSlot, createCommentVNode } from "vue";
import _sfc_main$1 from "./DigiBaseModal.vue.js";
import _sfc_main$4 from "./internals/DigiModalFooter.vue.js";
/* empty css                         */
import _sfc_main$3 from "./internals/DigiModalScrollArea.vue.js";
import _sfc_main$2 from "./internals/DigiModalFullHeader.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiNudeModal",
  props: {
    title: {},
    description: {},
    size: {},
    scrollable: { type: Boolean, default: true }
  },
  emits: ["hide"],
  setup(__props, { expose: __expose }) {
    const modal = useTemplateRef("modal");
    function open() {
      modal.value?.open();
    }
    function close() {
      modal.value?.close();
    }
    __expose({ open, close });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        ref_key: "modal",
        ref: modal,
        size: __props.size,
        onHide: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("hide"))
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, {
            title: __props.title,
            description: __props.description
          }, null, 8, ["title", "description"]),
          __props.scrollable && _ctx.$slots.default ? (openBlock(), createBlock(unref(_sfc_main$3), { key: 0 }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          })) : renderSlot(_ctx.$slots, "default", { key: 1 }),
          _ctx.$slots.footer ? (openBlock(), createBlock(unref(_sfc_main$4), { key: 2 }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "footer")
            ]),
            _: 3
          })) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["size"]);
    };
  }
});
export {
  _sfc_main as default
};
