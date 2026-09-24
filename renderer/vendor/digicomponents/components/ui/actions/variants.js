import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const actionVariants = /* @__PURE__ */ cva(
  "focus-visible:ring-ring relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-center font-medium text-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-7 rounded-md px-3 text-sm",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      },
      variant: {
        primary: "bg-primary text-primary-foreground hover:[&:not([disabled=true])]:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:[&:not([disabled=true])]:bg-destructive/90 shadow-xs",
        success: "bg-success text-success-foreground hover:[&:not([disabled=true])]:bg-success/90 shadow-xs",
        secondary: "border-input bg-background text-foreground hover:[&:not([disabled=true])]:bg-accent hover:[&:not([disabled=true])]:text-accent-foreground border shadow-xs",
        ghost: "hover:[&:not([disabled=true])]:bg-accent hover:[&:not([disabled=true])]:text-accent-foreground",
        link: "text-primary px-0 py-0 leading-4 underline-offset-2"
      },
      isLoading: {
        true: "",
        false: ""
      },
      block: {
        true: "w-full",
        false: ""
      },
      icon: {
        true: "",
        false: ""
      }
    },
    compoundVariants: [
      { size: "lg", icon: true, class: "px-6" },
      { variant: "link", icon: false, class: "hover:underline" },
      {
        variant: "link",
        icon: true,
        class: "hover:[&:not([disabled])]:before:bg-primary h-fit rounded-none before:absolute before:top-[1.3em] before:h-px before:w-full"
      },
      {
        variant: "link",
        icon: true,
        size: "sm",
        class: "pb-0"
      },
      { variant: "link", size: "sm", class: "h-auto" },
      { variant: "link", size: "md", class: "h-auto" },
      { variant: "link", size: "lg", class: "h-auto" }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      isLoading: false,
      block: false,
      icon: false
    }
  }
);
const actionContentVariants = /* @__PURE__ */ cva(
  "inline-flex w-full items-center justify-center leading-none",
  {
    variants: {
      isLoading: {
        true: "opacity-0",
        false: ""
      },
      hasIcon: {
        true: "flex items-center gap-x-1",
        false: ""
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        icon: ""
      }
    },
    compoundVariants: [
      {
        hasIcon: true,
        size: "lg",
        class: "gap-x-2"
      }
    ]
  }
);
function hasIcon(iconName) {
  return iconName !== void 0 && iconName !== "";
}
export {
  actionContentVariants,
  actionVariants,
  hasIcon
};
