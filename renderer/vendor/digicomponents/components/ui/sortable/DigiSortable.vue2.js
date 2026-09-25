import { defineComponent, useModel, ref, openBlock, createBlock, unref, withCtx, renderSlot, createVNode, normalizeClass, mergeModels } from "vue";
import { Slot } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Primitive/Slot.js";
import Draggable from "vuedraggable";
import { provideSortableConfig } from "./consts.js";
const DEFAULT_CAN_BE_PULLED_CLASS = "can-be-pull-of-the-root";
const DEFAULT_HANDLE_CLASS = "handle";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiSortable",
  props: /* @__PURE__ */ mergeModels({
    itemKey: {},
    disabled: { type: Boolean },
    groupName: { default: "sortable" },
    spaced: { type: Boolean, default: true },
    canAcceptItems: { type: Boolean, default: true }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update", "start", "end"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const elements = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const state = provideSortableConfig(
      ref({
        handleClass: DEFAULT_HANDLE_CLASS,
        canBePulledClass: DEFAULT_CAN_BE_PULLED_CLASS
      })
    );
    function canBePullOfTheList(_from, _to, element) {
      return element.classList.contains(DEFAULT_CAN_BE_PULLED_CLASS) || !!element.children.item(0)?.classList.contains(DEFAULT_CAN_BE_PULLED_CLASS);
    }
    function canAcceptNewItems(to, from) {
      if (from === to) {
        return true;
      }
      if (!props.canAcceptItems) {
        return false;
      }
      return from?.options?.group?.name === props.groupName;
    }
    function handleUpdate() {
      emit("update", elements.value);
    }
    function handleStart() {
      state.value.isDragging = true;
      emit("start");
    }
    function handleEnd() {
      state.value.isDragging = false;
      emit("end");
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Draggable), {
        modelValue: elements.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => elements.value = $event),
        "item-key": __props.itemKey,
        group: {
          name: __props.groupName,
          pull: canBePullOfTheList,
          put: canAcceptNewItems
        },
        animation: 200,
        handle: `.${DEFAULT_HANDLE_CLASS}`,
        disabled: __props.disabled,
        easing: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        class: "sortable",
        onChange: handleUpdate,
        onStart: handleStart,
        onEnd: handleEnd
      }, {
        item: withCtx(({ element, index }) => [
          createVNode(unref(Slot), {
            class: normalizeClass({ "mb-2": __props.spaced })
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "item", {
                element,
                index
              }, void 0, true)
            ]),
            _: 2
          }, 1032, ["class"])
        ]),
        footer: withCtx(() => [
          renderSlot(_ctx.$slots, "footer", {}, void 0, true)
        ]),
        _: 3
      }, 8, ["modelValue", "item-key", "group", "handle", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
