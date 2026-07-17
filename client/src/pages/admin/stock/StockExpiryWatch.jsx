import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatDateShort } from '../../../utils/formatters'

const FLAG_STYLES = {
  EXPIRED:      'bg-red-100 text-red-700',
  EXPIRED_SOON: 'bg-red-100 text-red-700',
  WATCH:        'bg-amber-100 text-amber-700',
  OK:           'bg-gray-100 text-gray-500',
}

const FLAG_LABELS = {
  EXPIRED:      'Expired',
  EXPIRED_SOON: 'Expiring soon',
  WATCH:        'Watch',
  OK:           'OK',
}

export default function StockExpiryWatch() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/stock/expiry').then(({ data }) => setRows(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-2">Expiry Watch</h1>
      <p className="text-sm text-brand-muted font-sans mb-6">
        A rotation prompt only — this tracks expiry by delivery batch, not remaining quantity per batch.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-left px-3 py-3 font-medium">Batch</th>
                <th className="text-left px-3 py-3 font-medium">Expiry</th>
                <th className="text-right px-3 py-3 font-medium">Days</th>
                <th className="text-left px-4 py-3 font-medium">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-sans">
                    <p className="font-medium text-brand-dark">{r.itemId?.name}</p>
                    <p className="text-xs text-brand-muted">{r.itemId?.sku}</p>
                  </td>
                  <td className="px-3 py-3 font-sans text-brand-muted">{r.batchNo || '—'}</td>
                  <td className="px-3 py-3 font-sans">{formatDateShort(r.expiryDate)}</td>
                  <td className="text-right px-3 py-3 font-sans">{r.daysToExpiry}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans ${FLAG_STYLES[r.flag]}`}>
                      {FLAG_LABELS[r.flag]}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center text-brand-muted py-10 font-sans">No batches with expiry dates recorded.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
