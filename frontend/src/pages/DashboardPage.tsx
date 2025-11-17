import { useMemo, useState } from "react"
import TaskCategoryDialog from "../components/TaskCategoryDialog"
import Card from "../components/ui/Card"
import { useTasks } from "../hooks/useTasks"
import { useAuthStore } from "../store/useAuthStore"
import { Task } from "../types"

type CategoryKey = "total" | "todo" | "inProgress" | "completed" | "assignedToMe"

const DashboardPage = () => {
  const { user } = useAuthStore()
  const { data: tasks = [], isLoading } = useTasks()
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)

  const stats = useMemo(() => {
    const total = tasks.length
    const todo = tasks.filter((task) => task.status === 'TODO').length
    const completed = tasks.filter((task) => task.status === 'COMPLETED').length
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length
    const assignedToMe = tasks.filter((task) => task.assigned_to?.id === user?.id).length
    return { total, todo, completed, inProgress, assignedToMe }
  }, [tasks, user])

  const categorizedTasks = useMemo<Record<CategoryKey, Task[]>>(
    () => ({
      total: tasks,
      todo: tasks.filter((task) => task.status === "TODO"),
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS"),
      completed: tasks.filter((task) => task.status === "COMPLETED"),
      assignedToMe: tasks.filter((task) => task.assigned_to?.id === user?.id),
    }),
    [tasks, user]
  )

  const categoryLabels: Record<CategoryKey, string> = {
    total: "Total tasks",
    todo: "To do",
    inProgress: "In progress",
    completed: "Completed",
    assignedToMe: "Assigned to me",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Summary</h1>
        <p className="text-slate-500">Here is an overview of your tasks</p>
      </div>
      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card onClick={() => setActiveCategory("total")}> 
            <p className="text-sm text-slate-500">Total tasks</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </Card>
          <Card onClick={() => setActiveCategory("todo")}>
            <p className="text-sm text-slate-500">To do</p>
            <p className="text-3xl font-bold">{stats.todo}</p>
          </Card>
          <Card onClick={() => setActiveCategory("inProgress")}>
            <p className="text-sm text-slate-500">In progress</p>
            <p className="text-3xl font-bold">{stats.inProgress}</p>
          </Card>
          <Card onClick={() => setActiveCategory("completed")}>
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </Card>
          <Card onClick={() => setActiveCategory("assignedToMe")}> 
            <p className="text-sm text-slate-500">Assigned to me</p>
            <p className="text-3xl font-bold">{stats.assignedToMe}</p>
          </Card>
        </div>
      )}

      <TaskCategoryDialog
        title={activeCategory ? categoryLabels[activeCategory] : null}
        tasks={activeCategory ? categorizedTasks[activeCategory] : []}
        onClose={() => setActiveCategory(null)}
      />
    </div>
  )
}

export default DashboardPage
