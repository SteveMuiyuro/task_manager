import { useParams, useNavigate } from "react-router-dom"
import { useTask, useTaskMutation, useAssignTask, useDeleteTask } from "../../hooks/useTasks"
import Card from "../../components/ui/Card"
import { AppButton } from "../../components/ui/AppButton"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { useUsers } from "../../hooks/useUsers"
import { useAuthStore } from "../../store/useAuthStore"
import { useEffect, useState } from "react"
import { useToast } from "../../providers/ToastProvider"
import ConfirmDialog from "../../components/ui/ConfirmDialog"

const TaskDetailPage = () => {
  const { taskId } = useParams()
  const { data: task, isLoading } = useTask(taskId || "")
  const { mutateAsync, isPending } = useTaskMutation()
  const assignMutation = useAssignTask()
  const deleteMutation = useDeleteTask()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { pushToast } = useToast()

  const { data: users = [] } = useUsers({
    enabled: user?.role === "ADMIN" || user?.role === "MANAGER",
    endpoint: "users/options/"
  })

  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "COMPLETED">(
    task?.status ?? "TODO"
  )
  const [assigneeId, setAssigneeId] = useState("__none")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { refetch } = useTask(taskId || "")

  useEffect(() => {
    if (task) {
      setStatus(task.status)
      setAssigneeId(task.assigned_to?.id ? String(task.assigned_to.id) : "__none")
    }
  }, [task])

  const canAssign = user && (user.role === "ADMIN" || user.role === "MANAGER")
  const canDelete = canAssign
  const canUpdateStatus =
    user && (user.role !== "MEMBER" || task?.assigned_to?.id === user.id)

  if (isLoading) return <p>Loading task...</p>
  if (!task) return <p>Task not found.</p>

  const handleStatusUpdate = async () => {
    if (isPending) return

    await mutateAsync({ id: task.id, payload: { status }, method: "patch" })
    await refetch()
    pushToast({ type: "success", message: "Status updated" })
  }

  const handleAssign = async (value: string) => {
    const mapped = value === "__none" ? null : Number(value)

    setAssigneeId(value)

    await assignMutation.mutateAsync({
      taskId: task.id,
      userId: mapped
    })

    pushToast({ type: "success", message: "Assignment updated" })
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(task.id)
    pushToast({ type: "success", message: "Task deleted" })
    navigate("/app/tasks")
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{task.title}</h1>

        {canAssign && (
          <div className="flex items-center gap-3">
            <AppButton to={`/app/tasks/${task.id}/edit`}>
              Edit Task
            </AppButton>

            {canDelete && (
              <AppButton
                type="button"
                variant="danger"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </AppButton>
            )}
          </div>
        )}
      </div>

      {/* INFO CARD */}
      <Card>
        <p className="text-slate-600 mb-2">{task.description}</p>
        <p className="text-sm text-slate-500">Status: {task.status}</p>
        <p className="text-sm text-slate-500">
          Assignee: {task.assigned_to?.username ?? "Unassigned"}
        </p>
      </Card>

      {/* STATUS UPDATE */}
      {canUpdateStatus && (
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Update status</label>

            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AppButton onClick={handleStatusUpdate} disabled={isPending}>
            {isPending ? "Saving..." : "Save status"}
          </AppButton>
        </div>
      )}

      {/* ASSIGN TO */}
      {canAssign && (
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Assign to</label>

            <Select value={assigneeId} onValueChange={handleAssign}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="__none">Unassigned</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete task"
        description="This action cannot be undone."
        confirmLabel="Delete task"
        onConfirm={async () => {
          await handleDelete()
          setShowDeleteDialog(false)
        }}
        onClose={() => setShowDeleteDialog(false)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default TaskDetailPage
