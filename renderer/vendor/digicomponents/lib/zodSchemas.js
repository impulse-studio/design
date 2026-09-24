import { z } from "zod";
const hexaRegex = /^#([A-Fa-f0-9]{6})$/;
const zodHexColor = /* @__PURE__ */ z.string().regex(hexaRegex);
export {
  hexaRegex,
  zodHexColor
};
