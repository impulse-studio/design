import getCountryByNationalNumber from "./getCountryByNationalNumber.js";
function getCountryByCallingCode(callingCode, _ref) {
  var nationalNumber = _ref.nationalNumber, metadata = _ref.metadata;
  var possibleCountries = metadata.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return;
  }
  if (possibleCountries.length === 1) {
    return possibleCountries[0];
  }
  return getCountryByNationalNumber(nationalNumber, possibleCountries, metadata.metadata);
}
export {
  getCountryByCallingCode as default
};
