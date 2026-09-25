#!/usr/bin/env node
import { realpath, stat } from "node:fs/promises"
import { resolve } from "node:path"
import { createHash } from "node:crypto"
import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { fileURLToPath } from "node:url"
import { tsImport } from "tsx/esm/api"

const { readLocalLibrary } = await tsImport("./library-files.ts", {
  parentURL: import.meta.url,
  tsconfig: fileURLToPath(new URL("../../tsconfig.json", import.meta.url)),
})

const [serverArg, folderArg] = process.argv.slice(2)
if (!serverArg || !folderArg) {
  console.error(
    "Usage : node scripts/libraries/library-connect.mjs https://studio.example.com /chemin/bibliotheque"
  )
  process.exit(1)
}
const server = new URL("/api/library-sync", serverArg)
if (
  server.protocol !== "https:" &&
  !(
    server.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(server.hostname)
  )
)
  throw new Error("Utilisez HTTPS ou un serveur local.")
const root = await realpath(resolve(folderArg))
if (!(await stat(root)).isDirectory())
  throw new Error("Le chemin doit être un dossier.")
const rl = createInterface({ input: stdin, output: stdout })
let token = await rl.question("Code temporaire affiché dans le Studio : ")
rl.close()
const call = async (payload) => {
  const response = await fetch(server, {
    method: payload ? "POST" : "GET",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(180_000),
    redirect: "error",
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.error ?? `Erreur ${response.status}`)
    error.status = response.status
    throw error
  }
  return data
}
const connection = await call()
if (!connection.token) throw new Error("Le code temporaire a déjà été utilisé.")
token = connection.token
const snapshot = () => readLocalLibrary(root, connection.framework)
let digest = "",
  stopped = false
process.on("SIGINT", () => {
  stopped = true
})
process.on("SIGTERM", () => {
  stopped = true
})
console.log(`Synchronisation en lecture seule : ${root}`)
while (!stopped) {
  try {
    const payload = await snapshot()
    const next = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex")
    if (next !== digest) {
      const result = await call(payload)
      digest = next
      console.log(`Bibliothèque synchronisée · version ${result.version}`)
    } else await call()
  } catch (error) {
    console.error(error.message)
    if ([401, 403].includes(error.status)) break
  }
  await new Promise((resolve) => setTimeout(resolve, 3000))
}
