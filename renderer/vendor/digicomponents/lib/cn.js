import { clsx } from "../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.js";
import { twMerge } from "../node_modules/.pnpm/tailwind-merge@3.4.1/node_modules/tailwind-merge/dist/bundle-mjs.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export {
  cn
};
