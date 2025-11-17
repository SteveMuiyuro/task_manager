import { Task } from '../types'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { Link } from 'react-router-dom'

const statusVariant = (status: Task['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'IN_PROGRESS':
      return 'info'
    default:
      return 'warning'
  }
}

interface Props {
  tasks: Task[]
  canDelete?: boolean
  onDeleteClick?: (task: Task) => void
  onInfoClick?: (task: Task) => void
}

const TaskList = ({ tasks, canDelete = false, onDeleteClick, onInfoClick }: Props) => (
  <div className="grid gap-4">
    {tasks.map((task) => (
      <Card key={task.id}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link to={`/app/tasks/${task.id}`} className="text-lg font-semibold text-brand-600">
              {task.title}
            </Link>
            <p className="text-sm text-slate-500">Assigned to: {task.assigned_to?.username ?? 'Unassigned'}</p>
          </div>
          <div className="flex items-center gap-3">
            {onInfoClick && (
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:underline"
                onClick={(event) => {
                  event.preventDefault()
                  onInfoClick(task)
                }}
              >
                View details
              </button>
            )}
            <Badge variant={statusVariant(task.status)}>{task.status.replace('_', ' ')}</Badge>
            {canDelete && (
              <button
                type="button"
                className="text-sm font-medium text-rose-600 hover:underline"
                onClick={(event) => {
                  event.preventDefault()
                  onDeleteClick?.(task)
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Card>
    ))}
  </div>
)

export default TaskList
