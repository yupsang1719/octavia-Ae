import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Pencil, Trash2, Lock, Mail } from 'lucide-react'

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading]     = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/email-templates')
      .then(({ data }) => setTemplates(data))
      .finally(() => setLoading(false))
  }, [])

  async function remove(t) {
    if (!window.confirm(`Delete "${t.name}"?`)) return
    await axios.delete(`/api/email-templates/${t._id}`)
    setTemplates(prev => prev.filter(x => x._id !== t._id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const TYPE_LABEL = { review_request: 'Review Request', marketing: 'Marketing' }
  const TYPE_COLOR = { review_request: 'bg-amber-50 text-amber-700', marketing: 'bg-blue-50 text-blue-700' }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">Email Templates</h1>
          <p className="text-sm text-brand-muted font-sans mt-0.5">
            Reusable email templates with merge tags like <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{'{{firstName}}'}</code>
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/email-templates/new')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors"
        >
          <Plus size={15} /> New template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {templates.length === 0 ? (
          <p className="text-sm text-brand-muted text-center py-12 font-sans">No templates yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-brand-muted uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Subject</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map(t => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-sans font-medium text-brand-dark">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-brand-muted flex-shrink-0" />
                      {t.name}
                      {t.isDefault && <Lock size={11} className="text-brand-subtle" title="Default — cannot be deleted" />}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-brand-muted hidden sm:table-cell font-sans max-w-[200px] truncate">
                    {t.subject}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium font-sans ${TYPE_COLOR[t.type] || 'bg-gray-100 text-gray-600'}`}>
                      {TYPE_LABEL[t.type] || t.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => navigate(`/admin/email-templates/${t._id}`)}
                        className="p-1.5 rounded hover:bg-gray-100 text-brand-muted transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      {!t.isDefault && (
                        <button
                          onClick={() => remove(t)}
                          className="p-1.5 rounded hover:bg-red-50 text-brand-subtle hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Merge tag reference */}
      <div className="mt-5 bg-gray-50 rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest font-sans mb-3">Available merge tags</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            ['{{firstName}}', 'Patient first name'],
            ['{{name}}',      'Patient full name'],
            ['{{treatment}}', 'Treatment name'],
            ['{{clinician}}', 'Clinician name'],
            ['{{practiceName}}', 'Practice name'],
            ['{{phone}}',     'Practice phone'],
          ].map(([tag, desc]) => (
            <div key={tag} className="flex flex-col">
              <code className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-brand-green font-mono">{tag}</code>
              <span className="text-xs text-brand-subtle mt-0.5 font-sans">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
