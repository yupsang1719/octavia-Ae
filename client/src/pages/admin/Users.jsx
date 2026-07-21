import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { formatDateShort } from '../../utils/formatters'

const ROLES = [
  { value: 'manager', label: 'Manager', hint: 'Full access — items, deliveries, transfers, facilities, users' },
  { value: 'staff',   label: 'Staff',   hint: 'Stock view, Count, and Quick Log only' },
]

export default function Users() {
  const { email: myEmail } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    axios.get('/api/admin/users').then(({ data }) => setUsers(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <h1 className="font-serif text-2xl text-brand-dark">Users</h1>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-green/90"
        >
          <Plus size={14} /> New user
        </button>
      </div>
      <p className="text-sm text-brand-muted font-sans mb-6">
        Give the practice manager or a nurse their own login for the staff portal — no need to ask a developer to create accounts.
      </p>

      {adding && <UserForm onSaved={() => { setAdding(false); load() }} onCancel={() => setAdding(false)} />}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-3 py-3 font-medium">Role</th>
                <th className="text-left px-3 py-3 font-medium hidden sm:table-cell">Created</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => {
                const isMe = u.email === myEmail
                return (
                  <Fragment key={u._id}>
                    <tr
                      className={`hover:bg-gray-50 cursor-pointer ${u.active === false ? 'opacity-50' : ''}`}
                      onClick={() => setExpanded(e => e === u._id ? null : u._id)}
                    >
                      <td className="px-4 py-3 font-sans font-medium text-brand-dark">
                        {u.email}{isMe && <span className="ml-2 text-xs text-brand-muted font-normal">(you)</span>}
                        {u.active === false && <span className="ml-2 text-xs text-red-500 font-normal">(disabled)</span>}
                      </td>
                      <td className="px-3 py-3 font-sans capitalize">{u.role || 'manager'}</td>
                      <td className="px-3 py-3 font-sans text-brand-muted hidden sm:table-cell">{formatDateShort(u.createdAt)}</td>
                      <td className="px-3 py-3 text-brand-muted">
                        {expanded === u._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </tr>
                    {expanded === u._id && (
                      <tr>
                        <td colSpan={4} className="px-5 py-5 bg-gray-50 border-t border-gray-100">
                          <UserEditForm user={u} isMe={isMe} onSaved={() => { setExpanded(null); load() }} onCancel={() => setExpanded(null)} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {users.length === 0 && !loading && (
                <tr><td colSpan={4} className="text-center text-brand-muted py-10 font-sans">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-brand-muted">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function UserForm({ onSaved, onCancel }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    try {
      await axios.post('/api/admin/users', { email: email.trim(), password, role })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" required>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="name@octavia-dental.co.uk" />
        </Field>
        <Field label="Temporary password" required>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="At least 8 characters" />
        </Field>
      </div>
      <Field label="Access level">
        <div className="grid sm:grid-cols-2 gap-2">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                role === r.value ? 'border-brand-green bg-brand-green/5' : 'border-gray-200'
              }`}
            >
              <p className="text-sm font-medium text-brand-dark">{r.label}</p>
              <p className="text-xs text-brand-muted mt-0.5">{r.hint}</p>
            </button>
          ))}
        </div>
      </Field>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving || !email.trim() || password.length < 8}
          className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60"
        >
          {saving ? 'Creating…' : 'Create user'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
          Cancel
        </button>
      </div>
    </div>
  )
}

function UserEditForm({ user, isMe, onSaved, onCancel }) {
  const [role, setRole] = useState(user.role || 'manager')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [resetting, setResetting] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [resetDone, setResetDone] = useState(false)

  async function saveRole() {
    setSaving(true)
    setError('')
    try {
      await axios.patch(`/api/admin/users/${user._id}`, { role })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
      setSaving(false)
    }
  }

  async function toggleActive() {
    setSaving(true)
    setError('')
    try {
      await axios.patch(`/api/admin/users/${user._id}`, { active: user.active === false })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
      setSaving(false)
    }
  }

  async function submitReset() {
    setSaving(true)
    setError('')
    try {
      await axios.post(`/api/admin/users/${user._id}/reset-password`, { password: newPassword })
      setResetDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password')
    } finally {
      setSaving(false)
    }
  }

  if (isMe) {
    return (
      <div className="text-sm text-brand-muted font-sans" onClick={e => e.stopPropagation()}>
        This is your own account — role and access changes for your own login aren't made here.
        <button onClick={onCancel} className="ml-3 text-brand-green hover:opacity-80">Close</button>
      </div>
    )
  }

  return (
    <div className="space-y-4" onClick={e => e.stopPropagation()}>
      <Field label="Access level">
        <div className="grid sm:grid-cols-2 gap-2">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-colors bg-white ${
                role === r.value ? 'border-brand-green bg-brand-green/5' : 'border-gray-200'
              }`}
            >
              <p className="text-sm font-medium text-brand-dark">{r.label}</p>
              <p className="text-xs text-brand-muted mt-0.5">{r.hint}</p>
            </button>
          ))}
        </div>
      </Field>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={saveRole} disabled={saving || role === user.role}
            className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save role'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
            Close
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setResetting(v => !v)} className="text-sm text-brand-green hover:opacity-80">
            Reset password
          </button>
          <button onClick={toggleActive} disabled={saving} className="text-sm text-red-500 hover:text-red-700">
            {user.active === false ? 'Reactivate' : 'Disable'}
          </button>
        </div>
      </div>

      {resetting && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          {resetDone ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Password reset. Share it with {user.email} directly — it won't be shown again.
            </p>
          ) : (
            <>
              <Field label="New password" required>
                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="At least 8 characters" />
              </Field>
              <button
                onClick={submitReset} disabled={saving || newPassword.length < 8}
                className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60"
              >
                {saving ? 'Resetting…' : 'Set new password'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
