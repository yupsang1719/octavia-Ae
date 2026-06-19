import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Inbox, FileText, TrendingUp, AlertCircle } from 'lucide-react'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    new:       'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    booked:    'bg-green-100 text-green-700',
    closed:    'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans ${styles[status] || styles.new}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/dashboard'),
      axios.get('/api/enquiries', { params: { limit: 5 } }),
    ])
      .then(([{ data: s }, { data: r }]) => {
        setStats(s)
        setRecent(r.enquiries || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Total Enquiries', value: stats.totalEnquiries,  icon: Inbox,        color: 'bg-blue-50 text-blue-600' },
    { label: 'New (unread)',    value: stats.newEnquiries,    icon: AlertCircle,  color: 'bg-amber-50 text-amber-600' },
    { label: 'Blog Posts',      value: stats.totalPosts,      icon: FileText,     color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Published',       value: stats.publishedPosts,  icon: TrendingUp,   color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={18} strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-semibold text-brand-dark tabular-nums">{c.value ?? '—'}</p>
            <p className="text-xs text-brand-muted mt-0.5 font-sans">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-sans font-semibold text-brand-dark text-sm">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-xs text-brand-green hover:underline font-sans">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-brand-muted px-5 py-8 text-center font-sans">No enquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Service</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map(e => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-brand-dark font-sans">{e.name}</td>
                  <td className="px-5 py-3 text-brand-muted hidden sm:table-cell font-sans capitalize">{e.service || '—'}</td>
                  <td className="px-5 py-3 text-brand-muted hidden md:table-cell font-sans">
                    {new Date(e.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
