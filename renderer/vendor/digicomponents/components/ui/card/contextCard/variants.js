import { cva } from "../../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const contextCardVariants = /* @__PURE__ */ cva(
  "bg-muted flex flex-col gap-2 rounded-lg border",
  {
    variants: {
      size: {
        sm: "p-2 text-sm",
        md: "p-3",
        lg: "p-4"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
export {
  contextCardVariants
};
