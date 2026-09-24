import { cva } from "../../../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.js";
const variants = /* @__PURE__ */ cva(
  "bg-off-black/50 absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center p-4 text-white opacity-0 transition-opacity",
  {
    variants: {
      disabled: {
        false: "hover:opacity-100"
      },
      noPointer: {
        false: "cursor-pointer"
      },
      show: {
        true: "opacity-100"
      }
    },
    compoundVariants: [
      {
        disabled: true,
        noPointer: false,
        class: "cursor-not-allowed"
      }
    ]
  }
);
const digiOverlayZIndex = 10;
export {
  digiOverlayZIndex,
  variants
};
