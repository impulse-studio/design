import { defineComponent, openBlock, createBlock, normalizeClass, unref, withCtx, createElementVNode, createVNode, renderSlot } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import _sfc_main$2 from "../../tooltip/DigiTextTooltip.vue.js";
import "vuedraggable";
import { useSortableConfig } from "../../sortable/consts.js";
/* empty css                               */
import _sfc_main$4 from "../internals/CardClickableTitle.vue2.js";
import DigiRowCardActions from "./internals/DigiRowCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiRowCardContainer.vue.js";
import _sfc_main$3 from "./internals/DigiRowLeftPartContainer.vue.js";
const _hoisted_1 = { class: "flex min-w-0 items-center" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowDraggableCard",
  props: {
    name: {},
    size: {},
    active: { type: Boolean },
    disabled: { type: Boolean },
    enableDrag: { default: () => ({
      enabled: true
    }) },
    canBeGrouped: { type: Boolean }
  },
  emits: ["titleClick"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const { handleClass, canBePulledClass } = useSortableConfig();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        size: __props.size,
        active: __props.active,
        disabled: __props.disabled,
        class: normalizeClass({ [unref(canBePulledClass)]: __props.canBeGrouped })
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(_sfc_main$2), {
              text: __props.enableDrag.enabled ? void 0 : __props.enableDrag.tooltipText
            }, {
              default: withCtx(() => [
                createVNode(unref(DigiRemixIcon), {
                  name: "draggable",
                  class: normalizeClass(["text-off-black mr-3 ml-1", {
                    [unref(handleClass)]: __props.enableDrag.enabled,
                    "cursor-grab": __props.enableDrag.enabled
                  }]),
                  size: "lg"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["text"]),
            createVNode(_sfc_main$3, null, {
              title: withCtx(() => [
                renderSlot(_ctx.$slots, "title-prepend"),
                createVNode(_sfc_main$4, {
                  name: __props.name,
                  disabled: __props.disabled,
                  onTitleClick: _cache[0] || (_cache[0] = ($event) => emits("titleClick"))
                }, null, 8, ["name", "disabled"])
              ]),
              "title-more-info": withCtx(() => [
                renderSlot(_ctx.$slots, "title-more-info")
              ]),
              "more-info": withCtx(() => [
                renderSlot(_ctx.$slots, "more-info")
              ]),
              _: 3
            })
          ]),
          createVNode(DigiRowCardActions, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "actions")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["size", "active", "disabled", "class"]);
    };
  }
});
export {
  _sfc_main as default
};
