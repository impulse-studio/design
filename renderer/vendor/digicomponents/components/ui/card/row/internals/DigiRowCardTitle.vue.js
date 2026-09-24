import { defineComponent, ref, useTemplateRef, watchEffect, onUnmounted, computed, openBlock, createBlock, unref, withCtx, createElementVNode, toDisplayString } from "vue";
import _sfc_main$1 from "../../../tooltip/DigiTextTooltip.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiRowCardTitle",
  props: {
    title: {}
  },
  setup(__props) {
    const props = __props;
    const showTooltip = ref(false);
    const fullWidthTitle = useTemplateRef("fullWithTitle");
    const titleContainer = useTemplateRef("titleContainer");
    function onResize() {
      showTooltip.value = fullWidthTitle.value && titleContainer.value ? fullWidthTitle.value?.offsetWidth > titleContainer.value?.offsetWidth : false;
    }
    const resizeObserver = new ResizeObserver(onResize);
    watchEffect(() => {
      if (fullWidthTitle.value) {
        resizeObserver.observe(fullWidthTitle.value);
      }
      if (titleContainer.value) {
        resizeObserver.observe(titleContainer.value);
      }
    });
    onUnmounted(() => {
      resizeObserver.disconnect();
    });
    const tooltip = computed(() => {
      if (showTooltip.value) {
        return props.title;
      }
      return void 0;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        text: tooltip.value,
        "trigger-as-child": ""
      }, {
        default: withCtx(() => [
          createElementVNode("span", {
            ref_key: "titleContainer",
            ref: titleContainer,
            class: "max-w-full overflow-hidden align-middle leading-[normal] text-ellipsis"
          }, [
            createElementVNode("span", { ref: "fullWithTitle" }, toDisplayString(__props.title), 513)
          ], 512)
        ]),
        _: 1
      }, 8, ["text"]);
    };
  }
});
export {
  _sfc_main as default
};
