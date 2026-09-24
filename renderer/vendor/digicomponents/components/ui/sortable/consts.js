import { inject, readonly, ref, provide } from "vue";
const sortableStateKey = /* @__PURE__ */ Symbol();
function provideSortableConfig(classes, app) {
  const state = ref({ isDragging: false });
  {
    provide(sortableStateKey, { state, sortable: classes });
  }
  return state;
}
function useSortableConfig() {
  const state = inject(sortableStateKey);
  if (!state) {
    throw new Error("useSortableConfig must be used within a SortableProvider");
  }
  return {
    canBePulledClass: state.sortable.value.canBePulledClass,
    handleClass: state.sortable.value.handleClass,
    state: readonly(state.state)
  };
}
export {
  provideSortableConfig,
  useSortableConfig
};
