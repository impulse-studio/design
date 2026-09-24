function parseDigiLabelFormat(label) {
  const regex = /(?<label>(?:(?!##|\?\?).)+)(?:##(?<description>(?:(?!\?\?).)+))?(?:\?\?(?<link>.+))?/gs;
  const matches = regex.exec(label);
  if (!matches || !matches.groups || !matches.groups.label)
    return { label, description: null, helpLink: null };
  return {
    label: matches.groups.label,
    description: matches.groups.description || null,
    helpLink: matches.groups.link || null
  };
}
export {
  parseDigiLabelFormat
};
