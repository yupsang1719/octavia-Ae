import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import BookingModal from '../components/ui/BookingModal'
import { useBookingModal } from '../hooks/useBookingModal'
import { usePractice } from '../contexts/PracticeContext'
import { SITE_URL } from '../utils/seo'

function PriceTable({ category, items, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.2), ease: 'easeOut' }}
    >
      <h2 className="font-serif text-2xl text-brand-dark font-medium mb-4">{category}</h2>
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-cream">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 font-sans text-[11px] uppercase tracking-widest text-brand-muted font-semibold">Treatment</th>
              <th scope="col" className="px-4 sm:px-6 py-3 font-sans text-[11px] uppercase tracking-widest text-brand-muted font-semibold text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {items.map((item, i) => (
              <tr key={i} className="align-top">
                <td className="px-4 sm:px-6 py-4">
                  {item.href ? (
                    <Link to={item.href} className="group inline-flex items-center gap-1.5 font-sans text-[15px] font-medium text-brand-dark hover:text-brand-green transition-colors">
                      {item.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ) : (
                    <span className="font-sans text-[15px] font-medium text-brand-dark">{item.name}</span>
                  )}
                  {item.note && <p className="font-sans text-sm text-brand-muted mt-1 leading-relaxed">{item.note}</p>}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right font-sans text-[15px] text-brand-dark tabular-nums whitespace-nowrap">
                  {item.price || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  )
}

export default function PriceList() {
  const { name, metaTitle, bookingLabel } = usePractice()
  const { isOpen, open, close } = useBookingModal()
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    axios.get('/api/settings/price-list')
      .then(({ data }) => setCategories(Array.isArray(data) ? data.filter(c => c.items?.length) : []))
      .catch(() => setCategories([]))
  }, [])

  const desc = `Treatment prices at ${name}: general and cosmetic dentistry, implants, restorative care and more.`

  return (
    <>
      <Helmet>
        <title>Price List | {metaTitle}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE_URL}/prices`} />
        <meta property="og:title"       content={`Price List | ${name}`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url"         content={`${SITE_URL}/prices`} />
        <meta name="twitter:card"       content="summary_large_image" />
      </Helmet>

      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-24">
          <motion.div className="max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Price list</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white font-medium leading-[1.08] mb-4">Our prices.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">
              Clear prices for every treatment we offer. Your exact cost is confirmed at your consultation, before any treatment begins.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide max-w-4xl">
          {categories === null ? (
            <div className="flex justify-center py-16">
              <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="font-sans text-brand-muted text-center py-16">Our price list is being updated. Please get in touch for current prices.</p>
          ) : (
            <div className="space-y-12">
              {categories.map((c, i) => <PriceTable key={c.category} category={c.category} items={c.items} index={i} />)}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="font-sans text-sm text-brand-muted max-w-md leading-relaxed">
              Prices are a guide and start from the amount shown. Individual results may vary.
            </p>
            <button onClick={() => open()} className="btn-primary text-sm inline-flex items-center gap-2 self-start sm:self-auto">
              {bookingLabel || 'Book an appointment'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
