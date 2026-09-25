import { clsx } from "../external/.pnpm/clsx@2.1.1/external/clsx/dist/clsx.js";
import { twMerge } from "../external/.pnpm/tailwind-merge@3.4.1/external/tailwind-merge/dist/bundle-mjs.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export {
  cn
};
