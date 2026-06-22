import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/447584965468"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Octavia Dental on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/30 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.0, type: 'spring', stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.08, boxShadow: '0 8px 24px rgba(37,211,102,0.4)' }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Ripple pulse rings */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.55, 1.55], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 2.5 }}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.3, 1.3], opacity: [0.4, 0, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 2.8 }}
      />

      <span className="flex items-center gap-2 px-4 py-3 relative z-10">
        <MessageCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
        <span className="text-sm font-sans font-medium hidden md:block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Chat with us
        </span>
      </span>
    </motion.a>
  )
}
