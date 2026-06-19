import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import BookingModal from '../ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'

const CONSENT_COOKIE = 'octavia_cookie_consent'

function hasCookieConsent() {
  return document.cookie.split(';').some(c => c.trim().startsWith(CONSENT_COOKIE + '='))
}

export default function StickyBookBtn() {
  const [visible, setVisible]       = useState(false)
  const [hasConsent, setHasConsent] = useState(hasCookieConsent)
  const { isOpen, open, close }     = useBookingModal()

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 300) }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Poll for cookie consent so the button repositions after banner dismissal
    const interval = setInterval(() => {
      if (hasCookieConsent()) { setHasConsent(true); clearInterval(interval) }
    }, 500)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`fixed left-0 right-0 z-40 lg:hidden transition-[bottom] duration-300 ${hasConsent ? 'bottom-0' : 'bottom-[72px]'}`}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => open()}
              className="flex items-center justify-center gap-2 w-full bg-brand-green text-white font-sans font-medium text-sm py-4 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
