import { useCallback } from 'react'
import client from '../lib/api/client'
import { useAuthStore } from '../store/useAuthStore'
import { ApiUser } from '../types'

export const useAuth = () => {
  const { accessToken, refreshToken, user, setTokens, setUser, logout: clearStore } = useAuthStore()

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
    const { data } = await client.post('auth/login/', {
      username: credentials.username,
      password: credentials.password,
    })
      setTokens({ access: data.access, refresh: data.refresh })
      const profile = await client.get<ApiUser>('users/me/')
      setUser(profile.data)
    },
    [setTokens, setUser]
  )

  const register = useCallback(
    async (payload: { username: string; email: string; password: string }) => {
      const { data } = await client.post('auth/register/', payload)
      return data
    },
    []
  )

  const fetchProfile = useCallback(async () => {
    if (!accessToken) return
    const profile = await client.get<ApiUser>('users/me/')
    setUser(profile.data)
  }, [accessToken, setUser])

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await client.post('auth/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      // ignore network errors
    } finally {
      clearStore()
    }
  }, [refreshToken, clearStore])

  return { login, register, fetchProfile, logout, user, accessToken }
}
