import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { ApiUser, TaskStatus } from "../types"

type TProps = {
  status?: TaskStatus
  assignee?: string
  onChange: (filters: { status?: TaskStatus; assignee?: string }) => void
  users: ApiUser[]
}

// Special constant for "All"
const ALL_VALUE = "__all__"

const TaskFilters = ({ status, assignee, onChange, users }: TProps) => (
  <div className="grid md:grid-cols-2 gap-4">

    {/* STATUS FILTER */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 ">
        Status
      </label>

      <Select
        value={status ?? ALL_VALUE}
        onValueChange={(value) =>
          onChange({
            status: value === ALL_VALUE ? undefined : (value as TaskStatus),
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          <SelectItem value="TODO">Todo</SelectItem>
          <SelectItem value="IN_PROGRESS">In progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* ASSIGNEE FILTER */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 ">
        Assignee
      </label>

      <Select
        value={assignee ?? ALL_VALUE}
        onValueChange={(value) =>
          onChange({
            assignee: value === ALL_VALUE ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={String(user.id)}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

  </div>
)

export default TaskFilters
