import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const alertVariants = /* @__PURE__ */ cva(
  "[&>i]:text-foreground relative flex w-full gap-1 rounded-lg border p-4",
  {
    variants: {
      variant: {
        info: "border-foreground bg-white",
        destructive: "bg-destructive text-destructive-foreground border-none",
        warning: "bg-warning/80 text-warning-foreground dark:text-primary-foreground dark:*:text-primary-foreground border-none"
      }
    },
    defaultVariants: {
      variant: "info"
    }
  }
);
export {
  alertVariants
};
