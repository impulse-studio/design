import Metadata from "../metadata.js";
import { VALID_DIGITS } from "../constants.js";
var CAPTURING_DIGIT_PATTERN = /* @__PURE__ */ new RegExp("([" + VALID_DIGITS + "])");
function stripIddPrefix(number, country, callingCode, metadataJson) {
  if (!country) {
    return;
  }
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(country || callingCode);
  var IDDPrefixPattern = new RegExp(metadata.IDDPrefix());
  if (number.search(IDDPrefixPattern) !== 0) {
    return;
  }
  number = number.slice(number.match(IDDPrefixPattern)[0].length);
  var matchedGroups = number.match(CAPTURING_DIGIT_PATTERN);
  if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
    if (matchedGroups[1] === "0") {
      return;
    }
  }
  return number;
}
export {
  stripIddPrefix as default
};
