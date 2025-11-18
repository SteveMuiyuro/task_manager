import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import client from '../lib/api/client'
import { ApiUser } from '../types'

export const USERS_KEY = ['users']

type UseUsersOptions  = {
  enabled?: boolean
  endpoint?: string
}

export const useUsers = (options?: UseUsersOptions) => {
  return useQuery({
    queryKey: [...USERS_KEY, options?.endpoint ?? 'users/'],
    queryFn: async () => {
      const endpoint = options?.endpoint ?? 'users/'
      const { data } = await client.get<ApiUser[]>(endpoint)
      return data
    },
    enabled: options?.enabled ?? true
  })
}

export const useUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload, method }: { id?: number; payload: Partial<ApiUser & { password?: string }>; method: 'post' | 'patch' | 'put' }) => {
      if (method === 'post') {
        const { data } = await client.post<ApiUser>('users/', payload)
        return data
      }
      const { data } = await client[method]<ApiUser>(`users/${id}/`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY })
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: number) => {
      await client.delete(`users/${userId}/`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY })
  })
}
