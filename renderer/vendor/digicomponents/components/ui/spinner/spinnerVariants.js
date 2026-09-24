import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const spinnerVariants = /* @__PURE__ */ cva("inline-block animate-spin align-middle", {
  variants: {
    size: {
      micro: "h-2 w-2",
      sm: "h-4 w-4",
      lg: "h-10 w-10"
    }
  },
  defaultVariants: {
    size: "sm"
  }
});
const spinnerCircleVariants = /* @__PURE__ */ cva("", {
  variants: {
    reversed: {
      true: "stroke-off-black-foreground",
      false: "stroke-off-black"
    }
  },
  defaultVariants: {
    reversed: false
  }
});
export {
  spinnerCircleVariants,
  spinnerVariants
};
