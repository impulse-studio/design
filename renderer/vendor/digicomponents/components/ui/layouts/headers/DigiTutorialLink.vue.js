import { defineComponent, openBlock, createBlock, unref, withCtx, createTextVNode, toDisplayString } from "vue";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
/* empty css                            */
/* empty css                             */
import _sfc_main$1 from "../../actions/link/DigiLink.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTutorialLink",
  props: {
    helpLink: {}
  },
  setup(__props) {
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), {
        variant: "secondary",
        "icon-name": "book-open-line",
        href: __props.helpLink
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(unref(defaultTexts).helpText), 1)
        ]),
        _: 1
      }, 8, ["href"]);
    };
  }
});
export {
  _sfc_main as default
};
