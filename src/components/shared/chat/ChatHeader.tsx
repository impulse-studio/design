import { useState } from "react"
import { RiMoreLine, RiRestartLine, RiLogoutBoxRLine } from "@remixicon/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function ChatHeader({
  demo,
  onExit,
  onReset,
}: {
  demo: boolean
  onExit: () => void
  onReset: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  return (
    <header className="chat-header flex shrink-0 items-center justify-between gap-2 min-h-[44px] py-2 px-3 border-b border-border text-[12px]">
      <div className="flex min-w-0 items-center gap-2">
        <span className="font-medium">Assistant</span>
        <Badge variant="outline">{demo ? "Démo" : "Non connecté"}</Badge>
      </div>
      {demo && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
            aria-label="Options du chat"
          >
            <RiMoreLine />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setConfirm(true)}>
                <RiRestartLine />
                Réinitialiser la démo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExit}>
                <RiLogoutBoxRLine />
                Quitter la démo
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser la démo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les échanges simulés et le brouillon de démonstration seront
              effacés. Votre maquette et votre brouillon normal sont conservés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReset()
                setConfirm(false)
              }}
            >
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
