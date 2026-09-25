import { FileDiff } from "@/components/shared/FileDiff"
import { useState } from "react"
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      toast.add({
        title: "Exemple copié",
        description: "Les imports sont inclus.",
        type: "success",
      })
    } catch {
      toast.add({
        title: "La copie a échoué",
        description:
          "Vous pouvez sélectionner le code et le copier manuellement.",
        type: "error",
      })
    }
  }
  return (
    <FileDiff
      file="exemple.tsx"
      mode="code"
      rows={code.split("\n").map((text, index) => ({
        old: null,
        cur: index + 1,
        type: "ctx",
        text,
      }))}
      actions={
        <Button variant="ghost" size="sm" onClick={() => void copy()}>
          {copied === code ? (
            <RiCheckLine data-icon="inline-start" />
          ) : (
            <RiFileCopyLine data-icon="inline-start" />
          )}
          {copied === code ? "Copié" : "Copier le code"}
        </Button>
      }
    />
  )
}
