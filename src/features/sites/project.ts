import { packageSchema } from "@/validators/sites/package"

import type { SiteDocument } from "@/validators/sites/document"

/** Preview and export consume the same dependency declarations. npm produces the lock. */
export const projectFiles = (doc: SiteDocument) => {
  const files = { ...doc.files }
  const pkg = packageSchema.parse(JSON.parse(files["package.json"]))
  pkg.dependencies = { ...pkg.dependencies, ...doc.dependencies }
  delete pkg.packageManager
  files["package.json"] = JSON.stringify(pkg, null, 2)
  delete files["pnpm-lock.yaml"]
  delete files["yarn.lock"]
  return files
}
