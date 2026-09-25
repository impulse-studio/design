import Metadata from "../metadata.js";
import getNumberType from "./getNumberType.js";
function _createForOfIteratorHelperLoose(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? { done: true } : { done: false, value: r[o++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function getCountryByNationalNumber(nationalNumber, countries, metadataJson) {
  var metadata = new Metadata(metadataJson);
  for (var _iterator = _createForOfIteratorHelperLoose(countries), _step; !(_step = _iterator()).done; ) {
    var country = _step.value;
    metadata.selectNumberingPlan(country);
    if (metadata.leadingDigits()) {
      if (nationalNumber && nationalNumber.search(metadata.leadingDigits()) === 0) {
        return country;
      }
    } else if (getNumberType({
      phone: nationalNumber,
      country
    }, void 0, metadata.metadata)) {
      return country;
    }
  }
}
export {
  getCountryByNationalNumber as default
};
