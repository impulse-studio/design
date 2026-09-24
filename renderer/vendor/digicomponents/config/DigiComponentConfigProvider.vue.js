import { defineComponent, toRefs, provide, renderSlot } from "vue";
import { GLOBAL_CONFIG_KEY } from "./configSymbol.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiComponentConfigProvider",
  props: {
    config: {}
  },
  setup(__props) {
    const props = __props;
    const { config } = toRefs(props);
    provide(GLOBAL_CONFIG_KEY, config);
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
});
export {
  _sfc_main as default
};
