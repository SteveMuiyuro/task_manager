import { FormEvent, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Input from "../../components/ui/Input"
import { AppButton } from "../../components/ui/AppButton"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

import { Button as ShadButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

import { useTask, useTaskMutation } from "../../hooks/useTasks"
import { useUsers } from "../../hooks/useUsers"
import { TaskStatus } from "../../types"
import { useToast } from "../../providers/ToastProvider"

type TProps = {
  mode: "create" | "edit"
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA"); 
}

function getStartOfDay(date: Date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const TaskFormPage = ({ mode }: TProps) => {
  const navigate = useNavigate()
  const { taskId } = useParams()

  const { data: task } = useTask(taskId || "", { enabled: mode === "edit" })
  const { mutateAsync } = useTaskMutation()
  const { data: users = [] } = useUsers({ endpoint: "users/options/" })
  const { pushToast } = useToast()

  const today = useMemo(() => getStartOfDay(new Date()), [])

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "TODO" as TaskStatus,
    assigned_to_id: "__none",
  })

  useEffect(() => {
    if (mode === "edit" && task) {
      setForm({
        title: task.title,
        description: task.description,
        due_date: task.due_date ?? "",
        status: task.status,
        assigned_to_id: task.assigned_to?.id?.toString() ?? "__none",
      })
    }
  }, [mode, task])

  const dueDateObj = form.due_date ? new Date(form.due_date) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setForm({ ...form, due_date: "" })
      return
    }

    const normalizedSelected = getStartOfDay(date)

    if (normalizedSelected < today) {
      pushToast({
        type: "error",
        message: "The date must be current or later.",
      })
      return
    }

    setForm({ ...form, due_date: formatDate(normalizedSelected) })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (form.due_date) {
      const normalizedDueDate = getStartOfDay(new Date(form.due_date))

      if (normalizedDueDate < today) {
        pushToast({
          type: "error",
          message: "The date must be current or later.",
        })
        return
      }
    }

    const payload = {
      ...form,
      assigned_to_id:
        form.assigned_to_id === "__none" ? null : Number(form.assigned_to_id),
    }

    if (mode === "create") {
      await mutateAsync({ payload, method: "post" })
      pushToast({ type: "success", message: "Task created" })
    } else {
      await mutateAsync({ id: Number(taskId), payload, method: "patch" })
      pushToast({ type: "success", message: "Task updated" })
    }

    navigate("/app/tasks")
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">
        {mode === "create" ? "New task" : "Update task"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4">

        {/* TITLE */}
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        {/* DESCRIPTION */}
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          Description
          <textarea
            className="
              min-h-[140px]
              rounded-md 
              border border-slate-300
              p-3
              bg-white
              focus:outline-none 
              focus:ring-0 
              focus:border-slate-400
              resize-none
              transition
            "
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </label>

        {/* DUE DATE (SHADCN CALENDAR) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Due date
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <ShadButton
                variant="outline"
                className={cn(
                  "w-[230px] justify-start text-left font-normal",
                  !form.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.due_date
                  ? new Date(form.due_date).toLocaleDateString()
                  : "Pick a date"}
              </ShadButton>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDateObj}
                fromDate={today}
                disabled={{ before: today }}
                onSelect={handleDateSelect}
                autoFocus
     
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* STATUS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Status</label>

          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm({ ...form, status: value as TaskStatus })
            }
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ASSIGN TO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Assign to</label>

          <Select
            value={form.assigned_to_id}
            onValueChange={(value) =>
              setForm({ ...form, assigned_to_id: value })
            }
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__none">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SUBMIT */}
        <AppButton type="submit">
          {mode === "create" ? "Create" : "Save changes"}
        </AppButton>
      </form>
    </div>
  )
}

export default TaskFormPage
