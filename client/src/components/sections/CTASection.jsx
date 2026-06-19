import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { useBookingModal } from '../../hooks/useBookingModal'
import BookingModal from '../ui/BookingModal'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

export default function CTASection() {
  const { isOpen, open, close } = useBookingModal()

  return (
    <>
      <section className="section-padding bg-brand-dark relative overflow-hidden">
        {/* Animated decorative rings */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Vertical gold drop from top */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-brand-gold/40 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: '6rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Slow-rotating outer ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/4"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          {/* Counter-rotating inner ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-brand-gold/8"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />

          {/* Breathing glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-gold/5"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <GoldRule className="mx-auto" />
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium mb-5">
                Ready to start?
              </p>
            </motion.div>

            <AnimatedHeading
              as="h2"
              className="font-serif text-4xl lg:text-5xl text-white font-medium mb-5 leading-tight tracking-tight"
              delay={0.1}
            >
              Your consultation is free.
            </AnimatedHeading>

            <motion.p
              className="font-sans text-white/60 text-[15px] leading-relaxed mb-11 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Book a no-obligation consultation with Dr Ali or Dr Ana. We'll assess your needs, explain your options, and give you a transparent quote — all at no cost.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-9"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={() => open()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-dark font-sans font-medium text-sm rounded-full cursor-pointer transition-colors duration-300 hover:bg-brand-cream"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Book free consultation
              </motion.button>

              <motion.a
                href="https://wa.me/441483860020"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-white text-sm px-8 py-4"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp us
              </motion.a>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
            >
              <a
                href="tel:01483860020"
                className="flex items-center gap-2 font-sans text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                01483 860020
              </a>
              <span className="hidden sm:block w-px h-3 bg-white/15" />
              <p className="font-sans text-sm text-white/50">
                Seymour House, Lower South Street, Godalming GU7 1BZ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
