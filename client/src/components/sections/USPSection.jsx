import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useBookingModal } from '../../hooks/useBookingModal'
import BookingModal from '../ui/BookingModal'
import GoldRule from '../ui/GoldRule'
import { usePractice } from '../../contexts/PracticeContext'

const PRIVATE_USPS = [
  {
    num:   '01',
    title: 'No waiting list',
    body:  'New patients are seen within days, not months. Call today, be seen this week — no NHS referral, no lengthy queue, no compromise on timing.',
    detail: 'Most private dental practices still have weeks of backlog. At Octavia, we hold capacity for new patients every single week. If you call before midday, we will almost always offer you an appointment within 48 hours.',
  },
  {
    num:   '02',
    title: 'Specialist dentists',
    body:  'Dr Ali leads all implant and complex restorative cases. Dr Ana specialises in cosmetic dentistry and facial aesthetics. You see the expert for your treatment — every time.',
    detail: 'Generalist dentists refer complex work outward. Our specialists handle it in-house. That means faster treatment, better continuity of care, and outcomes that rival central London clinics — without the London prices or travel.',
  },
  {
    num:   '03',
    title: 'Free initial consultation',
    body:  'Every new patient receives a complimentary consultation. We assess your teeth, explain your options and give you a transparent quote — before you commit to anything.',
    detail: 'We never pressure patients into treatment. The consultation is a genuine conversation: what you want, what we see, and what we recommend — in that order. Most patients tell us it is the first time a dentist has actually listened.',
  },
  {
    num:   '04',
    title: 'Transparent pricing',
    body:  'Every treatment has a clear, fixed price confirmed before we begin. No surprises, no hidden extras. Payment plans are available for larger treatments.',
    detail: 'We publish our prices and we stick to them. If anything changes during treatment, we tell you before we proceed — never after. Finance is available through our payment plan for treatments over £500, spreading the cost interest-free.',
  },
]

const NHS_USPS = [
  {
    num:   '01',
    title: 'NHS & private care',
    body:  'We offer both NHS and private dental care. NHS patients are welcome — contact us to join the waiting list. Private care is available without a wait.',
    detail: 'We believe everyone deserves access to good dental care. Our NHS provision covers the full range of NHS treatments at the government-set band charges. For patients who want faster access or more extensive options, private care is available alongside, with no obligation.',
  },
  {
    num:   '02',
    title: 'Family practice since 2003',
    body:  'A small, family-oriented practice with experienced dentists who take the time to know each patient. We are not a chain — we are a team.',
    detail: 'Many of our patients have been with us for over a decade. Our dentists know their patients by name, remember their history, and treat every appointment as a continuation of a relationship — not a transaction. That continuity of care makes a genuine difference to outcomes.',
  },
  {
    num:   '03',
    title: 'Prevention first',
    body:  'Our philosophy: prevent problems before they start. Great oral health, maintained consistently, lasts a lifetime — and we help you get there.',
    detail: 'Too many dental practices focus on fixing problems. We focus on stopping them from developing. Our hygiene appointments, preventative advice and recall system are designed to keep your teeth healthy for life — which is better for you and ultimately costs less.',
  },
  {
    num:   '04',
    title: 'CQC registered',
    body:  'We are registered with the Care Quality Commission. All clinicians hold current GDC registration. You are in safe, accountable hands.',
    detail: 'Our CQC registration means we are subject to rigorous standards of safety, cleanliness and clinical governance. Every dentist\'s GDC number is available on request. We take our regulatory responsibilities seriously — because our patients deserve nothing less.',
  },
]

export default function USPSection() {
  const [active, setActive] = useState(0)
  const { isOpen, open, close } = useBookingModal()
  const { type, bookingLabel } = usePractice()
  const isPrivate = type === 'private'
  const usps = isPrivate ? PRIVATE_USPS : NHS_USPS

  return (
    <>
      <section className="section-padding bg-brand-cream overflow-hidden">
        <div className="container-wide">

          {/* Header */}
          <div className="mb-14">
            <motion.span
              className="section-label"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Why choose us
            </motion.span>
            <GoldRule delay={0.15} />
            <motion.h2
              className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight tracking-tight max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {isPrivate ? 'Private care done properly.' : 'Quality, affordable dentistry.'}
            </motion.h2>
          </div>

          {/* Interactive panel */}
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-start">

            {/* Left — selectable list */}
            <div className="flex flex-col">
              {usps.map((usp, i) => (
                <motion.button
                  key={usp.num}
                  onClick={() => setActive(i)}
                  className={`group relative text-left py-6 border-b border-brand-border/60 transition-colors duration-200 ${active === i ? 'border-brand-gold/40' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Active gold left bar */}
                  <motion.span
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-gold origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: active === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className="flex items-start gap-5 pl-4">
                    <span className={`font-serif text-xs tracking-widest flex-shrink-0 mt-1 transition-colors duration-200 ${active === i ? 'text-brand-gold' : 'text-brand-gold/30'}`}>
                      {usp.num}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-serif text-xl lg:text-2xl font-medium tracking-tight transition-colors duration-200 ${active === i ? 'text-brand-dark' : 'text-brand-muted group-hover:text-brand-dark'}`}>
                        {usp.title}
                      </h3>
                      <motion.p
                        className="font-sans text-sm text-brand-muted leading-relaxed overflow-hidden"
                        initial={false}
                        animate={{ height: active === i ? 'auto' : 0, opacity: active === i ? 1 : 0, marginTop: active === i ? 8 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {usp.body}
                      </motion.p>
                    </div>
                    <motion.span
                      className="flex-shrink-0 mt-1"
                      animate={{ rotate: active === i ? 90 : 0, color: active === i ? '#B8965A' : '#9CA3AF' }}
                      transition={{ duration: 0.25 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </div>
                </motion.button>
              ))}

              {/* CTA */}
              <motion.div
                className="pt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {isPrivate ? (
                  <motion.button
                    onClick={() => open()}
                    className="btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {bookingLabel}
                  </motion.button>
                ) : (
                  <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                    Contact us
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Right — detail panel */}
            <div className="hidden lg:block sticky top-28 self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-white rounded-2xl p-10 overflow-hidden border border-brand-border/60"
                >
                  {/* Decorative number */}
                  <span
                    className="absolute -top-6 -right-4 font-serif text-[9rem] leading-none font-medium text-brand-border/30 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {usps[active].num}
                  </span>

                  {/* Gold rule */}
                  <span className="block w-8 h-0.5 bg-brand-gold mb-6" />

                  <h3 className="font-serif text-3xl text-brand-dark font-medium mb-4 leading-tight tracking-tight relative z-10">
                    {usps[active].title}
                  </h3>
                  <p className="font-sans text-[15px] text-brand-muted leading-relaxed mb-4 relative z-10">
                    {usps[active].body}
                  </p>
                  <p className="font-sans text-sm text-brand-muted/70 leading-relaxed relative z-10 border-t border-brand-border/40 pt-4">
                    {usps[active].detail}
                  </p>

                  {/* Progress dots */}
                  <div className="flex gap-2 mt-8 relative z-10">
                    {usps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-1.5 bg-brand-gold' : 'w-1.5 h-1.5 bg-brand-border hover:bg-brand-gold/40'}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
