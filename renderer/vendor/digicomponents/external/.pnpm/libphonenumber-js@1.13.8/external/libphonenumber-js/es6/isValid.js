import Metadata from "./metadata.js";
import matchesEntirely from "./helpers/matchesEntirely.js";
import getNumberType from "./helpers/getNumberType.js";
function isValidNumber(input, options, metadataJson) {
  options = options || {};
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(input.country || input.countryCallingCode);
  if (metadata.hasTypes()) {
    return getNumberType(input, options, metadata.metadata) !== void 0;
  }
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  return matchesEntirely(nationalNumber, metadata.nationalNumberPattern());
}
export {
  isValidNumber as default
};
