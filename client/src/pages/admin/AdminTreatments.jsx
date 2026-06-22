import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ChevronRight, Stethoscope } from 'lucide-react'

export default function AdminTreatments() {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/treatments')
      .then(({ data }) => setTreatments(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark font-medium">Treatments</h1>
        <p className="font-sans text-sm text-brand-muted mt-1">
          Manage prices and content for all 8 treatment pages.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {treatments.map(t => (
            <Link
              key={t.slug}
              to={`/admin/treatments/${t.slug}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-brand-green-bg flex items-center justify-center shrink-0">
                <Stethoscope size={14} className="text-brand-green" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-brand-dark">{t.name}</p>
                <p className="font-sans text-xs text-brand-muted mt-0.5">{t.tagline}</p>
              </div>
              <span className="font-sans text-xs font-medium text-brand-gold bg-brand-gold/8 border border-brand-gold/20 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                {t.priceFrom}
              </span>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
