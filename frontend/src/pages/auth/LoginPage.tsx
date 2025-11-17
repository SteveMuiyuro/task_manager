import { FormEvent, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Input from "../../components/ui/Input"
import { AppButton } from "../../components/ui/AppButton"
import { useToast } from "../../providers/ToastProvider"

const LoginPage = () => {
  const { login } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation() as any

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(credentials)
      pushToast({ type: "success", message: "Signed in successfully" })

      navigate(location.state?.from?.pathname || "/app")
    } catch {
      setError("Invalid credentials")
      pushToast({ type: "error", message: "Invalid credentials" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>

        <Input
          label="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
        />

        <Input
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AppButton type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </AppButton>

        <p className="text-sm text-center text-slate-500">
          Need an account?{" "}
          <Link to="/register" className="text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
