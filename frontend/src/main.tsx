import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './router'
import './styles/index.css'

import { ToastProvider } from './providers/ToastProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={AppRouter} />
        </QueryClientProvider>   
    </ToastProvider>
  </React.StrictMode>
)
