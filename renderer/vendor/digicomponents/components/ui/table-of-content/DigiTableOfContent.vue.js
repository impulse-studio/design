import { defineComponent, toRefs, ref, watch, computed, unref, withDirectives, openBlock, createElementBlock, normalizeStyle, createElementVNode, toDisplayString, Fragment, renderList, createVNode, withCtx, withModifiers, normalizeClass, vShow, createCommentVNode } from "vue";
import { useResizeObserver, useIntersectionObserver } from "../../../node_modules/.pnpm/@vueuse_core@14.2.1_vue@3.5.28_typescript@5.9.3_/node_modules/@vueuse/core/dist/index.js";
import { useReadonlyDefaultTexts } from "../../../config/composables.js";
import _sfc_main$1 from "../tooltip/DigiTextTooltip.vue.js";
import { useTableOfContentLinkContext } from "./utils.js";
const _hoisted_1 = { class: "text-off-black mb-1 text-sm font-bold uppercase" };
const _hoisted_2 = { class: "flex flex-col gap-1" };
const _hoisted_3 = ["href", "title", "onMouseenter", "onClick"];
const MIN_CONTAINER_WIDTH = 1400;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DigiTableOfContent",
  props: {
    cardsContainerRef: {},
    containerRef: {}
  },
  setup(__props) {
    const props = __props;
    const { cardsContainerRef, containerRef } = toRefs(props);
    const defaultTexts = useReadonlyDefaultTexts();
    const screenTopPosition = ref(0);
    function setScreenTopPosition(element) {
      let topOffset = element.getBoundingClientRect().top;
      let currentElement = element;
      while (currentElement && currentElement != document.documentElement) {
        currentElement = currentElement.parentElement;
        topOffset += currentElement?.scrollTop ?? 0;
      }
      screenTopPosition.value = topOffset + 20;
    }
    const isVisible = ref(false);
    useResizeObserver(containerRef, () => {
      if (containerRef.value) {
        isVisible.value = containerRef.value.offsetWidth >= MIN_CONTAINER_WIDTH;
        setScreenTopPosition(containerRef.value);
      }
    });
    const context = useTableOfContentLinkContext();
    watch(
      cardsContainerRef,
      (newVal) => {
        if (newVal) {
          setScreenTopPosition(newVal);
        }
      },
      {
        immediate: true
      }
    );
    function animateShadowIn(id) {
      if (!context) {
        return;
      }
      context.hoveredLinkId.value = id;
    }
    function animateShadowOut() {
      if (!context) {
        return;
      }
      context.hoveredLinkId.value = null;
    }
    const elementsToObserve = computed(() => {
      if (!context) {
        return [];
      }
      return context.links.value.map((link) => link.htmlElement);
    });
    const currentLinkToHighlight = ref(null);
    const entries = ref([]);
    useIntersectionObserver(
      elementsToObserve,
      (newEntries) => {
        if (entries.value.length === 0) {
          entries.value = newEntries;
        } else {
          entries.value = entries.value.map((entry) => {
            const newEntry = newEntries.find((e) => e.target === entry.target);
            return newEntry ?? entry;
          });
        }
        const intersectingEntries = entries.value.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (intersectingEntries.length > 0) {
          currentLinkToHighlight.value = intersectingEntries[0].target.id;
        }
      },
      {
        threshold: [0.5, 0.75, 1]
      }
    );
    function scrollToHash(htmlElement) {
      htmlElement.scrollIntoView({ behavior: "smooth" });
    }
    return (_ctx, _cache) => {
      return unref(context) && isVisible.value ? withDirectives((openBlock(), createElementBlock("div", {
        key: 0,
        class: "bg-off-white/30 fixed right-10 w-[200px] rounded-sm px-6 py-4",
        style: normalizeStyle({ top: `${screenTopPosition.value}px` })
      }, [
        createElementVNode("div", _hoisted_1, toDisplayString(unref(defaultTexts).tableOfContentTitle), 1),
        createElementVNode("ul", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(context).links.value, (link) => {
            return openBlock(), createElementBlock("li", {
              key: link.id
            }, [
              createVNode(unref(_sfc_main$1), {
                text: link.description,
                side: "left"
              }, {
                default: withCtx(() => [
                  createElementVNode("a", {
                    href: `#${link.id}`,
                    title: link.title,
                    class: normalizeClass(["block max-w-[200px] text-sm font-medium opacity-70 transition-opacity hover:opacity-100", { "text-primary": currentLinkToHighlight.value === link.id }]),
                    onMouseenter: ($event) => animateShadowIn(link.id),
                    onMouseleave: _cache[0] || (_cache[0] = ($event) => animateShadowOut()),
                    onClick: withModifiers(($event) => scrollToHash(link.htmlElement), ["prevent"])
                  }, toDisplayString(link.title), 43, _hoisted_3)
                ]),
                _: 2
              }, 1032, ["text"])
            ]);
          }), 128))
        ])
      ], 4)), [
        [vShow, unref(context).links.value.length > 2]
      ]) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
