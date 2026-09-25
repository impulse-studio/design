import { useEffect, useState } from "react"
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiArrowDownSLine,
} from "@remixicon/react"
import { useEditor, useEditorState } from "@/features/editor/context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { EditorPreviewButton } from "./EditorPreviewButton"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function InspectorHeader() {
  const editor = useEditor()
  const inspect = useEditorState((s) => s.rightTab === "inspect")
  const past = useEditorState((state) => state.past.length)
  const future = useEditorState((state) => state.future.length)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])
  return (
    <div className="editor-inspector-top h-[48px] min-h-[48px] flex items-center justify-between p-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="editor-profile-menu h-[32px] [padding:0_4px] gap-1 [&_[data-slot=avatar]]:w-[24px] [&_[data-slot=avatar]]:h-[24px] [&_[data-slot=avatar-fallback]]:[background:var(--editor-dev)] [&_[data-slot=avatar-fallback]]:[color:var(--editor-on-accent)] [&_[data-slot=avatar-fallback]]:text-[12px] [&_>_svg]:w-[12px] [&_>_svg]:h-[12px]"
              aria-label="Actions du document"
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          <RiArrowDownSLine />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={inspect || !past} onClick={editor.undo}>
              <RiArrowGoBackLine />
              Annuler<DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={inspect || !future}
              onClick={editor.redo}
            >
              <RiArrowGoForwardLine />
              Rétablir<DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <EditorPreviewButton />
        <Button
          size="sm"
          className="editor-share-button relative h-[32px] min-w-[64px] [padding:0_10px] [background:var(--editor-selection)] [color:var(--editor-on-accent)] border-0 shadow-none text-[11px] [@media(hover:hover)_and_(pointer:fine)]:[&:hover]:[background:color-mix(in_srgb,_var(--editor-selection),_black_10%)]"
          aria-label="Copier le lien de la maquette"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href)
              setCopied(true)
            } catch {
              editor.set({
                notice:
                  "Le lien n’a pas pu être copié. Vous pouvez le copier depuis la barre d’adresse.",
              })
            }
          }}
        >
          <span className="editor-share-label min-w-[44px]">
            {copied ? "Lien copié" : "Partager"}
          </span>
        </Button>
      </div>
    </div>
  )
}
