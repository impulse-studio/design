import { cva } from "../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const switchVariants = /* @__PURE__ */ cva(
  "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-success data-[state=unchecked]:bg-input flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
export {
  switchVariants
};
