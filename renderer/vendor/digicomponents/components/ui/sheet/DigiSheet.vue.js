import { defineComponent, ref, openBlock, createBlock, unref, withCtx, createVNode, createElementVNode, createCommentVNode, createTextVNode, toDisplayString, renderSlot } from "vue";
import { DialogRoot_default } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Dialog/DialogRoot.js";
import _sfc_main$1 from "./internals/SheetContent.vue.js";
import _sfc_main$2 from "./internals/SheetHeader.vue.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$4 from "./internals/SheetDescription.vue.js";
import _sfc_main$3 from "./internals/SheetTitle.vue.js";
const _hoisted_1 = { class: "inline" };
const _hoisted_2 = { class: "flex-1 overflow-y-auto px-6 py-3" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSheet",
  props: {
    title: {},
    description: {},
    iconName: {}
  },
  setup(__props, { expose: __expose }) {
    const isOpen = ref(false);
    function close() {
      isOpen.value = false;
    }
    __expose({
      open: () => {
        isOpen.value = true;
      },
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DialogRoot_default), {
        open: isOpen.value,
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => isOpen.value = $event)
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$1, {
            class: "flex flex-col",
            onClose: close
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, { class: "px-6 py-3" }, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_1, [
                    __props.iconName ? (openBlock(), createBlock(unref(DigiRemixIcon), {
                      key: 0,
                      name: __props.iconName,
                      class: "mr-2 inline",
                      size: "lg"
                    }, null, 8, ["name"])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, { class: "inline" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_sfc_main$4, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.description), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createElementVNode("div", _hoisted_2, [
                renderSlot(_ctx.$slots, "default")
              ])
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["open"]);
    };
  }
});
export {
  _sfc_main as default
};
