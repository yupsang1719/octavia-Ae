import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Edit2, CheckCircle } from 'lucide-react'

export default function AdminNHSBands() {
  const [bands, setBands]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/treatments/admin/nhs-bands')
      .then(({ data }) => setBands(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">NHS Treatment Bands</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit band prices, covered treatments and FAQ. Prices are set by the government and change each April.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : bands.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          No NHS bands found in the database. Run <code className="font-mono bg-yellow-100 px-1 rounded">node server/scripts/seedNHSBands.js</code> on the server to seed them.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {bands.map(band => (
            <div key={band.slug} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{band.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {band.priceFrom ? `Current price: ${band.priceFrom}` : 'No price set'}
                    {!band.published && <span className="ml-2 text-yellow-600 font-medium">· Draft</span>}
                  </p>
                </div>
              </div>
              <Link
                to={`/admin/treatments/${band.slug}`}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-green hover:text-brand-dark transition-colors px-3 py-1.5 border border-brand-green/30 rounded-full hover:bg-brand-green/5"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        To update a band price: click Edit → update the <strong>Price from</strong> field → Save.
        The website will reflect the new price immediately.
      </p>
    </div>
  )
}
