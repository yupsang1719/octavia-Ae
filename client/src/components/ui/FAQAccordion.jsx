import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div className={`relative border-b border-brand-border last:border-0 transition-all duration-300 ${open ? 'bg-brand-cream/50' : ''}`}>
      {/* Gold left accent line on open */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 bg-brand-gold rounded-full transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-5 pl-5 pr-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span className={`font-serif text-[10px] tracking-[0.2em] flex-shrink-0 mt-1.5 transition-colors duration-200 ${open ? 'text-brand-gold' : 'text-brand-subtle'}`}>
            {num}
          </span>
          <span className={`font-serif text-base sm:text-[1.05rem] font-medium leading-snug transition-colors duration-200 ${open ? 'text-brand-dark' : 'text-brand-dark/85 group-hover:text-brand-dark'}`}>
            {q}
          </span>
        </div>

        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
            open ? 'bg-brand-gold border-brand-gold text-white' : 'border-brand-border/60 text-brand-subtle group-hover:border-brand-green/40 group-hover:text-brand-green'
          }`}
        >
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm text-brand-muted leading-relaxed pb-5 pl-14 pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQAccordion({ faqs }) {
  if (!faqs?.length) return null
  return (
    <div className="divide-y-0 border border-brand-border/70 rounded-xl bg-white overflow-hidden">
      {faqs.map((faq, i) => (
        <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
      ))}
    </div>
  )
}
