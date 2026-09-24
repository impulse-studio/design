import { defineComponent, openBlock, createBlock, withCtx, createVNode, createElementVNode, createCommentVNode, toDisplayString, renderSlot, normalizeClass, unref } from "vue";
import "vuedraggable";
/* empty css                               */
import _sfc_main$3 from "../../sortable/DigiSortableHandle.vue.js";
import { cn } from "../../../../lib/cn.js";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "../internals/BaseCard.vue.js";
import _sfc_main$4 from "../internals/CardContent.vue.js";
import _sfc_main$2 from "../internals/CardHeader.vue.js";
const _hoisted_1 = { class: "flex items-center gap-2" };
const _hoisted_2 = { class: "py-2 leading-none font-bold tracking-tight" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDashboardCard",
  props: {
    title: {},
    iconName: {},
    draggable: { type: Boolean },
    padding: { type: Boolean, default: true },
    actionsVisible: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { class: "group flex h-full flex-col" }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, { class: "bg-off-white/30 flex flex-row items-center justify-between px-4 py-1" }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                  key: 0,
                  name: __props.iconName,
                  size: "md"
                }, null, 8, ["name"])) : createCommentVNode("", true),
                createElementVNode("h3", _hoisted_2, toDisplayString(__props.title), 1),
                renderSlot(_ctx.$slots, "title-append")
              ]),
              createElementVNode("div", {
                class: normalizeClass(
                  unref(cn)("flex", {
                    "opacity-0 transition-opacity duration-200 group-hover:opacity-100": !__props.actionsVisible
                  })
                )
              }, [
                renderSlot(_ctx.$slots, "actions"),
                __props.draggable ? (openBlock(), createBlock(unref(_sfc_main$3), { key: 0 }, {
                  default: withCtx(() => [
                    createVNode(DigiRemixIcon, {
                      name: "draggable",
                      size: "md",
                      class: "cursor-grab"
                    })
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ], 2)
            ]),
            _: 3
          }),
          createVNode(_sfc_main$4, {
            class: normalizeClass(unref(cn)("flex-1 overflow-auto", props.padding ? "p-4" : "p-0"))
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["class"])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};
