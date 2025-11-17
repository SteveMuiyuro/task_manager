import { NavLink } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore"
import { Role } from "../../types"
import { clsx } from "clsx"
import UserProfileSection from "./UserProfileSection"

const APP_BASE_PATH = "/app"

const NAV_ITEMS: { label: string; to: string; roles?: Role[] }[] = [
  { label: "Dashboard", to: `${APP_BASE_PATH}` },
  { label: "Tasks", to: `${APP_BASE_PATH}/tasks` },
  {
    label: "Create Task",
    to: `${APP_BASE_PATH}/tasks/new`,
    roles: ["ADMIN", "MANAGER"],
  },
  { label: "Users", to: `${APP_BASE_PATH}/users`, roles: ["ADMIN"] },
]

type SidebarProps = {
  onProfileClick: () => void
}

const Sidebar = ({ onProfileClick }: SidebarProps) => {
  const { user } = useAuthStore()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <p className="text-lg font-semibold text-brand-600">Team Tasks</p>
        <p className="text-sm text-slate-500">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.filter(
          (item) => !item.roles || (user && item.roles.includes(user.role))
        ).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              clsx(
                "block px-4 py-2 rounded-md font-medium text-sm transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <UserProfileSection onOpen={onProfileClick} />
    </aside>
  )
}

export default Sidebar
