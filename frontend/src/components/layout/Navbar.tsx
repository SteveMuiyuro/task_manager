import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
  return (
    <header className="h-16 border-b border-slate-200  bg-white  flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-band-500">Welcome back, <span className="font-bold text-base">{user?.username}!</span></p>       
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-600/90" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
