import { UserRound } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

type UserProfileSectionProps = {
  onOpen: () => void
}

const UserProfileSection = ({ onOpen }: UserProfileSectionProps) => {
  const { user } = useAuthStore()
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="p-4 border-t border-slate-200 mt-auto">
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        aria-label="Open user profile"
      >
        <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div className="flex gap-2 items-baseline text-left ml-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <UserRound className="h-4 w-4" />
          </p>
          <p className="text-sm font-semibold text-slate-700 truncate">{user?.username ?? 'Unknown user'}</p>
        </div>
      </button>
    </div>
  )
}

export default UserProfileSection
