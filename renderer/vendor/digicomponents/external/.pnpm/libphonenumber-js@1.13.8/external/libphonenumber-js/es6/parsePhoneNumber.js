import normalizeArguments from "./normalizeArguments.js";
import parsePhoneNumber$1 from "./parsePhoneNumber_.js";
function parsePhoneNumber() {
  var _normalizeArguments = normalizeArguments(arguments), text = _normalizeArguments.text, options = _normalizeArguments.options, metadata = _normalizeArguments.metadata;
  return parsePhoneNumber$1(text, options, metadata);
}
export {
  parsePhoneNumber as default
};
