import { InputHTMLAttributes } from "react"
import { clsx } from "clsx"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({ label, error, className, ...props }: Props) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
    {label}

    <input
      {...props}
      className={clsx(
        "px-3 py-2 rounded-md border border-slate-300 bg-white",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none",
        "transition-all duration-200",
        className
      )}
    />

    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
)

export default Input
