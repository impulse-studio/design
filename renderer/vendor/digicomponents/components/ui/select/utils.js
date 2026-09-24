function findSelectedOption(options, selectedValue) {
  let selectedOption;
  for (const option of options) {
    if (option.kind === "option" && option.value === selectedValue) {
      selectedOption = option;
      break;
    }
    if (option.kind === "group") {
      selectedOption = option.options.find(
        (option2) => option2.value === selectedValue
      );
      if (selectedOption) break;
    }
  }
  return selectedOption;
}
function filterOptionOrGroups(options, search, filterFunction) {
  function filterOption(option) {
    {
      return option.label.toLowerCase().includes(search.toLowerCase());
    }
  }
  return options.map((option, index) => {
    if (option.kind === "option") {
      return option;
    }
    const newGroup = {
      ...option,
      options: option.options.filter((option2) => filterOption(option2)),
      renderKey: `group-${index}`
    };
    return newGroup;
  }).filter((option) => {
    if (option.kind === "option") {
      return filterOption(option);
    }
    return option.options.length > 0;
  });
}
function computeValueText({
  value,
  options,
  defaultTexts,
  selectedText
}) {
  if (value === void 0) return "";
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (value.length === 1) {
      const selectedOption2 = findSelectedOption(options, value[0]);
      return selectedOption2?.label ?? defaultTexts.selectedItemsText ?? selectedText ?? "";
    }
    return `${value.length} ${selectedText ?? defaultTexts.selectedItemsText ?? ""}`;
  }
  if (selectedText) return selectedText;
  const selectedOption = findSelectedOption(options, value);
  return selectedOption?.label ?? "";
}
function getSelectedOptionsFromValues(options, value) {
  if (value === void 0) return [];
  if (Array.isArray(value)) {
    return value.map((value2) => findSelectedOption(options, value2)).filter((option) => option !== void 0);
  }
  return [findSelectedOption(options, value)].filter(
    (option) => option !== void 0
  );
}
function getValueFromOptions({
  options,
  multiple
}) {
  if (Array.isArray(options)) {
    return multiple ? options.map((option) => option.value) : options[0]?.value;
  } else {
    return multiple ? [options.value] : options.value;
  }
}
export {
  computeValueText,
  filterOptionOrGroups,
  findSelectedOption,
  getSelectedOptionsFromValues,
  getValueFromOptions
};
