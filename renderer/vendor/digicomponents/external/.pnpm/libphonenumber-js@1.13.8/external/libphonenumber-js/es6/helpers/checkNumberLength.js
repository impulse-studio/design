import Metadata from "../metadata.js";
function checkNumberLength(nationalNumber, country, metadata) {
  return checkNumberLengthForType(nationalNumber, void 0, country, metadata);
}
function checkNumberLengthForType(nationalNumber, type, country, metadata) {
  if (country) {
    metadata = new Metadata(metadata.metadata);
    metadata.selectNumberingPlan(country);
  }
  var type_info = metadata.type(type);
  var possible_lengths = type_info && type_info.possibleLengths() || metadata.possibleLengths();
  if (!possible_lengths) {
    return "IS_POSSIBLE";
  }
  var actual_length = nationalNumber.length;
  var minimum_length = possible_lengths[0];
  if (minimum_length === actual_length) {
    return "IS_POSSIBLE";
  }
  if (minimum_length > actual_length) {
    return "TOO_SHORT";
  }
  if (possible_lengths[possible_lengths.length - 1] < actual_length) {
    return "TOO_LONG";
  }
  return possible_lengths.indexOf(actual_length, 1) >= 0 ? "IS_POSSIBLE" : "INVALID_LENGTH";
}
export {
  checkNumberLengthForType,
  checkNumberLength as default
};
