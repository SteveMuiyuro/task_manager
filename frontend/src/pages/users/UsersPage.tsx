import { FormEvent, useState } from "react"
import Card from "../../components/ui/Card"
import{AppButton} from  "../../components/ui/AppButton"
import Input from "../../components/ui/Input"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { useDeleteUser, useUserMutation, useUsers } from "../../hooks/useUsers"
import { ApiUser, Role } from "../../types"
import { useToast } from "../../providers/ToastProvider"
import ConfirmDialog from "../../components/ui/ConfirmDialog"

const defaultForm = {
  username: "",
  email: "",
  password: "",
  role: "MEMBER" as Role
}

const UsersPage = () => {
  const { data: users = [], isLoading } = useUsers()
  const mutation = useUserMutation()
  const deleteMutation = useDeleteUser()

  const [form, setForm] = useState(defaultForm)
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null)

  const { pushToast } = useToast()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (editingUser) {
      await mutation.mutateAsync({
        id: editingUser.id,
        payload: form,
        method: "patch"
      })
      pushToast({ type: "success", message: "User updated" })
    } else {
      await mutation.mutateAsync({ payload: form, method: "post" })
      pushToast({ type: "success", message: "User created" })
    }

    setForm(defaultForm)
    setEditingUser(null)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Users List */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-semibold">Users</h1>

        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 ">
                    {user.role}
                  </span>

                  <button
                    className="text-brand-600 text-sm"
                    onClick={() => {
                      setEditingUser(user)
                      setForm({
                        username: user.username,
                        email: user.email,
                        password: "",
                        role: user.role
                      })
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-rose-600 text-sm"
                    onClick={() => setUserToDelete(user)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create / Edit Form */}
      <div>
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? "Edit user" : "Invite user"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required={!editingUser}
            />

            {/* Role Select (shadcn UI) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700 ">
                Role
              </label>

              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value as Role })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AppButton type="submit" className="w-full">
              {editingUser ? "Save user" : "Create user"}
            </AppButton>

            {editingUser && (
              <AppButton
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setEditingUser(null)
                  setForm(defaultForm)
                }}
              >
                Cancel
              </AppButton>
            )}
          </form>
        </Card>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete user"
        description={`This will permanently remove ${
          userToDelete?.username ?? "this user"
        } and their assignments.`}
        confirmLabel="Delete user"
        onConfirm={async () => {
          if (!userToDelete) return
          await deleteMutation.mutateAsync(userToDelete.id)
          pushToast({ type: "success", message: "User deleted" })
          setUserToDelete(null)
        }}
        onClose={() => setUserToDelete(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default UsersPage
