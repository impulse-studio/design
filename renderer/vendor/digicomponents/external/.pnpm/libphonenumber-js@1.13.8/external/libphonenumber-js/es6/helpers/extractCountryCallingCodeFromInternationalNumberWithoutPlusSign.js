import Metadata, { getCountryCallingCode } from "../metadata.js";
import matchesEntirely from "./matchesEntirely.js";
import extractNationalNumber from "./extractNationalNumber.js";
import checkNumberLength from "./checkNumberLength.js";
function extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, defaultCountry, defaultCallingCode, metadataJson) {
  if (!(defaultCountry || defaultCallingCode)) {
    return {
      number
    };
  }
  var countryCallingCode = defaultCountry ? getCountryCallingCode(defaultCountry, metadataJson) : defaultCallingCode;
  if (number.indexOf(countryCallingCode) === 0) {
    var metadata = new Metadata(metadataJson);
    metadata.selectNumberingPlan(defaultCountry || defaultCallingCode);
    var possibleShorterNumber = number.slice(countryCallingCode.length);
    var _extractNationalNumbe = extractNationalNumber(possibleShorterNumber, void 0, metadata), possibleShorterNationalNumber = _extractNationalNumbe.nationalNumber;
    var _extractNationalNumbe2 = extractNationalNumber(number, void 0, metadata), nationalNumber = _extractNationalNumbe2.nationalNumber;
    if (!matchesEntirely(nationalNumber, metadata.nationalNumberPattern()) && matchesEntirely(possibleShorterNationalNumber, metadata.nationalNumberPattern()) || checkNumberLength(nationalNumber, void 0, metadata) === "TOO_LONG") {
      return {
        countryCallingCode,
        number: possibleShorterNumber
      };
    }
  }
  return {
    number
  };
}
export {
  extractCountryCallingCodeFromInternationalNumberWithoutPlusSign as default
};
