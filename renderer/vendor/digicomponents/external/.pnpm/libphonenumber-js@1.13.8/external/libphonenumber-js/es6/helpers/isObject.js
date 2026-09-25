var objectConstructor = /* @__PURE__ */ (() => ({}).constructor)();
function isObject(object) {
  return object !== void 0 && object !== null && object.constructor === objectConstructor;
}
export {
  isObject as default
};
