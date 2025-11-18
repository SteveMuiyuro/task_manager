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

type  TaskCategoryDialogProps = {
  title: string | null
  tasks: Task[]
  onClose: () => void
}

const TaskCategoryDialog = ({ title, tasks, onClose }: TaskCategoryDialogProps) => {
  if (!title) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Task details</p>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{tasks.length} task(s) in this category</p>
          </div>
          <AppButton type="button" variant="secondary" onClick={onClose}>
            Close
          </AppButton>
        </div>

        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-600">
            No tasks in this category.
          </p>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-600">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Assigned to: {task.assigned_to?.username ?? "Unassigned"}</span>
                      {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <Badge variant={statusVariant(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCategoryDialog
