import source from "./AlertDialogExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function AlertDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Archiver le projet
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archiver ce projet ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le projet quittera la liste des projets actifs. Vous pourrez le
            retrouver dans les archives.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              toast.add({
                title: "Projet archivé",
                description:
                  "Démonstration : aucune donnée réelle n’a été modifiée.",
              })
            }
          >
            Archiver
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// @example:end

export const getCode = createExampleCode(source)
