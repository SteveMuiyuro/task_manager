import { create } from 'zustand'
import { ApiUser } from '../types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: ApiUser | null
  setTokens: (tokens: { access: string; refresh: string }) => void
  setUser: (user: ApiUser | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  setTokens: ({ access, refresh }) => {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    set({ accessToken: access, refreshToken: refresh })
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
    set({ user })
  },
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ accessToken: null, refreshToken: null, user: null })
  }
}))
