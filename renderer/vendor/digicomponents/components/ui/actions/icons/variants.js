import { cva } from "../../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const iconVariants = /* @__PURE__ */ cva("", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-10 w-10"
    },
    variant: {
      primary: "text-off-black",
      link: "text-blue",
      destructive: "text-destructive"
    }
  },
  defaultVariants: {
    size: "md",
    variant: "primary"
  }
});
export {
  iconVariants
};
