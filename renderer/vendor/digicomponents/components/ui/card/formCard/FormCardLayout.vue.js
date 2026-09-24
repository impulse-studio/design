import { defineComponent, computed, openBlock, createBlock, createSlots, withCtx, renderSlot, createVNode } from "vue";
import { parseDigiLabelFormat } from "../../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$2 from "../CardRowsContainer.vue.js";
import _sfc_main$1 from "../DigiCardLayout1.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormCardLayout",
  props: {
    title: {},
    description: {},
    helpLink: {},
    iconName: {},
    smallSpacing: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const parsedTitle = computed(() => {
      return parseDigiLabelFormat(props.title);
    });
    const computedTitle = computed(() => {
      return parsedTitle.value.label;
    });
    const computedDescription = computed(() => {
      return props.description || parsedTitle.value.description;
    });
    const computedHelpLink = computed(() => {
      return props.helpLink || parsedTitle.value.helpLink;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, {
        title: computedTitle.value,
        description: computedDescription.value ?? void 0,
        "help-link": computedHelpLink.value ?? void 0,
        "icon-name": props.iconName
      }, createSlots({ _: 2 }, [
        _ctx.$slots.actions ? {
          name: "actions",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "actions")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.default ? {
          name: "default",
          fn: withCtx(() => [
            createVNode(_sfc_main$2, {
              "small-spacing": props.smallSpacing
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["small-spacing"])
          ]),
          key: "1"
        } : void 0,
        _ctx.$slots.footer ? {
          name: "footer",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "footer")
          ]),
          key: "2"
        } : void 0
      ]), 1032, ["title", "description", "help-link", "icon-name"]);
    };
  }
});
export {
  _sfc_main as default
};
