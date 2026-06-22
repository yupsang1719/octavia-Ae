import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import axios from 'axios'
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider'
import FilterTabs from '../components/ui/FilterTabs'
import BookingModal from '../components/ui/BookingModal'
import { useBookingModal } from '../hooks/useBookingModal'
import { SITE_URL } from '../utils/seo'

const FILTERS = ['All','Implants','Bonding','Veneers','Whitening','Invisalign','Aesthetics']

function fade(d=0){return{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.45,delay:d,ease:'easeOut'}}}

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [items, setItems]   = useState([])
  const { isOpen, open, close } = useBookingModal()

  useEffect(() => {
    axios.get('/api/gallery').then(({ data }) => {
      if (Array.isArray(data)) setItems(data)
    }).catch(() => {})
  }, [])

  const displayed = filter === 'All' ? items : items.filter(i => i.treatment?.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <Helmet>
        <title>Before & After Gallery | Octavia Dental & Facial Aesthetics Godalming</title>
        <meta name="description" content="Real patient results from Octavia Dental in Godalming. Before and after photos for dental implants, composite bonding, Invisalign, veneers and more. All images published with patient consent." />
        <link rel="canonical" href={`${SITE_URL}/gallery`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-24">
          <motion.div className="max-w-2xl" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Patient results</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">Real smiles. Real results.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">Every result you see here belongs to a real Octavia Dental patient who has given their written consent for publication.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs — only shown when we have images */}
      {items.length > 0 && (
        <div className="bg-white border-b border-brand-border sticky top-[72px] lg:top-20 z-30">
          <div className="container-wide py-4 overflow-x-auto no-scrollbar">
            <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} />
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-brand-muted">
                {items.length === 0 ? 'Patient results coming soon.' : 'No results in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((item, i) => (
                <motion.div key={item.id || item._id} {...fade(i * 0.05)}>
                  <BeforeAfterSlider
                    beforeSrc={item.beforeImg || item.photo}
                    afterSrc={item.afterImg   || item.photo}
                    beforeAlt={`Before ${item.treatment}`}
                    afterAlt={`After ${item.treatment} at Octavia Dental`}
                  />
                  <p className="text-center text-xs font-sans font-medium text-brand-muted mt-2">{item.treatment}</p>
                </motion.div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <motion.div className="mt-12 text-center space-y-2" {...fade(0.3)}>
              <p className="font-sans text-xs text-brand-subtle max-w-lg mx-auto">
                Results may vary. All before and after images are published with written patient consent in accordance with GDC guidelines. Individual results depend on the patient's starting point, treatment chosen and aftercare.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-green">
        <div className="container-wide text-center">
          <motion.div {...fade(0)}>
            <h2 className="font-serif text-3xl text-white font-medium mb-4">Ready for your own transformation?</h2>
            <p className="font-sans text-white/70 max-w-md mx-auto mb-8">Book a free consultation and let Dr Ali or Dr Ana show you what's possible for your smile.</p>
            <button onClick={() => open()} className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-green font-sans font-medium text-base rounded-full hover:bg-brand-cream transition-all">
              Book free consultation
            </button>
          </motion.div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
