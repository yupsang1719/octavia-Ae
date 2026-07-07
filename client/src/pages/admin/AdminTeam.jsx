import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Users, GripVertical } from 'lucide-react'
import { usePractice } from '../../contexts/PracticeContext'

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
  const { slug: selectedSlug } = usePractice()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const dragIdx = useRef(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/admin/team')
      setMembers(data)
    } catch {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers, selectedSlug])

  function handleDragStart(i) { dragIdx.current = i }
  function handleDragOver(e) { e.preventDefault() }
  function handleDrop(i) {
    const from = dragIdx.current
    if (from === null || from === i) return
    const next = [...members]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setMembers(next)
    dragIdx.current = null
    axios.patch('/api/team/reorder', { ids: next.map(m => m._id) }).catch(() => {})
  }

  async function toggleVisibility(member) {
    const isHidden = member.hiddenInPractices?.includes(selectedSlug)
    try {
      const { data } = await axios.patch(`/api/team/${member._id}/visibility`, { visible: isHidden })
      setMembers(prev => prev.map(m => m._id === member._id ? data : m))
    } catch {
      setError('Failed to update visibility')
    }
  }

  async function deleteMember(member) {
    const isShared = member.practices?.length > 1
    const msg = isShared
      ? `Remove ${member.name} from this practice? They will remain on other practice sites.`
      : `Permanently delete ${member.name}? This cannot be undone.`
    if (!window.confirm(msg)) return
    try {
      await axios.delete(`/api/team/${member._id}`)
      setMembers(prev => prev.filter(m => m._id !== member._id))
    } catch {
      setError('Failed to delete member')
    }
  }

  const visible = filter ? members.filter(m => m.category === filter) : members

  function statusBadge(member) {
    if (!member.published) {
      return <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">Draft</span>
    }
    if (member.hiddenInPractices?.includes(selectedSlug)) {
      return <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">Hidden here</span>
    }
    return <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Visible</span>
  }

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
          <p className="text-sm">No team members for this practice yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-2 py-3" />
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Visibility</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Practices</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((member, i) => {
                const isHidden = member.hiddenInPractices?.includes(selectedSlug)
                const isShared = member.practices?.length > 1
                return (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50 transition-colors"
                    draggable={!filter}
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(i)}
                  >
                    <td className={`px-2 py-3 text-gray-300 ${!filter ? 'cursor-grab active:cursor-grabbing hover:text-gray-400' : 'opacity-30'}`}>
                      <GripVertical size={16} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {member.name}
                      {member.hasPage && (
                        <a
                          href={`/our-team/${member.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-xs text-brand-green hover:underline"
                        >
                          view ↗
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{member.role}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                        {CATEGORY_LABELS[member.category] || member.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(member)}</td>
                    <td className="px-4 py-3">
                      {isShared ? (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {member.practices.length} sites
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">This site only</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {member.published && (
                          <button
                            onClick={() => toggleVisibility(member)}
                            title={isHidden ? 'Show on this site' : 'Hide from this site'}
                            className={`p-1.5 transition-colors ${isHidden ? 'text-yellow-500 hover:text-green-600' : 'text-gray-400 hover:text-yellow-500'}`}
                          >
                            {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/team/${member._id}`)}
                          title="Edit"
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteMember(member)}
                          title={isShared ? 'Remove from this practice' : 'Delete'}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!filter && (
            <p className="px-4 py-2.5 text-xs text-gray-400 border-t border-gray-100">
              Drag rows to reorder — order determines how members appear on the public site.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
