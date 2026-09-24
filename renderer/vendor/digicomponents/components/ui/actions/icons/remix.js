function getRemixSize(size) {
  switch (size) {
    case "sm":
      return "md";
    case "lg":
      return "xl";
    default:
      return "lg";
  }
}
export {
  getRemixSize
};
