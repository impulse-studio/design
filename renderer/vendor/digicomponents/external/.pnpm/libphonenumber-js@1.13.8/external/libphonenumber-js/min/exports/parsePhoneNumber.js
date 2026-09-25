import withMetadataArgument from "./withMetadataArgument.js";
import parsePhoneNumber$1 from "../../es6/parsePhoneNumber.js";
function parsePhoneNumber() {
  return withMetadataArgument(parsePhoneNumber$1, arguments);
}
export {
  parsePhoneNumber
};
