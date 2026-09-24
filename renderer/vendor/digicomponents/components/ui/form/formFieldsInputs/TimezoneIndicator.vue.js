import { defineComponent, computed, openBlock, createElementBlock, toDisplayString, unref, createCommentVNode } from "vue";
import { useReadonlyConfig } from "../../../../config/composables.js";
const _hoisted_1 = {
  key: 0,
  class: "mt-1 ml-auto w-fit text-xs text-gray-400"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimezoneIndicator",
  props: {
    localTimezone: {}
  },
  setup(__props) {
    const props = __props;
    const config = useReadonlyConfig();
    const currentTimezone = computed(() => {
      return config.value.dateConfig.timezone;
    });
    const shouldDisplay = computed(
      () => props.localTimezone !== currentTimezone.value
    );
    return (_ctx, _cache) => {
      return shouldDisplay.value ? (openBlock(), createElementBlock("div", _hoisted_1, toDisplayString(unref(config).defaultTexts.timezoneIndicatorContent(__props.localTimezone)), 1)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
