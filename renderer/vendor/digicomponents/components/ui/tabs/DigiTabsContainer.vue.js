import { defineComponent, useModel, computed, watchEffect, openBlock, createBlock, unref, mergeProps, withCtx, createElementVNode, normalizeClass, createVNode, createElementBlock, Fragment, renderList, createSlots, createCommentVNode, createTextVNode, toDisplayString, renderSlot, mergeModels } from "vue";
import { TabsRoot_default } from "../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/Tabs/TabsRoot.js";
import DigiRemixIcon from "../icon/DigiRemixIcon.vue.js";
import _sfc_main$1 from "./internals/DigiTabsList.vue.js";
import _sfc_main$2 from "./internals/DigiTabsTrigger.vue.js";
const _hoisted_1 = { class: "grow" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTabsContainer",
  props: /* @__PURE__ */ mergeModels({
    activationMode: { default: "manual" },
    orientation: { default: "horizontal" },
    tabs: {},
    singleLine: { type: Boolean, default: false }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const delegatedProps = computed(() => {
      const { tabs, ...delegated } = props;
      return delegated;
    });
    watchEffect(() => {
      if (!model.value) {
        model.value = props.tabs[0].value;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TabsRoot_default), mergeProps(delegatedProps.value, {
        modelValue: model.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event)
      }), {
        default: withCtx(() => [
          createElementVNode("div", {
            class: normalizeClass({ "flex pr-3": __props.orientation === "vertical" })
          }, [
            createVNode(_sfc_main$1, {
              orientation: __props.orientation,
              "single-line": __props.singleLine
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tabs, (tab) => {
                  return openBlock(), createBlock(_sfc_main$2, {
                    key: tab.value,
                    value: tab.value,
                    disabled: tab.disabled,
                    orientation: __props.orientation
                  }, createSlots({
                    default: withCtx(() => [
                      tab.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                        key: 0,
                        name: tab.iconName
                      }, null, 8, ["name"])) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(tab.title) + " ", 1)
                    ]),
                    _: 2
                  }, [
                    _ctx.$slots.append ? {
                      name: "append",
                      fn: withCtx(() => [
                        renderSlot(_ctx.$slots, "append", { tab })
                      ]),
                      key: "0"
                    } : void 0
                  ]), 1032, ["value", "disabled", "orientation"]);
                }), 128))
              ]),
              _: 3
            }, 8, ["orientation", "single-line"]),
            createElementVNode("div", _hoisted_1, [
              renderSlot(_ctx.$slots, "default", { currentTab: model.value })
            ])
          ], 2)
        ]),
        _: 3
      }, 16, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};
