import { defineComponent, openBlock, createBlock, unref, withCtx, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { useReadonlyDefaultTexts } from "../../../../config/composables.js";
/* empty css                            */
/* empty css                             */
import _sfc_main$1 from "../../actions/link/DigiLink.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormHelpLink",
  props: {
    helpLink: {}
  },
  setup(__props) {
    const defaultTexts = useReadonlyDefaultTexts();
    return (_ctx, _cache) => {
      return __props.helpLink ? (openBlock(), createBlock(unref(_sfc_main$1), {
        key: 0,
        variant: "link",
        size: "sm",
        href: __props.helpLink,
        "icon-name": "question-line",
        class: "text-blue inline"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(unref(defaultTexts).helpText), 1)
        ]),
        _: 1
      }, 8, ["href"])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
