import { defineComponent, openBlock, createBlock, withCtx, createElementVNode, createVNode, unref, normalizeClass, renderSlot, toDisplayString, createCommentVNode } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import "vuedraggable";
import { useSortableConfig } from "../../sortable/consts.js";
/* empty css                               */
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
/* empty css                             */
import _sfc_main$2 from "../../actions/icons/DigiIconButton.vue.js";
import DigiGroupCardActions from "./internals/DigiGroupCardActions.vue.js";
import _sfc_main$1 from "./internals/DigiGroupCardContainer.vue.js";
import DigiGroupTopPartContainer from "./internals/DigiGroupTopPartContainer.vue.js";
const _hoisted_1 = { class: "flex items-center" };
const _hoisted_2 = { class: "leading-none" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiGroupDraggableCard",
  props: {
    disabled: { type: Boolean, default: false },
    name: {},
    enableDrag: { type: Boolean, default: true },
    size: {},
    editable: { type: Boolean, default: true }
  },
  emits: ["edit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { handleClass } = useSortableConfig();
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        disabled: __props.disabled,
        size: __props.size
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(DigiRemixIcon), {
              name: "draggable",
              class: normalizeClass(["text-off-black mr-3 ml-1", { [unref(handleClass)]: __props.enableDrag, "cursor-grab": __props.enableDrag }]),
              size: "lg"
            }, null, 8, ["class"]),
            createVNode(DigiGroupTopPartContainer, null, {
              title: withCtx(() => [
                renderSlot(_ctx.$slots, "title-prepend"),
                createElementVNode("div", _hoisted_2, toDisplayString(__props.name), 1),
                props.editable ? (openBlock(), createBlock(unref(_sfc_main$2), {
                  key: 0,
                  tooltip: unref(defaultTexts).edit,
                  variant: "primary",
                  "icon-name": "pencil-line",
                  size: "sm",
                  disabled: __props.disabled,
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("edit"))
                }, null, 8, ["tooltip", "disabled"])) : createCommentVNode("", true)
              ]),
              "title-more-info": withCtx(() => [
                renderSlot(_ctx.$slots, "title-more-info")
              ]),
              "middle-zone": withCtx(() => [
                renderSlot(_ctx.$slots, "header-middle-zone")
              ]),
              actions: withCtx(() => [
                createVNode(DigiGroupCardActions, null, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "actions")
                  ]),
                  _: 3
                })
              ]),
              _: 3
            })
          ]),
          renderSlot(_ctx.$slots, "body")
        ]),
        _: 3
      }, 8, ["disabled", "size"]);
    };
  }
});
export {
  _sfc_main as default
};
