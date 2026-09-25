import { useState } from "react"
import { isEditableFile } from "@/features/sites/source"
import { SiteFileEditor } from "./FileEditor"
import { FileDiff } from "@/components/shared/FileDiff"
import { Button } from "@/components/ui/button"
import type { SiteDocument } from "@/features/sites/schema"

export function SiteCodeView({
  canEdit, onSave,
  path,
  line,
  doc,
  onClose,
}: {
  canEdit: boolean
  onSave: (path:string,content:string)=>Promise<void>
  path: string
  line: number | null
  doc: SiteDocument
  onClose: () => void
}) {
  const [editing,setEditing]=useState(false)
  const code = Object.hasOwn(doc.files, path) ? doc.files[path] : undefined
  const asset = Object.hasOwn(doc.assets, path) ? doc.assets[path] : undefined

  return (
    <section className="site-code-view flex-1 min-h-0 overflow-auto bg-background" aria-label={`Code de ${path}`}>
      <div className="site-code-toolbar sticky top-0 z-[1] flex items-center justify-between gap-4 py-3 px-4 border-b border-border bg-background text-[12px]">
        <span className="truncate">
          {path}
          {line ? ` · ligne ${line}` : ""}
        </span>
        {canEdit && isEditableFile(path) && code !== undefined && <Button variant="ghost" size="sm" onClick={()=>setEditing(!editing)}>{editing?"Voir le code":"Modifier"}</Button>}
        <Button variant="outline" size="sm" onClick={onClose}>
          Retour à l’aperçu
        </Button>
      </div>
      {editing && code !== undefined ? <SiteFileEditor path={path} content={code} onSave={onSave} onCancel={()=>setEditing(false)}/> : code !== undefined ? (
        <FileDiff
          file={path}
          mode="code"
          focusLine={line}
          rows={code.split("\n").map((text, index) => ({
            old: null,
            cur: index + 1,
            type: "ctx" as const,
            text,
          }))}
        />
      ) : (
        <p className="p-6 text-sm text-muted-foreground">
          {asset
            ? `Asset inclus dans le ZIP · ${asset.mime}`
            : "Ce fichier a été supprimé du projet."}
        </p>
      )}
    </section>
  )
}
