import Metadata from "../metadata.js";
function getPossibleCountriesForNumber(callingCode, nationalNumber, metadata) {
  var _metadata = new Metadata(metadata);
  var possibleCountries = _metadata.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return [];
  }
  return possibleCountries.filter(function(country) {
    return couldNationalNumberBelongToCountry(nationalNumber, country, metadata);
  });
}
function couldNationalNumberBelongToCountry(nationalNumber, country, metadataJson) {
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(country);
  return metadata.numberingPlan.possibleLengths().indexOf(nationalNumber.length) >= 0;
}
export {
  getPossibleCountriesForNumber as default
};
