import { defineComponent, openBlock, createBlock, withCtx, createVNode, renderSlot, unref } from "vue";
import _sfc_main$2 from "../card/internals/BaseCard.vue.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "./DigiCollapsible.vue.js";
import _sfc_main$4 from "./DigiCollapsibleContent.vue.js";
import _sfc_main$3 from "./DigiCollapsibleTrigger.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiCardCollapsible",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, null, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, null, {
            default: withCtx(() => [
              createVNode(_sfc_main$3, { class: "flex w-full items-center justify-between p-4 font-medium transition-all [&[data-state=open]>i]:rotate-180" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "title"),
                  createVNode(unref(DigiRemixIcon), {
                    class: "text-[1.5rem]! transition-transform duration-200 ease-out",
                    name: "arrow-down-s-line"
                  })
                ]),
                _: 3
              }),
              createVNode(_sfc_main$4, { class: "-mt-2 px-4 pb-4" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "content")
                ]),
                _: 3
              })
            ]),
            _: 3
          })
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
