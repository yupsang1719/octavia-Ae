import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Users } from 'lucide-react'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'hygienist', label: 'Hygienist' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'nurse', label: 'Dental Nurse' },
  { value: 'trainee-nurse', label: 'Trainee Nurse' },
  { value: 'practice-manager', label: 'Practice Manager' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
]

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.slice(1).map(c => [c.value, c.label]))

export default function AdminTeam() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    try {
      const { data } = await axios.get('/api/admin/team')
      setMembers(data)
    } catch {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  async function togglePublished(member) {
    try {
      await axios.patch(`/api/team/${member._id}`, { published: !member.published })
      setMembers(prev => prev.map(m => m._id === member._id ? { ...m, published: !m.published } : m))
    } catch {
      setError('Failed to update member')
    }
  }

  async function deleteMember(member) {
    if (!window.confirm(`Delete ${member.name}? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/team/${member._id}`)
      setMembers(prev => prev.filter(m => m._id !== member._id))
    } catch {
      setError('Failed to delete member')
    }
  }

  const visible = filter ? members.filter(m => m.category === filter) : members

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
        <button
          onClick={() => navigate('/admin/team/new')}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={16} />
          Add Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat.value
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No team members yet. Add your first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(member => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {member.name}
                    {member.hasPage && (
                      <a
                        href={`/our-team/${member.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-xs text-brand-green hover:underline"
                      >
                        view page ↗
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{member.role}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {CATEGORY_LABELS[member.category] || member.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      member.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {member.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublished(member)}
                        title={member.published ? 'Hide' : 'Publish'}
                        className="p-1.5 text-gray-400 hover:text-brand-green transition-colors"
                      >
                        {member.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/team/${member._id}`)}
                        title="Edit"
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => deleteMember(member)}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
