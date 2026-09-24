import { defineComponent, computed, openBlock, createBlock, unref, mergeProps, withCtx, createCommentVNode, createTextVNode, toDisplayString, renderSlot } from "vue";
import { ComboboxGroup_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Combobox/ComboboxGroup.js";
import { ComboboxLabel_default } from "../../../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Combobox/ComboboxLabel.js";
import { cn } from "../../../../../lib/cn.js";
import DigiRemixIcon from "../../../icon/DigiRemixIcon.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CommandGroup",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {},
    heading: {},
    iconName: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ComboboxGroup_default), mergeProps(delegatedProps.value, {
        class: unref(cn)(
          "text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium",
          props.class
        )
      }), {
        default: withCtx(() => [
          __props.heading ? (openBlock(), createBlock(unref(ComboboxLabel_default), {
            key: 0,
            class: "text-muted-foreground px-2 py-1.5 text-sm font-medium"
          }, {
            default: withCtx(() => [
              __props.iconName ? (openBlock(), createBlock(DigiRemixIcon, {
                key: 0,
                name: __props.iconName,
                class: "mr-0.5"
              }, null, 8, ["name"])) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(__props.heading), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
