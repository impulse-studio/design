export const parseSnapshotArguments = (args) => {
  const options = {}
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index]
    if (option !== "--orchestration" && option !== "--output-root") {
      throw new Error(`Unknown option: ${option}`)
    }
    const value = args[++index]
    if (!value || value.startsWith("--"))
      throw new Error(`${option} requires a path`)
    const key = option === "--orchestration" ? "orchestration" : "outputRoot"
    if (options[key]) throw new Error(`Duplicate option: ${option}`)
    options[key] = value
  }
  return options
}
