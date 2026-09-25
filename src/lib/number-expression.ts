// Small arithmetic grammar for inspector fields; never execute user input.
export const parseNumberExpression = (
  input: string,
  base?: number
): number | null => {
  let source = input
    .trim()
    .replace(/(?:px|%)$/i, "")
    .trim()
    .replace(/,/g, ".")
  if (!source || source.length > 160) return null
  if (/^[*/^]/.test(source)) {
    if (base === undefined) return null
    source = `${base}${source}`
  }
  const tokens = source.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+*/^-]/g) ?? []
  if (tokens.join("") !== source.replace(/\s/g, "")) return null
  let index = 0
  const primary = (): number => {
    const token = tokens[index++]
    if (token === "(") {
      const value = expression()
      return tokens[index++] === ")" ? value : NaN
    }
    return token && /^(?:\d|\.)/.test(token) ? Number(token) : NaN
  }
  const power = (): number => {
    const value = primary()
    if (tokens[index] !== "^") return value
    index++
    return value ** unary()
  }
  const unary = (): number => {
    if (tokens[index] === "+") {
      index++
      return unary()
    }
    if (tokens[index] === "-") {
      index++
      return -unary()
    }
    return power()
  }
  const product = (): number => {
    let value = unary()
    while (tokens[index] === "*" || tokens[index] === "/") {
      const operator = tokens[index++]
      const right = unary()
      value = operator === "*" ? value * right : value / right
    }
    return value
  }
  const expression = (): number => {
    let value = product()
    while (tokens[index] === "+" || tokens[index] === "-") {
      const operator = tokens[index++]
      const right = product()
      value = operator === "+" ? value + right : value - right
    }
    return value
  }
  const value = expression()
  return index === tokens.length && Number.isFinite(value) ? value : null
}

export const formatNumber = (value: number | undefined) =>
  value === undefined ? "" : String(Math.round(value * 10000) / 10000)

export const NUMBER_BOUNDS = { min: -100000, max: 100000 }

/** Clamps then rounds to the 4 decimals the inspector displays. */
export const clampNumber = (value: number, min: number, max: number) =>
  Math.round(Math.max(min, Math.min(max, value)) * 10000) / 10000

/** Shift steps ×10 and Alt steps ×0.1, for arrow keys and label scrubbing. */
export const stepIncrement = (
  event: { shiftKey: boolean; altKey: boolean },
  step: number
) => step * (event.shiftKey ? 10 : event.altKey ? 0.1 : 1)
