import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { z } from "zod";
let componentsUsingQueryParams = 0;
function useQueryParams(schema, defaults) {
  function getInitialParams() {
    const queryParams = parseQueryParams(window.location.search, schema);
    if (Object.keys(queryParams).length === 0 && defaults) {
      return defaults;
    }
    return queryParams;
  }
  const params = ref(getInitialParams());
  watch(params, setQueryParams, {
    deep: true
  });
  onMounted(() => {
    if (++componentsUsingQueryParams > 1) {
      throw new Error(
        "Multiple components are using useQueryParams, which can lead to unexpected behavior. Please ensure only one component uses useQueryParams at a time."
      );
    }
  });
  onBeforeUnmount(() => {
    componentsUsingQueryParams--;
  });
  return { params };
}
function zQueryArray(options) {
  if (!options) {
    return z.array(z.string()).or(z.string().transform((value) => [value])).optional();
  }
  return z.array(z.enum(options)).or(z.enum(options).transform((value) => [value])).optional();
}
const zQueryBoolean = /* @__PURE__ */ z.enum(["true", "false"]).transform((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return void 0;
}).optional();
function setQueryParams(newParams) {
  const urlSearchParams = new URLSearchParams();
  addQueryParams(urlSearchParams, newParams);
  const newQueryString = urlSearchParams.toString();
  const newUrl = window.location.pathname + (newQueryString ? `?${newQueryString}` : "");
  window.history.replaceState(null, "", newUrl);
}
function addQueryParams(urlSearchParams, newParams, prefix = "") {
  for (const [key, value] of Object.entries(newParams)) {
    if (value === void 0) continue;
    const paramKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        urlSearchParams.append(paramKey, String(item));
      });
    } else if (typeof value === "object" && value !== null) {
      if (value instanceof Date) {
        urlSearchParams.append(paramKey, value.toISOString());
      } else {
        addQueryParams(urlSearchParams, value, paramKey);
      }
    } else {
      urlSearchParams.append(paramKey, String(value));
    }
  }
}
function parseQueryParams(queryString, schema) {
  const paramsObject = deserializeQueryParams(queryString);
  const result = schema.safeParse(paramsObject);
  if (!result.success) {
    console.error("Failed to parse query parameters", result.error);
    return {};
  }
  return result.data;
}
function deserializeQueryParams(queryString) {
  const paramsObject = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams.entries()) {
    const keys = key.split("[").map((k) => k.replace("]", ""));
    const lastKey = keys.pop();
    if (!lastKey) {
      continue;
    }
    let currentLevel = paramsObject;
    for (const nestedKey of keys) {
      if (!currentLevel[nestedKey]) {
        currentLevel[nestedKey] = {};
      }
      if (typeof currentLevel[nestedKey] !== "object" || currentLevel[nestedKey] === null) {
        console.error(
          `Conflict in query parameter keys: ${nestedKey} is not an object`
        );
        return {};
      }
      currentLevel = currentLevel[nestedKey];
    }
    const existingValue = currentLevel[lastKey];
    if (existingValue === void 0) {
      currentLevel[lastKey] = value;
      continue;
    }
    currentLevel[lastKey] = Array.isArray(existingValue) ? [...existingValue, value] : [existingValue, value];
  }
  return paramsObject;
}
export {
  addQueryParams,
  parseQueryParams,
  useQueryParams,
  zQueryArray,
  zQueryBoolean
};
