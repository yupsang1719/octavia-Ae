import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, MessageCircle } from 'lucide-react'
import EmailEnquiry from './EmailEnquiry'
import { usePractice } from '../../contexts/PracticeContext'
import { useTreatments } from '../../hooks/useTreatments'

export default function BookingModal({ isOpen, onClose, defaultService = '' }) {
  const { phone, phoneTel, whatsapp, bookingLabel } = usePractice()
  const { treatments } = useTreatments()
  const treatment = defaultService
    ? (treatments.find(t => t.slug === defaultService)?.name || '')
    : ''

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-sm shadow-2xl"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-brand-green px-6 py-5 flex items-center justify-between">
            <div>
              <h2 id="booking-modal-title" className="font-serif text-xl text-white font-medium">{bookingLabel || 'Book Appointment'}</h2>
              <p className="text-brand-green-bg text-sm mt-0.5 font-sans">Email, call or message us — whichever suits you.</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            <EmailEnquiry treatment={treatment} compact />

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={`tel:${phoneTel}`} className="btn-secondary flex-1 text-sm inline-flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call {phone}
              </a>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-sans font-medium text-sm rounded-full py-3 hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp us
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
