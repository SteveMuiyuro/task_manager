export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER'

export type ApiUser = {
  id: number
  username: string
  email: string
  role: Role
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'

export type  Task  = {
  id: number
  url?: string
  title: string
  description: string
  status: TaskStatus
  due_date?: string | null
  priority: number
  assigned_to?: ApiUser | null
  created_by: ApiUser
  created_at: string
  updated_at: string
}

export type PaginatedResponse<T>  = {
  count: number
  next?: string | null
  previous?: string | null
  results: T[]
}
