import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useBookingModal } from '../../hooks/useBookingModal'
import BookingModal from '../ui/BookingModal'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'
import { usePractice } from '../../contexts/PracticeContext'

const PRIVATE_USPS = [
  {
    num:   '01',
    title: 'No waiting list',
    body:  'We accept new patients immediately. Call today, be seen this week — no NHS referral, no 18-month queue.',
  },
  {
    num:   '02',
    title: 'Specialist dentists',
    body:  'Dr Ali is our implant specialist; Dr Ana leads cosmetic and facial aesthetics. You see the expert for your treatment.',
  },
  {
    num:   '03',
    title: 'Free consultations',
    body:  'All new patients receive a complimentary consultation so you can understand your options before spending a penny.',
  },
]

const MIXED_USPS = [
  {
    num:   '01',
    title: 'NHS & private care',
    body:  'We offer both NHS and private dental care. New NHS patients are welcome — no long waits to register.',
  },
  {
    num:   '02',
    title: 'Family practice since 2003',
    body:  'A small, family-oriented practice with experienced dentists who take the time to know each patient properly.',
  },
  {
    num:   '03',
    title: 'Prevention first',
    body:  'Our philosophy: prevent problems before they start. We believe great oral health, maintained well, lasts a lifetime.',
  },
]

const NHS_BANDS = [
  { band: 'Band 1', price: '£26.80', includes: 'Check-up, X-rays, scale & polish' },
  { band: 'Band 2', price: '£73.50', includes: 'Fillings, extractions, root canal' },
  { band: 'Band 3', price: '£319.10', includes: 'Crowns, dentures, bridges' },
]

function PrivateCard() {
  return (
    <div className="relative bg-brand-green rounded-2xl p-8 lg:p-10 text-white overflow-hidden">
      <motion.div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/6"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full border border-white/4"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />
      <span className="block w-8 h-0.5 bg-brand-gold mb-5 relative z-10" />
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/45 font-medium mb-4 relative z-10">
        NHS alternative
      </p>
      <h3 className="font-serif text-2xl lg:text-3xl font-medium mb-4 leading-snug tracking-tight relative z-10">
        Can't get an NHS dentist in Surrey or Hampshire?
      </h3>
      <p className="font-sans text-[14px] text-white/70 leading-relaxed mb-6 relative z-10">
        82% of new patients in Surrey are unable to register with an NHS dentist. At Octavia Dental, we accept new patients{' '}
        <strong className="text-white font-semibold">immediately</strong> — no referral needed, no waiting list, no compromise on quality.
      </p>
      <ul className="space-y-2.5 mb-8 relative z-10">
        {['Petersfield', 'Alton', 'Liphook', 'Farnham', 'Guildford'].map((town, i) => (
          <motion.li
            key={town}
            className="flex items-center gap-3 font-sans text-sm text-white/75"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
          >
            <span className="w-1 h-1 rounded-full bg-brand-gold flex-shrink-0" />
            Serving patients from {town}
          </motion.li>
        ))}
      </ul>
      <Link
        to="/nhs-alternative-surrey"
        className="inline-flex items-center gap-2 font-sans text-sm font-medium text-brand-gold hover:text-white transition-colors duration-200 group relative z-10"
      >
        Find out more
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </Link>
    </div>
  )
}

function NHSPricingCard() {
  return (
    <div className="relative bg-brand-green rounded-2xl p-8 lg:p-10 text-white overflow-hidden">
      <motion.div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/6"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full border border-white/4"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      />
      <span className="block w-8 h-0.5 bg-brand-gold mb-5 relative z-10" />
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/45 font-medium mb-3 relative z-10">
        NHS charges 2024/25
      </p>
      <h3 className="font-serif text-2xl lg:text-3xl font-medium mb-6 leading-snug tracking-tight relative z-10">
        Transparent NHS pricing.
      </h3>
      <div className="space-y-0 relative z-10 mb-6">
        {NHS_BANDS.map((b, i) => (
          <motion.div
            key={b.band}
            className="flex items-center justify-between gap-4 py-3.5 border-b border-white/10 last:border-0"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
          >
            <div>
              <p className="font-sans text-sm font-semibold text-white">{b.band}</p>
              <p className="font-sans text-xs text-white/55 mt-0.5">{b.includes}</p>
            </div>
            <p className="font-serif text-xl text-brand-gold font-medium whitespace-nowrap">{b.price}</p>
          </motion.div>
        ))}
      </div>
      <p className="font-sans text-xs text-white/40 relative z-10">
        Children under 18 are treated free on the NHS. Emergency: call before 9 am or dial 111.
      </p>
    </div>
  )
}

export default function USPSection() {
  const { isOpen, open, close } = useBookingModal()
  const { type } = usePractice()

  const isPrivate = type === 'private'
  const usps = isPrivate ? PRIVATE_USPS : MIXED_USPS

  return (
    <>
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

            {/* Left — USP list */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <span className="section-label">Why choose us</span>
              </motion.div>
              <GoldRule delay={0.2} />
              <AnimatedHeading
                as="h2"
                className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium mb-12 leading-tight tracking-tight"
                delay={0.15}
              >
                {isPrivate ? 'Private care done properly.' : 'Quality, affordable dentistry.'}
              </AnimatedHeading>

              <div className="space-y-10">
                {usps.map((usp, i) => (
                  <motion.div
                    key={usp.title}
                    className="flex gap-6"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="font-serif text-xs font-medium text-brand-gold/60 tracking-widest flex-shrink-0 mt-1 w-6">
                      {usp.num}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-brand-dark font-medium mb-2 tracking-tight">{usp.title}</h3>
                      <p className="font-sans text-[14px] text-brand-muted leading-relaxed">{usp.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5, ease: 'easeOut' }}
              >
                <motion.button
                  onClick={() => open()}
                  className="btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isPrivate ? 'Book free consultation' : 'Request appointment'}
                </motion.button>
              </motion.div>
            </div>

            {/* Right — card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {isPrivate ? <PrivateCard /> : <NHSPricingCard />}
            </motion.div>

          </div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
