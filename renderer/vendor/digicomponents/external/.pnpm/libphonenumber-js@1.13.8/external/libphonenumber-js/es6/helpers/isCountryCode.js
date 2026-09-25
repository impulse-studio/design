var COUNTRY_CODE_REG_EXP = /^[A-Z]{2}$/;
function isCountryCode(string) {
  return COUNTRY_CODE_REG_EXP.test(string);
}
export {
  isCountryCode as default
};
