import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import TeamCard from '../../components/ui/TeamCard'
import BookingModal from '../../components/ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { SITE_URL } from '../../utils/seo'

function fade(d=0){return{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.45,delay:d,ease:'easeOut'}}}

const treatments = [
  { name:'Botox & Anti-Wrinkle Injections', desc:'Softens frown lines, forehead lines and crow\'s feet with precision injections from Dr Ana.', href:'/treatments/botox-anti-wrinkle', from:'£200' },
]
const benefits = [
  'Administered by a GDC-registered dentist with deep facial anatomy training',
  'Natural-looking results — never overdone',
  'Full consultation and assessment before every treatment',
  'Prescription-compliant — anti-wrinkle treatments are prescription-only medicines',
  'No downtime — return to normal activities immediately',
  'Combines naturally with cosmetic dental treatments for a complete refresh',
]

export default function FacialAesthetics() {
  const { isOpen, open, close } = useBookingModal()
  const [drAna, setDrAna] = useState(null)
  useEffect(() => {
    axios.get('/api/team/dr-ana').then(({ data }) => setDrAna(data)).catch(() => {})
  }, [])
  return (
    <>
      <Helmet>
        <title>Facial Aesthetics Godalming Surrey | Botox | Octavia Dental</title>
        <meta name="description" content="Facial aesthetics treatments in Godalming by dentist-trained Dr Ana. Anti-wrinkle injections, Botox. Safer and more precise than beauty salons. Free consultation." />
        <link rel="canonical" href={`${SITE_URL}/facial-aesthetics`} />
      </Helmet>

      <section className="bg-brand-dark pt-16">
        <div className="container-wide py-20 lg:py-28">
          <motion.div className="max-w-2xl" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Facial aesthetics</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">Precision aesthetics. Delivered by a dental specialist.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed mb-8">Dr Ana is a GDC-registered dentist with advanced training in facial aesthetics. Her deep understanding of facial anatomy delivers results that most non-medical practitioners cannot match.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => open()} className="btn-primary px-8 py-4 text-base">Book free consultation</button>
              <a href="tel:01483860020" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-base rounded-sm hover:bg-white/10 transition-all">01483 860020</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Treatments */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-10" {...fade(0)}>Aesthetic treatments</motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {treatments.map((t, i) => (
              <motion.div key={t.name} {...fade(i * 0.08)}>
                <Link to={t.href} className="group block bg-brand-cream border border-brand-border rounded-sm p-6 hover:shadow-md hover:border-brand-green/30 transition-all duration-300">
                  <h3 className="font-serif text-lg text-brand-dark font-medium mb-2 group-hover:text-brand-green transition-colors">{t.name}</h3>
                  <p className="font-sans text-sm text-brand-muted leading-relaxed mb-4">{t.desc}</p>
                  <p className="font-sans text-xs text-brand-subtle">From <span className="font-medium text-brand-green">{t.from}</span></p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why dentist */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade(0)}>
              <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Why a dentist?</p>
              <h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-6 leading-tight">Safer, more precise — every time.</h2>
              <p className="font-sans text-brand-muted leading-relaxed mb-6">Dentists train for years in the anatomy of the face — muscles, nerves, vasculature and bone — as part of their core qualification. This is knowledge that beauty therapists and many aesthetic practitioners simply do not have. When it comes to injecting into the face, that difference matters profoundly.</p>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" /><span className="font-sans text-sm text-brand-muted leading-relaxed">{b}</span></li>
                ))}
              </ul>
            </motion.div>
            {drAna && (
              <motion.div {...fade(0.15)}><TeamCard member={drAna} /></motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Rx note */}
      <div className="container-wide pb-8">
        <p className="font-sans text-xs text-brand-subtle bg-brand-green-bg border border-brand-green/20 rounded-sm px-4 py-3 max-w-3xl">
          <strong className="text-brand-green">Prescription notice:</strong> Anti-wrinkle treatments are prescription-only medicines. A full consultation and clinical assessment is carried out prior to every treatment in accordance with GDC and NHS guidance.
        </p>
      </div>

      <section className="section-padding bg-brand-green">
        <div className="container-wide text-center">
          <motion.div {...fade(0)}>
            <h2 className="font-serif text-3xl text-white font-medium mb-4">Book your facial aesthetics consultation</h2>
            <p className="font-sans text-white/70 max-w-md mx-auto mb-8">Free consultation with Dr Ana — she will assess your concerns and explain what treatment can realistically achieve for you.</p>
            <button onClick={() => open()} className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-green font-sans font-medium text-base rounded-sm hover:bg-brand-cream transition-all">Book free consultation</button>
          </motion.div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} defaultService="botox" />
    </>
  )
}
