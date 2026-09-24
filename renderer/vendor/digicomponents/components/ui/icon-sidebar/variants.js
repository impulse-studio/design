import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const iconSidebarItemVariants = /* @__PURE__ */ cva(
  "radius-md hover:bg-muted flex size-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-center text-xs transition-colors",
  {
    variants: {
      selected: {
        true: "bg-muted",
        false: ""
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: ""
      }
    },
    defaultVariants: {
      selected: false,
      disabled: false
    }
  }
);
export {
  iconSidebarItemVariants
};
