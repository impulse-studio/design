function stripNativeEventListeners(componentFields) {
  return {
    modelValue: componentFields.modelValue,
    "onUpdate:modelValue": componentFields["onUpdate:modelValue"],
    name: componentFields.name
  };
}
export {
  stripNativeEventListeners
};
