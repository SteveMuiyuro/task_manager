import { useState } from "react"
import { Link } from "react-router-dom"
import { AppButton } from "../ui/AppButton"
import { clsx } from "clsx"

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-[#120e2b]/70">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between py-4">
          {/* BRAND */}
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-white"
          >
            TaskManager
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">
            <AppButton
              to="/login"
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              Login
            </AppButton>

            <AppButton to="/register">Register</AppButton>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={clsx(
            "md:hidden flex-col gap-4 pb-6 text-white/80",
            isOpen ? "flex" : "hidden"
          )}
        >
          <div className="flex flex-col gap-3 pt-2">
            <AppButton
              to="/login"
              variant="ghost"
              className="w-full text-white/90 hover:text-white hover:bg-white/10"
            >
              Login
            </AppButton>

            <AppButton to="/register" className="w-full">
              Register
            </AppButton>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default LandingNavbar
