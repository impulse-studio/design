function matchesEntirely(text, regularExpressionText) {
  text = text || "";
  return new RegExp("^(?:" + regularExpressionText + ")$").test(text);
}
export {
  matchesEntirely as default
};
