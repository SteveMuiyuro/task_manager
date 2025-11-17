import { useEffect } from 'react'
import { Mail, UserRound, X } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { cn } from '../../lib/utils'

type UserProfilePanelProps = {
  isOpen: boolean
  onClose: () => void
}

const getInitials = (username?: string) => {
  if (!username) return 'U'
  const [first = '', second = ''] = username.split(' ')
  const initials = `${first.charAt(0)}${second.charAt(0)}`
  return initials.toUpperCase() || username.charAt(0).toUpperCase()
}

const UserProfilePanel = ({ isOpen, onClose }: UserProfilePanelProps) => {
  const { user } = useAuthStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const initials = getInitials(user?.username)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-slate-900/30 transition-opacity duration-200',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-white border-l border-slate-200 shadow-xl',
          'transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="User profile panel"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <p className="text-lg font-semibold text-slate-900">User profile</p>
            <p className="text-sm text-slate-500">Details about your account</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
            aria-label="Close user profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-semibold text-lg">
              {initials}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">{user?.username ?? 'Unknown user'}</p>
              <p className="text-sm text-slate-500">{user?.role ?? 'Role not available'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account details</p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <UserRound className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="text-sm font-medium">{user?.username ?? 'Not available'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium">{user?.email ?? 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default UserProfilePanel
