import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const inputVariants = /* @__PURE__ */ cva(
  "border-input bg-background placeholder:text-muted-foreground focus-within:ring-ring/50 flex h-9 w-full rounded-md border px-3 ring-offset-0 file:border-0 file:bg-transparent file:font-medium focus-within:ring-1 focus-within:outline-hidden has-[input:disabled]:opacity-50",
  {
    variants: {
      state: {
        true: "border-success focus-within:ring-success",
        false: "border-destructive focus-within:ring-destructive"
      }
    }
  }
);
export {
  inputVariants
};
