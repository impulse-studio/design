import { readonly, toRef, inject } from "vue";
import { GLOBAL_CONFIG_KEY } from "./configSymbol.js";
function useConfig() {
  const config = inject(GLOBAL_CONFIG_KEY);
  if (!config) {
    throw new Error("Config not provided");
  }
  return config;
}
function useReadonlyConfig() {
  const config = useConfig();
  return readonly(config);
}
function useReadonlyDefaultTexts() {
  const config = useConfig();
  return readonly(toRef(() => config.value.defaultTexts));
}
export {
  useReadonlyConfig,
  useReadonlyDefaultTexts
};
