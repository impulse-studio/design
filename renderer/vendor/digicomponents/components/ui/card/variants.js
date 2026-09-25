import { cva } from "../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const cardVariants = /* @__PURE__ */ cva("", {
  variants: {
    active: {
      true: "border-foreground bg-muted"
    },
    disabled: {
      true: "border-border/60 text-black/60"
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-3"
    }
  },
  defaultVariants: {
    disabled: false,
    size: "md"
  }
});
export {
  cardVariants
};
