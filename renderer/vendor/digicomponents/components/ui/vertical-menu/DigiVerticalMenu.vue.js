import { defineComponent, ref, watchEffect, computed, openBlock, createElementBlock, createElementVNode, Fragment, renderSlot, createCommentVNode, renderList, createBlock, createVNode, withCtx } from "vue";
import _sfc_main$2 from "./DigiVerticalMenuSub.vue.js";
import _sfc_main$1 from "./DigiVerticalMenuTab.vue.js";
const _hoisted_1 = { class: "flex h-full flex-col justify-between" };
const _hoisted_2 = { class: "h-full" };
const _hoisted_3 = {
  key: 0,
  class: "px-6 py-3"
};
const _hoisted_4 = { class: "h-full overflow-y-auto" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiVerticalMenu",
  props: {
    items: {},
    initialOpenedSubKey: {}
  },
  emits: ["subMenuOpened", "subMenuClosed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const activeItemKey = ref(null);
    watchEffect(() => {
      if (props.initialOpenedSubKey) {
        activeItemKey.value = props.initialOpenedSubKey;
      }
    });
    const activeItem = computed(
      () => props.items.find((item) => item.key === activeItemKey.value)
    );
    function openSubMenu(key, disabled) {
      if (disabled === true || typeof disabled === "object") {
        return;
      }
      activeItemKey.value = key;
      emit("subMenuOpened", key);
    }
    function closeSubMenu() {
      emit("subMenuClosed");
      activeItemKey.value = null;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          !activeItem.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_3, [
              renderSlot(_ctx.$slots, "title")
            ])) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_4, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
                return renderSlot(_ctx.$slots, `tab(${item.key})`, {
                  openSubMenu: () => openSubMenu(item.key, item.disabled),
                  item
                }, () => [
                  (openBlock(), createBlock(_sfc_main$1, {
                    key: item.key,
                    title: item.label,
                    icon: item.icon,
                    disabled: item.disabled,
                    onClick: ($event) => openSubMenu(item.key, item.disabled)
                  }, null, 8, ["title", "icon", "disabled", "onClick"]))
                ]);
              }), 256))
            ])
          ], 64)) : renderSlot(_ctx.$slots, `sub(${activeItemKey.value})`, {
            key: 1,
            item: activeItem.value,
            closeSubMenu
          }, () => [
            createVNode(_sfc_main$2, {
              title: activeItem.value.label,
              onClose: closeSubMenu
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, `content(${activeItemKey.value})`)
              ]),
              _: 3
            }, 8, ["title"])
          ])
        ]),
        createElementVNode("div", null, [
          renderSlot(_ctx.$slots, "footer")
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
