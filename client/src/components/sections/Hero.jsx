import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useBookingModal } from '../../hooks/useBookingModal'
import BookingModal from '../ui/BookingModal'
import TextScramble from '../ui/TextScramble'

const ROTATING_WORDS = ['confidence.', 'radiance.', 'perfection.', 'future.']

const word = {
  hidden:  { y: '105%', opacity: 0 },
  visible: (i) => ({
    y: '0%',
    opacity: 1,
    transition: { delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

function SplitHeading({ text, className, baseDelay = 0 }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: '0.24em' }}>
          <motion.span
            className={`inline-block ${className}`}
            custom={baseDelay + i}
            variants={word}
            initial="hidden"
            animate="visible"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  )
}

export default function Hero({
  headline    = 'Your smile.',
  tags        = ['No waiting list', 'New patients welcome', 'Free consultations', 'Surrey & Hampshire'],
  heroImage   = 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=80',
}) {
  const { isOpen, open, close } = useBookingModal()
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 600], ['0%', '18%'])

  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
      }, 2800)
      return () => clearInterval(interval)
    }, 2600)
    return () => clearTimeout(startTimer)
  }, [])

  return (
    <>
      <section className="relative min-h-screen flex items-center bg-brand-dark overflow-hidden">

        {/* Parallax background */}
        <div className="absolute inset-0 lg:left-[45%]">
          <motion.div className="w-full h-[115%] -top-[7.5%] absolute" style={{ y: imageY }}>
            <img
              src={heroImage}
              alt="Octavia Dental & Facial Aesthetics team in Godalming"
              className="w-full h-full object-cover object-top"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="900"
              height="1100"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1a0c] via-[#0e1a0c]/80 lg:via-[#0e1a0c]/35 to-transparent" />
          <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[#0e1a0c]/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e1a0c]/30 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container-wide relative z-10 pt-28 pb-24 lg:py-0">
          <div className="max-w-[540px] lg:max-w-[500px]">

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="block h-px bg-brand-gold"
                initial={{ width: 0 }}
                animate={{ width: '2rem' }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-gold/90 font-medium">
                Godalming, Surrey
              </span>
            </motion.div>

            {/* Headline — word reveal */}
            <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] text-white font-medium leading-[1.02] tracking-[-0.03em] mb-1">
              <SplitHeading text={headline} className="text-white" baseDelay={0} />
            </h1>

            {/* Subheadline — "Your" + rotating word */}
            <p className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] text-brand-gold font-medium leading-[1.02] tracking-[-0.03em] mb-7 flex items-baseline flex-nowrap" style={{ gap: '0.24em' }}>
              <span className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  custom={1.5}
                  variants={word}
                  initial="hidden"
                  animate="visible"
                >
                  Your
                </motion.span>
              </span>

              <span className="inline-block overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={ROTATING_WORDS[wordIndex]}
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </p>

            <motion.p
              className="font-sans text-base sm:text-lg text-white/65 mb-9 leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Driven by smiles, powered by care.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 mb-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.98, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => open()}
                className="btn-primary text-sm px-8 py-4"
              >
                <TextScramble text="Book free consultation" />
              </button>

              <a
                href="https://wa.me/441483860020"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-white text-sm px-8 py-4"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp us
              </a>
            </motion.div>

            {/* Tag pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-xs font-sans font-normal px-3.5 py-1.5 rounded-full border border-white/15 text-white/60 bg-white/4 tracking-wide"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.15 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              className="mt-6 font-sans text-xs text-white/35 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45, duration: 0.5 }}
            >
              GDC registered clinicians · Seymour House, Godalming GU7 1BZ
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-white/70"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
