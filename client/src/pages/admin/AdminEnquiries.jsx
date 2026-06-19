import { useEffect, useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STATUSES = ['all', 'new', 'contacted', 'booked', 'closed']

const STATUS_STYLES = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  booked:    'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-500',
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans ${STATUS_STYLES[status] || STATUS_STYLES.new}`}>
      {status}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AdminEnquiries() {
  const [filter, setFilter] = useState('all')
  const [data, setData] = useState({ enquiries: [], total: 0, pages: 1, page: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: 20 }
    if (filter !== 'all') params.status = filter
    axios.get('/api/enquiries', { params })
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter, page])

  function updateStatus(id, newStatus) {
    axios.patch(`/api/enquiries/${id}`, { status: newStatus })
      .then(({ data: updated }) => {
        setData(prev => ({
          ...prev,
          enquiries: prev.enquiries.map(e => e._id === id ? { ...e, status: updated.status } : e),
        }))
      })
      .catch(console.error)
  }

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-6">Enquiries</h1>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-5 bg-white rounded-lg border border-gray-200 p-1 w-fit flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-md text-sm font-sans capitalize transition-colors ${
              filter === s
                ? 'bg-brand-green text-white'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : data.enquiries.length === 0 ? (
          <p className="text-sm text-brand-muted px-5 py-10 text-center font-sans">No enquiries found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Service</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.enquiries.map(e => (
                <Fragment key={e._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(e._id)}
                  >
                    <td className="px-5 py-3 font-medium text-brand-dark font-sans">{e.name}</td>
                    <td className="px-5 py-3 text-brand-muted hidden md:table-cell font-sans">{e.email}</td>
                    <td className="px-5 py-3 text-brand-muted hidden lg:table-cell font-sans capitalize">{e.service || '—'}</td>
                    <td className="px-5 py-3 text-brand-muted hidden lg:table-cell font-sans">
                      {new Date(e.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-5 py-3 text-brand-muted">
                      {expanded === e._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>

                  {expanded === e._id && (
                    <tr>
                      <td colSpan={6} className="px-5 py-5 bg-gray-50 border-t border-gray-100">
                        <div className="grid sm:grid-cols-2 gap-6 text-sm font-sans">
                          <div className="space-y-1.5">
                            <p><span className="font-medium text-brand-dark">Phone:</span>{' '}
                              {e.phone
                                ? <a href={`tel:${e.phone}`} className="text-brand-green hover:underline">{e.phone}</a>
                                : <span className="text-brand-muted">—</span>
                              }
                            </p>
                            <p><span className="font-medium text-brand-dark">Location:</span>{' '}
                              <span className="text-brand-muted">{e.location || '—'}</span>
                            </p>
                            <p><span className="font-medium text-brand-dark">Source:</span>{' '}
                              <span className="text-brand-muted">{e.source || '—'}</span>
                            </p>
                            {e.message && (
                              <p className="mt-3 text-brand-muted leading-relaxed border-l-2 border-brand-gold pl-3 italic">
                                "{e.message}"
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-brand-dark mb-3">Update status</p>
                            <div className="flex flex-wrap gap-2">
                              {['new', 'contacted', 'booked', 'closed'].map(s => (
                                <button
                                  key={s}
                                  onClick={ev => { ev.stopPropagation(); updateStatus(e._id, s) }}
                                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
                                    e.status === s
                                      ? 'bg-brand-green text-white border-brand-green'
                                      : 'border-gray-300 text-brand-muted hover:border-brand-green hover:text-brand-green'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-brand-muted font-sans">
          <span>Page {data.page} of {data.pages} ({data.total} total)</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              Prev
            </button>
            <button
              disabled={page === data.pages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:border-gray-400 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
