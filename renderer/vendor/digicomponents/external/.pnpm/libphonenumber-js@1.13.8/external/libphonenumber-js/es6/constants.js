var MIN_LENGTH_FOR_NSN = 2;
var MAX_LENGTH_FOR_NSN = 17;
var MAX_LENGTH_COUNTRY_CODE = 3;
var VALID_DIGITS = "0-9０-９٠-٩۰-۹";
var DASHES = "-‐-―−ー－";
var SLASHES = "／/";
var DOTS = "．.";
var WHITESPACE = "  ­​⁠　";
var BRACKETS = "()（）［］\\[\\]";
var TILDES = "~⁓∼～";
var VALID_PUNCTUATION = /* @__PURE__ */ "".concat(DASHES).concat(SLASHES).concat(DOTS).concat(WHITESPACE).concat(BRACKETS).concat(TILDES);
var PLUS_CHARS = "+＋";
export {
  MAX_LENGTH_COUNTRY_CODE,
  MAX_LENGTH_FOR_NSN,
  MIN_LENGTH_FOR_NSN,
  PLUS_CHARS,
  VALID_DIGITS,
  VALID_PUNCTUATION,
  WHITESPACE
};
