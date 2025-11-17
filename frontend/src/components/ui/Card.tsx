import { KeyboardEvent, PropsWithChildren } from "react"
import { cn } from "../../lib/utils"

type CardProps = PropsWithChildren<{
  onClick?: () => void
  className?: string
}>

const Card = ({ children, onClick, className }: CardProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick()
    }
  }

  const isInteractive = Boolean(onClick)

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 p-4",
        isInteractive &&
          "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
