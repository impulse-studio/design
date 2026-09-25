import source from "./FileTreeExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ui/file-tree"

export function FileTreeExample() {
  return (
    <FileTree defaultExpandedIds={["src"]} ariaLabel="Fichiers du site">
      <FileTreeFolder value="src" name="src">
        <FileTreeFile value="app" name="App.tsx" />
        <FileTreeFile value="styles" name="styles.css" />
      </FileTreeFolder>
      <FileTreeFile value="package" name="package.json" />
    </FileTree>
  )
}
// @example:end
export const getCode = createExampleCode(source)
