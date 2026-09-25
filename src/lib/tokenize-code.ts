const KEYWORDS = new Set([
  "export",
  "function",
  "return",
  "const",
  "let",
  "var",
  "if",
  "else",
  "throw",
  "new",
  "import",
  "from",
  "async",
  "await",
  "class",
  "extends",
  "typeof",
  "void",
  "true",
  "false",
  "null",
  "undefined",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "this",
  "super",
  "static",
  "type",
  "interface",
  "enum",
  "as",
  "of",
  "in",
])

export const tokenize = (line: string) => {
  const raw = []
  const re =
    /(\s+)|(\/\/.*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|(\S)/g
  let m
  while ((m = re.exec(line))) {
    if (m[1]) raw.push({ kind: "txt", v: m[1] })
    else if (m[2] || m[3]) raw.push({ kind: "cm", v: m[0] })
    else if (m[4]) raw.push({ kind: "str", v: m[0] })
    else if (m[5]) raw.push({ kind: "num", v: m[0] })
    else if (m[6]) raw.push({ kind: "id", v: m[0] })
    else raw.push({ kind: "txt", v: m[0] })
  }
  const out = []
  for (let i = 0; i < raw.length; i++) {
    const cur = raw[i]
    if (cur.kind !== "id") {
      out.push({ t: cur.kind, v: cur.v })
      continue
    }
    if (KEYWORDS.has(cur.v)) {
      out.push({ t: "kw", v: cur.v })
      continue
    }
    let j = i + 1
    while (j < raw.length && raw[j].kind === "txt" && /^\s+$/.test(raw[j].v))
      j++
    const next = raw.at(j)
    out.push({ t: next && next.v.startsWith("(") ? "fn" : "txt", v: cur.v })
  }
  return out
}
