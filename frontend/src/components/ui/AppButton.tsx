import { ButtonHTMLAttributes, ReactNode } from "react"
import { Link, LinkProps } from "react-router-dom"
import { clsx } from "clsx"

type Variant = "primary" | "secondary" | "ghost" | "danger"

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-md transition",
  secondary:
    "bg-slate-200 text-slate-900 hover:bg-slate-300 transition",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 transition",
  danger:
    "bg-red-600 text-white hover:bg-red-700 transition", // ✅ FIXED
}

type BaseProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

type ButtonProps =
  BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }

type LinkButtonProps =
  BaseProps &
  Omit<LinkProps, "className"> & { to: LinkProps["to"] }

type Props = ButtonProps | LinkButtonProps

export const AppButton = ({ className, variant = "primary", children, ...props }: Props) => {
  const classes = clsx(
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium text-sm disabled:opacity-60 disabled:pointer-events-none transition",
    variantStyles[variant],
    className
  )

  // Render as <Link>
  if ("to" in props && props.to !== undefined) {
    const linkProps = props as LinkButtonProps
    return (
      <Link {...linkProps} className={classes}>
        {children}
      </Link>
    )
  }

  // Render as <button>
  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  )
}
