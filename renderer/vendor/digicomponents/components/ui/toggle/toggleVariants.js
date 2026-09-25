import { cva } from "../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const toggleVariants = /* @__PURE__ */ cva(
  "ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-input hover:bg-accent hover:text-accent-foreground border bg-transparent"
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
export {
  toggleVariants
};
