import { Task } from "../types"
import { AppButton } from "./ui/AppButton"
import Badge from "./ui/Badge"

const statusVariant = (status: Task["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "success"
    case "IN_PROGRESS":
      return "info"
    default:
      return "warning"
  }
}

interface TaskInfoDialogProps {
  task: Task | null
  onClose: () => void
}

const TaskInfoDialog = ({ task, onClose }: TaskInfoDialogProps) => {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
            <p className="text-sm text-slate-500">Assigned to: {task.assigned_to?.username ?? "Unassigned"}</p>
          </div>
          <Badge variant={statusVariant(task.status)}>{task.status.replace("_", " ")}</Badge>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          <p className="whitespace-pre-line leading-relaxed">{task.description || "No description provided."}</p>
          {task.due_date && (
            <p className="text-slate-500">Due date: {new Date(task.due_date).toLocaleDateString()}</p>
          )}
        </div>

        <div className="flex justify-end">
          <AppButton type="button" variant="secondary" onClick={onClose}>
            Close
          </AppButton>
        </div>
      </div>
    </div>
  )
}

export default TaskInfoDialog
