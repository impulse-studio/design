import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, unref, createVNode } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
import { cn } from "../../../../lib/cn.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GettingStartedTaskIndicator",
  props: {
    status: {},
    iconName: {}
  },
  setup(__props) {
    const fallbackIconNames = {
      done: "check-line",
      ready: "arrow-right-line",
      later: "time-line"
    };
    const displayedIconName = computed(() => {
      if (__props.status === "done") {
        return fallbackIconNames.done;
      }
      return __props.iconName ?? fallbackIconNames[__props.status];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(
          unref(cn)(
            "flex size-6 shrink-0 items-center justify-center rounded-full",
            __props.status === "done" && "bg-success text-success-foreground",
            __props.status === "ready" && "border-primary ring-primary/20 text-primary border-2 ring-4",
            __props.status === "later" && "text-muted-foreground border border-dashed"
          )
        )
      }, [
        createVNode(unref(DigiRemixIcon), {
          name: displayedIconName.value,
          size: "sm"
        }, null, 8, ["name"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
