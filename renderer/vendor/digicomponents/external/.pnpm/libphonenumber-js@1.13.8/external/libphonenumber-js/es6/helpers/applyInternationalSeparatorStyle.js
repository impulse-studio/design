import { VALID_PUNCTUATION } from "../constants.js";
function applyInternationalSeparatorStyle(formattedNumber) {
  return formattedNumber.replace(new RegExp("[".concat(VALID_PUNCTUATION, "]+"), "g"), " ").trim();
}
export {
  applyInternationalSeparatorStyle as default
};
