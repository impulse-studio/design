import source from "./TaskListExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { TodoList } from "@/components/shared/todo-list/TodoList"
import { Button } from "@/components/ui/button"

export function TaskListExample() {
  const [completed, setCompleted] = useState(1)
  const labels = [
    "Créer la structure du projet",
    "Construire le catalogue de composants",
    "Configurer les accès",
    "Intégrer le paiement",
    "Finaliser la page d’accueil",
  ]
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-5">
      <TodoList
        items={labels.map((label, index) => ({
          id: String(index),
          title: label,
          status:
            index < completed
              ? "completed"
              : index === completed
                ? "in-progress"
                : "pending",
        }))}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={() => setCompleted(1)}>
          Réinitialiser
        </Button>
        <Button
          variant="outline"
          disabled={completed === labels.length}
          onClick={() =>
            setCompleted((value) => Math.min(value + 1, labels.length))
          }
        >
          Terminer la tâche suivante
        </Button>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
