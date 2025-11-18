import { ReactNode, createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'
type Toast= {
  id: number
  message: string
  type: ToastType
}

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 4000)
  }, [])

  return (
 <ToastContext.Provider value={{ pushToast }}>
      {children}

      {/* Bottom Right Position */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-md shadow-lg border 
              bg-white                 toast.type === "success"
                  ? "text-emerald-600"
                  : toast.type === "error"
                  ? "text-rose-600"
                  : "text-slate-600"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>

  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
