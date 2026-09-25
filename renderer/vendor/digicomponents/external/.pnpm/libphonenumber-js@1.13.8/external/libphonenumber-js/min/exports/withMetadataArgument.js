import metadata from "../../metadata.min.json.js";
function withMetadataArgument(func, _arguments) {
  var args = Array.prototype.slice.call(_arguments);
  args.push(metadata);
  return func.apply(this, args);
}
export {
  withMetadataArgument as default
};
