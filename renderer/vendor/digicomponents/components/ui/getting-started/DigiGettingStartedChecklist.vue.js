import { defineComponent, openBlock, createBlock, normalizeClass, unref, withCtx, createVNode, createElementVNode, toDisplayString, createTextVNode, createCommentVNode, createElementBlock, Fragment, renderList } from "vue";
import { cn } from "../../../lib/cn.js";
import _sfc_main$1 from "../card/internals/BaseCard.vue.js";
import _sfc_main$4 from "../card/internals/CardContent.vue.js";
import _sfc_main$3 from "../card/internals/CardDescription.vue.js";
import _sfc_main$2 from "../card/internals/CardHeader.vue.js";
import _sfc_main$5 from "./internals/GettingStartedTaskRow.vue.js";
const _hoisted_1 = { class: "leading-none font-bold tracking-tight" };
const _hoisted_2 = { class: "flex flex-col" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiGettingStartedChecklist",
  props: {
    title: {},
    tasks: {},
    description: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        class: normalizeClass(unref(cn)("flex flex-col", props.class))
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, { class: "flex flex-row items-center gap-3" }, {
            default: withCtx(() => [
              createElementVNode("div", null, [
                createElementVNode("h3", _hoisted_1, toDisplayString(__props.title), 1),
                __props.description ? (openBlock(), createBlock(_sfc_main$3, {
                  key: 0,
                  class: "mt-1"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.description), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ])
            ]),
            _: 1
          }),
          createVNode(_sfc_main$4, { class: "p-3" }, {
            default: withCtx(() => [
              createElementVNode("ul", _hoisted_2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tasks, (task, index) => {
                  return openBlock(), createBlock(_sfc_main$5, {
                    key: index,
                    task
                  }, null, 8, ["task"]);
                }), 128))
              ])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
