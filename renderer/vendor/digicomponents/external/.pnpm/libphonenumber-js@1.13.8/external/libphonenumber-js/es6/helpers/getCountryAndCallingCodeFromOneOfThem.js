import Metadata from "../metadata.js";
import isCountryCode from "./isCountryCode.js";
function getCountryAndCallingCodeFromOneOfThem(countryOrCallingCode, metadataJson) {
  var country;
  var callingCode;
  var metadata = new Metadata(metadataJson);
  if (isCountryCode(countryOrCallingCode)) {
    country = countryOrCallingCode;
    metadata.selectNumberingPlan(country);
    callingCode = metadata.countryCallingCode();
  } else {
    callingCode = countryOrCallingCode;
  }
  return {
    country,
    callingCode
  };
}
export {
  getCountryAndCallingCodeFromOneOfThem as default
};
