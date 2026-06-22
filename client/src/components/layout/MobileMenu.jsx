import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Phone, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const treatments = [
  { label: 'Dental Implants',      href: '/treatments/dental-implants' },
  { label: 'Invisalign',           href: '/treatments/invisalign' },
  { label: 'Composite Bonding',    href: '/treatments/composite-bonding' },
  { label: 'Porcelain Veneers',    href: '/treatments/veneers' },
  { label: 'Teeth Whitening',      href: '/treatments/teeth-whitening' },
  { label: '6 Month Smile',        href: '/treatments/six-month-smile' },
  { label: 'Air Flow Hygiene',     href: '/treatments/air-flow-hygiene' },
  { label: 'Botox & Anti-Wrinkle', href: '/treatments/botox-anti-wrinkle' },
]

const locationLinks = [
  { label: 'Godalming',      href: '/dentist-godalming' },
  { label: 'Guildford',      href: '/dentist-guildford' },
  { label: 'Haslemere',      href: '/dentist-haslemere' },
  { label: 'Farnham',        href: '/dentist-farnham' },
  { label: 'Cranleigh',      href: '/dentist-cranleigh' },
  { label: 'Hampshire',      href: '/dentist-hampshire' },
  { label: 'NHS Alternative',href: '/nhs-alternative-surrey' },
]

const mainLinks = [
  { label: 'Facial Aesthetics', href: '/facial-aesthetics' },
  { label: 'Our Team',          href: '/our-team' },
  { label: 'Gallery',           href: '/gallery' },
  { label: 'Blog',              href: '/blog' },
  { label: 'Contact',           href: '/contact' },
]

/* SVG curved left edge that morphs on open/close */
function Curve({ height }) {
  if (!height) return null

  const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`
  const targetPath  = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`

  const pathVariants = {
    initial: { d: initialPath },
    enter:   { d: targetPath,  transition: { duration: 1,   ease: [0.76, 0, 0.24, 1] } },
    exit:    { d: initialPath, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  }

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] h-full stroke-none fill-white pointer-events-none"
      aria-hidden="true"
    >
      <motion.path variants={pathVariants} initial="initial" animate="enter" exit="exit" />
    </svg>
  )
}

/* Character-stagger animated nav link */
function StaggerLink({ href, label, index, onClose }) {
  return (
    <Link
      to={href}
      onClick={onClose}
      className="flex items-center gap-5 py-5 border-b border-brand-border/40 group"
    >
      <span className="font-serif text-[10px] text-brand-gold/50 tracking-[0.2em] flex-shrink-0 w-6 text-right">
        {String(index).padStart(2, '0')}
      </span>
      <motion.span
        initial="rest"
        whileHover="hover"
        className="font-serif text-2xl sm:text-3xl text-brand-dark font-light tracking-tight flex"
      >
        {label.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={{
              rest: { y: 0 },
              hover: { y: -3, transition: { type: 'spring', delay: i * 0.025, stiffness: 500, damping: 22 } },
            }}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Link>
  )
}

/* Accordion for multi-item groups */
function SubGroup({ label, items, onClose }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-brand-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 font-serif text-2xl sm:text-3xl text-brand-dark font-light tracking-tight text-left"
      >
        {label}
        <ChevronDown className={`w-4 h-4 text-brand-gold transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-1 pl-11">
              {items.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="block py-2 font-sans text-sm text-brand-muted hover:text-brand-green transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MENU_ANIMATION = {
  initial: { x: 'calc(100% + 100px)' },
  enter:   { x: '0',                  transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit:    { x: 'calc(100% + 100px)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
}

export default function MobileMenu({ isOpen, onClose, onOpenBooking }) {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const update = () => setHeight(window.innerHeight)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-brand-dark/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={MENU_ANIMATION}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed right-0 top-0 z-50 h-[100dvh] w-full max-w-[420px] bg-white flex flex-col overflow-hidden"
          >
            <Curve height={height} />

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-brand-border/40 relative z-10">
              <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                <img
                  src="/images/logo.png"
                  alt="Octavia Dental"
                  className="w-9 h-9 rounded-xl object-contain bg-white flex-shrink-0"
                />
                <div className="leading-none">
                  <span className="font-serif text-[1.05rem] text-brand-dark font-medium tracking-tight leading-none block">
                    Octavia Dental
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-brand-muted mt-[3px] block">
                    & Facial Aesthetics
                  </span>
                </div>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 text-brand-muted hover:text-brand-dark cursor-pointer rounded-full hover:bg-brand-cream transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-7 py-4 relative z-10">
              <SubGroup label="Treatments" items={treatments} onClose={onClose} />

              {mainLinks.map((link, i) => (
                <StaggerLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  index={i + 1}
                  onClose={onClose}
                />
              ))}

              <SubGroup label="Locations" items={locationLinks} onClose={onClose} />
            </nav>

            {/* Bottom CTAs */}
            <div className="px-7 py-6 border-t border-brand-border/40 space-y-3 relative z-10 bg-white">
              <button
                onClick={() => { onOpenBooking(); onClose() }}
                className="btn-primary w-full text-sm"
              >
                Book Free Consultation
              </button>
              <div className="grid grid-cols-2 gap-2">
                <a href="tel:01483860020" className="btn-secondary text-sm text-center flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Call us
                </a>
                <a
                  href="https://wa.me/441483860020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-[#25D366]/10 text-[#1a9e50] border border-[#25D366]/30 rounded-full text-sm font-sans font-medium hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
