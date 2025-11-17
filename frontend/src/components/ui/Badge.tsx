import { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

interface Props extends PropsWithChildren {
  variant?: 'success' | 'warning' | 'danger' | 'info'
}

const variants = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-800',
  info: 'bg-slate-100 text-slate-800'
}

const Badge = ({ children, variant = 'info' }: Props) => (
  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>{children}</span>
)

export default Badge
