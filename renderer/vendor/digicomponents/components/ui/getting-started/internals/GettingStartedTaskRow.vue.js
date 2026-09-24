import { defineComponent, openBlock, createElementBlock, createVNode, createElementVNode, normalizeClass, unref, toDisplayString, createCommentVNode, createBlock } from "vue";
import { cn } from "../../../../lib/cn.js";
import _sfc_main$2 from "./GettingStartedTaskAction.vue.js";
import _sfc_main$1 from "./GettingStartedTaskIndicator.vue.js";
const _hoisted_1 = { class: "flex gap-3 rounded-md p-2" };
const _hoisted_2 = { class: "flex flex-1 flex-wrap items-center justify-between gap-2" };
const _hoisted_3 = { class: "min-w-0" };
const _hoisted_4 = {
  key: 0,
  class: "text-muted-foreground mt-1 text-sm leading-tight"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GettingStartedTaskRow",
  props: {
    task: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", _hoisted_1, [
        createVNode(_sfc_main$1, {
          status: __props.task.status,
          "icon-name": __props.task.iconName
        }, null, 8, ["status", "icon-name"]),
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            createElementVNode("p", {
              class: normalizeClass(
                unref(cn)(
                  "leading-tight",
                  __props.task.status === "ready" && "font-bold",
                  __props.task.status === "later" && "text-muted-foreground"
                )
              )
            }, toDisplayString(__props.task.title), 3),
            __props.task.description && __props.task.status !== "done" ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(__props.task.description), 1)) : createCommentVNode("", true)
          ]),
          __props.task.action && __props.task.status === "ready" ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            action: __props.task.action
          }, null, 8, ["action"])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
