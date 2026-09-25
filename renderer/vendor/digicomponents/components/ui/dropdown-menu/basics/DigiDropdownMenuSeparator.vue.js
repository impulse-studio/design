import { defineComponent, computed, openBlock, createBlock, unref, mergeProps } from "vue";
import { DropdownMenuSeparator_default } from "../../../../external/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/external/reka-ui/dist/DropdownMenu/DropdownMenuSeparator.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiDropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(DropdownMenuSeparator_default), mergeProps(delegatedProps.value, {
        class: unref(cn)("bg-muted -mx-1 my-1 h-px", props.class)
      }), null, 16, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
