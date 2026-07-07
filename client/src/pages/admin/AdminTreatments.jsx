import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PlusCircle, Eye, EyeOff, Edit2, Trash2, Stethoscope, X } from 'lucide-react'

function AddTreatmentModal({ onClose, onCreated }) {
  const [name, setName]   = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.post('/api/treatments', { name: name.trim() })
      onCreated(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create treatment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-gray-900">Add treatment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Treatment name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Dental Implants"
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <p className="mt-1 text-xs text-gray-400">Slug is auto-generated. You can edit all content after creating.</p>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || !name.trim()}
              className="flex-1 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'Creating…' : 'Create & edit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminTreatments() {
  const navigate = useNavigate()
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [showAdd, setShowAdd]       = useState(false)

  const fetchTreatments = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/treatments/admin/all')
      setTreatments(data)
    } catch {
      setError('Failed to load treatments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTreatments() }, [fetchTreatments])

  async function togglePublished(t) {
    try {
      const { data } = await axios.patch(`/api/treatments/${t.slug}`, { published: !t.published })
      setTreatments(prev => prev.map(x => x.slug === t.slug ? { ...x, published: data.published } : x))
    } catch {
      setError('Failed to update treatment')
    }
  }

  async function deleteTreatment(t) {
    if (!window.confirm(`Delete "${t.name}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/treatments/${t.slug}`)
      setTreatments(prev => prev.filter(x => x.slug !== t.slug))
    } catch {
      setError('Failed to delete treatment')
    }
  }

  function handleCreated(treatment) {
    setShowAdd(false)
    navigate(`/admin/treatments/${treatment.slug}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark font-medium">Treatments</h1>
          <p className="font-sans text-sm text-brand-muted mt-1">
            Manage treatment pages for this practice.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={16} />
          Add treatment
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : treatments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Stethoscope size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No treatments yet. Add your first one.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Treatment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {treatments.map(t => (
                <tr key={t.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/treatments/{t.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.priceFrom || '—'}</td>
                  <td className="px-4 py-3">
                    {t.published ? (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Live</span>
                    ) : (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => togglePublished(t)}
                        title={t.published ? 'Unpublish' : 'Publish'}
                        className={`p-1.5 transition-colors ${t.published ? 'text-gray-400 hover:text-yellow-500' : 'text-yellow-500 hover:text-green-600'}`}
                      >
                        {t.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        to={`/admin/treatments/${t.slug}`}
                        title="Edit"
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => deleteTreatment(t)}
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

      {showAdd && <AddTreatmentModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />}
    </div>
  )
}
