import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import client from '../lib/api/client'
import { Task } from '../types'

export const TASKS_KEY = ['tasks']

export const useTasks = (params?: Record<string, string | number | undefined>) => {
  return useQuery({
    queryKey: [...TASKS_KEY, params],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== '')
      )
      const { data } = await client.get<Task[]>('tasks/', { params: filteredParams })
      return data
    }
  })
}

export const useTask = (id: string | number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const { data } = await client.get<Task>(`tasks/${id}/`)
      return data
    },
    enabled: options?.enabled ?? Boolean(id)
  })
}

type TaskPayload = Partial<Task> & { assigned_to_id?: number | null }

export const useTaskMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload, method }: { id?: number; payload: TaskPayload; method: 'post' | 'patch' | 'put' }) => {
      if (method === 'post') {
        const { data } = await client.post<Task>('tasks/', payload)
        return data
      }
      if (method === 'patch') {
        const { data } = await client.patch<Task>(`tasks/${id}/`, payload)
        return data
      }
      const { data } = await client.put<Task>(`tasks/${id}/`, payload)
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
      }
    }
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: number) => {
      await client.delete(`tasks/${taskId}/`)
    },
    onSuccess: (_data, taskId) => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    }
  })
}

export const useAssignTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: number; userId: number | null }) => {
      const { data } = await client.post<Task>(`tasks/${taskId}/assign/`, { user_id: userId })
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
    }
  })
}
