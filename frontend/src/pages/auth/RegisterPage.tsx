import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Input from "../../components/ui/Input"
import { AppButton } from "../../components/ui/AppButton"
import { useToast } from "../../providers/ToastProvider"

const RegisterPage = () => {
  const { register } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await register(form)
      setMessage("Account created. Please login.")
      pushToast({ type: "success", message: "Account created" })

      setTimeout(() => navigate("/login"), 1000)
    } catch {
      setMessage("Unable to register user.")
      pushToast({ type: "error", message: "Unable to register user" })
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
        <h1 className="text-2xl font-semibold text-center">Create account</h1>

        <Input
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {message && (
          <p className="text-sm text-brand-600 text-center">{message}</p>
        )}

        <AppButton type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Register"}
        </AppButton>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
