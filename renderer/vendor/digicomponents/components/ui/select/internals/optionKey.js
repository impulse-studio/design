import { provide, inject } from "vue";
function createOptionKeyGetter() {
  let counter = 0;
  const ids = /* @__PURE__ */ new WeakMap();
  function assignReferenceId(item) {
    let id = ids.get(item);
    if (id === void 0) {
      counter += 1;
      id = `option-${counter}`;
      ids.set(item, id);
    }
    return id;
  }
  return (item) => {
    if (item.kind === "group") {
      return item.renderKey;
    }
    return assignReferenceId(item);
  };
}
const OPTION_KEY_INJECTION_KEY = /* @__PURE__ */ Symbol(
  "DigiSearchSelectOptionKey"
);
function provideOptionKey() {
  const getKey = createOptionKeyGetter();
  provide(OPTION_KEY_INJECTION_KEY, getKey);
  return getKey;
}
function useOptionKey() {
  const getKey = inject(OPTION_KEY_INJECTION_KEY);
  if (getKey === void 0) {
    throw new Error(
      "useOptionKey() must be used inside a <DigiSearchSelect>: no key getter was provided."
    );
  }
  return getKey;
}
export {
  provideOptionKey,
  useOptionKey
};
