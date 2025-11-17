import { Navigate, useLocation } from 'react-router-dom'
import { PropsWithChildren, useEffect } from 'react'
import { Role } from '../types'
import { useAuthStore } from '../store/useAuthStore'
import { useAuth } from '../hooks/useAuth'

interface Props {
  roles?: Role[]
}

const ProtectedRoute = ({ children, roles }: PropsWithChildren<Props>) => {
  const { accessToken, user } = useAuthStore()
  const { fetchProfile } = useAuth()
  useEffect(() => {
    if (accessToken && !user) {
      fetchProfile()
    }
  }, [accessToken, user, fetchProfile])
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }

  return children
}

export default ProtectedRoute
