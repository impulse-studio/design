import { defineComponent, computed, openBlock, createElementBlock, Fragment, renderList, createBlock, unref, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import DigiRemixIcon from "../../icon/DigiRemixIcon.vue.js";
const _hoisted_1 = { class: "shrink-0" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiStarsRenderer",
  props: {
    value: {},
    maxStars: {}
  },
  setup(__props) {
    const props = __props;
    const fullStarCount = computed(() => {
      if (props.value === void 0) {
        return 0;
      }
      return Math.floor(props.value);
    });
    const emptyStarCount = computed(() => {
      if (props.value === void 0) {
        return 0;
      }
      return props.maxStars - Math.floor(props.value) - (props.value % 1 !== 0 ? 1 : 0);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(fullStarCount.value, (i) => {
          return openBlock(), createBlock(unref(DigiRemixIcon), {
            key: i,
            name: "star-fill"
          });
        }), 128)),
        __props.value && __props.value % 1 !== 0 ? (openBlock(), createBlock(unref(DigiRemixIcon), {
          key: 0,
          name: "star-half-fill"
        })) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(emptyStarCount.value, (i) => {
          return openBlock(), createBlock(unref(DigiRemixIcon), {
            key: i,
            name: "star-line"
          });
        }), 128)),
        createTextVNode(" " + toDisplayString(__props.value?.toFixed(1)), 1)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
