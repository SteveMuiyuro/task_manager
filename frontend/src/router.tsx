import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/tasks/TasksPage'
import TaskDetailPage from './pages/tasks/TaskDetailPage'
import TaskFormPage from './pages/tasks/TaskFormPage'
import UsersPage from './pages/users/UsersPage'
import LandingPage from './pages/LandingPage'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      {
        path: 'tasks/new',
        element: (
          <ProtectedRoute roles={['ADMIN', 'MANAGER']}>
            <TaskFormPage mode="create" />
          </ProtectedRoute>
        )
      },
      { path: 'tasks/:taskId', element: <TaskDetailPage /> },
      {
        path: 'tasks/:taskId/edit',
        element: (
          <ProtectedRoute roles={['ADMIN', 'MANAGER']}>
            <TaskFormPage mode="edit" />
          </ProtectedRoute>
        )
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <Navigate to="/" /> }
])

export default router
