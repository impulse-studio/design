import { cva } from "../../../external/.pnpm/class-variance-authority@0.7.1/external/class-variance-authority/dist/index.js";
const badgeVariants = /* @__PURE__ */ cva(
  "focus:ring-ring inline-flex w-min max-w-full min-w-0 items-center rounded-full border px-1.5 px-2 py-0.5 text-center text-xs leading-[1.1] font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
  {
    variants: {
      color: {
        nearWhite: "bg-off-white text-off-white-foreground border-transparent",
        nearBlack: "bg-off-black text-off-black-foreground border-transparent",
        green: "bg-success text-success-foreground border-transparent",
        red: "bg-destructive text-destructive-foreground border-transparent",
        blue: "bg-blue text-blue-foreground border-transparent",
        purple: "bg-purple text-purple-foreground border-transparent",
        yellow: "bg-warning text-warning-foreground border-transparent"
      },
      hasIcon: {
        true: "gap-x-1",
        false: ""
      }
    },
    defaultVariants: {
      color: "nearWhite"
    }
  }
);
export {
  badgeVariants
};
