import { useMemo, useState } from 'react'
import TaskList from '../../components/TaskList'
import TaskFilters from '../../components/TaskFilters'
import { useDeleteTask, useTasks } from '../../hooks/useTasks'
import { useUsers } from '../../hooks/useUsers'
import { Task, TaskStatus } from '../../types'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../providers/ToastProvider'
import TaskInfoDialog from '../../components/TaskInfoDialog'

const TasksPage = () => {
  const [filters, setFilters] = useState<{ status?: TaskStatus; assignee?: string }>({})
  const { data: tasks = [], isLoading } = useTasks(filters)
  const { user } = useAuthStore()
  const { pushToast } = useToast()
  const shouldLoadUsers = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { data: teamMembers = [] } = useUsers({ enabled: shouldLoadUsers, endpoint: 'users/options/' })
  const availableUsers = shouldLoadUsers ? teamMembers : user ? [user] : []
  const deleteMutation = useDeleteTask()
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const canDeleteTasks = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canOpenDialog = canDeleteTasks
  const [taskToView, setTaskToView] = useState<Task | null>(null)

  const filteredTasks = useMemo(() => tasks, [tasks])

  const handleDeleteTask = async () => {
    if (!taskToDelete) return
    await deleteMutation.mutateAsync(taskToDelete.id)
    pushToast({ type: 'success', message: 'Task deleted' })
    setTaskToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="text-slate-500">Track progress across the team</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Link
            to="/app/tasks/new"
            className="hidden md:inline-flex px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium"
          >
            New Task
          </Link>
        )}
      </div>
      <TaskFilters
        status={filters.status}
        assignee={filters.assignee}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        users={availableUsers}
      />
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          canDelete={canDeleteTasks}
          onDeleteClick={setTaskToDelete}
          onInfoClick={canOpenDialog ? setTaskToView : undefined}
        />
      )}
      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete task"
        description={taskToDelete ? `Are you sure you want to delete "${taskToDelete.title}"?` : undefined}
        confirmLabel="Delete task"
        onConfirm={handleDeleteTask}
        onClose={() => setTaskToDelete(null)}
        loading={deleteMutation.isPending}
      />
      <TaskInfoDialog task={taskToView} onClose={() => setTaskToView(null)} />
    </div>
  )
}

export default TasksPage
