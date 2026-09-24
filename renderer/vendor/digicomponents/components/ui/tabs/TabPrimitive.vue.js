import { defineComponent, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot } from "vue";
import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
import { Slot } from "../../../node_modules/.pnpm/reka-ui@2.8.0_vue@3.5.28_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/Slot.js";
import { cn } from "../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TabPrimitive",
  props: {
    class: {},
    orientation: { default: "horizontal" }
  },
  setup(__props) {
    const tabVariants = cva(
      `border-border ring-offset-background focus-visible:ring-ring data-[state=active]:border-primary inline-flex translate-y-[1.5px] cursor-pointer items-center justify-center border-solid px-4 whitespace-nowrap text-black opacity-80 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold data-[state=active]:opacity-100`,
      {
        variants: {
          orientation: {
            horizontal: "after:bg-border data-[state=active]:after:bg-primary data-[state=active]:text-primary border-b-[3px] border-transparent pb-2 after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:w-full data-[state=active]:border-b-[3px]",
            vertical: "after:bg-border data-[state=active]:after:bg-primary data-[state=active]:text-primary justify-start border-r-[3px] border-transparent py-2 after:absolute after:top-0 after:right-[-3px] after:h-full after:w-[1px]"
          }
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Slot), {
        class: normalizeClass(unref(cn)(unref(tabVariants)({ orientation: __props.orientation }), __props.class))
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
