function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0;
}
function requiredValidator(value) {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
    return false;
  }
  return !!String(value).trim().length;
}
export {
  requiredValidator
};
