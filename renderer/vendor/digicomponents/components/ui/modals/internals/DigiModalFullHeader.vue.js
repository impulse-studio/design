import { defineComponent, computed, openBlock, createBlock, withCtx, createVNode, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { parseDigiLabelFormat } from "../../../../lib/parseSlug/parseDigiLabelFormat.js";
import _sfc_main$3 from "./DigiModalDescription.vue2.js";
import _sfc_main$1 from "./DigiModalHeader.vue.js";
import _sfc_main$2 from "./DigiModalTitle.vue2.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiModalFullHeader",
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    const props = __props;
    const parsedLabel = computed(() => {
      return parseDigiLabelFormat(props.title);
    });
    const computedTitle = computed(() => parsedLabel.value.label);
    const computedDescription = computed(
      () => props.description || parsedLabel.value.description || ""
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, null, {
        default: withCtx(() => [
          createVNode(_sfc_main$2, null, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(computedTitle.value), 1)
            ]),
            _: 1
          }),
          computedDescription.value ? (openBlock(), createBlock(_sfc_main$3, { key: 0 }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(computedDescription.value), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
