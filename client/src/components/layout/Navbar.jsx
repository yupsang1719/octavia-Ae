import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Phone, ChevronDown } from 'lucide-react'
import MobileMenu from './MobileMenu'
import BookingModal from '../ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'

const treatments = [
  { label: 'General Dentistry',    href: '/treatments/general-dentistry' },
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
  { label: 'Godalming',       href: '/dentist-godalming' },
  { label: 'Guildford',       href: '/dentist-guildford' },
  { label: 'Haslemere',       href: '/dentist-haslemere' },
  { label: 'Farnham',         href: '/dentist-farnham' },
  { label: 'Cranleigh',       href: '/dentist-cranleigh' },
  { label: 'Hampshire',       href: '/dentist-hampshire' },
  { label: 'NHS Alternative', href: '/nhs-alternative-surrey' },
]

function DropdownMenu({ items }) {
  return (
    <motion.div
      className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-brand-border/60 shadow-xl shadow-brand-dark/8 rounded-lg py-2 z-50"
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {items.map((item, i) => (
        <Link
          key={item.href}
          to={item.href}
          className="block px-4 py-2.5 text-sm font-sans text-brand-dark hover:bg-brand-green-bg hover:text-brand-green transition-colors duration-150"
          style={{ transitionDelay: `${i * 15}ms` }}
        >
          {item.label}
        </Link>
      ))}
      <div className="absolute top-0 left-5 w-8 h-0.5 bg-brand-gold rounded-full" />
    </motion.div>
  )
}

function NavItem({ label, href, dropdown, transparent, onHover, onLeave, isHovered }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  if (dropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => { setOpen(true); onHover?.() }}
        onMouseLeave={() => { setOpen(false); onLeave?.() }}
      >
        <button className="relative flex items-center gap-1 text-sm font-sans font-medium px-3 py-2 rounded-full cursor-pointer z-10">
          {isHovered && (
            <motion.span
              layoutId="nav-pill"
              className={`absolute inset-0 rounded-full ${transparent ? 'bg-white/12' : 'bg-brand-green-bg'}`}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
          <ChevronDown className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>{open && <DropdownMenu items={dropdown} />}</AnimatePresence>
      </div>
    )
  }

  const isActive = location.pathname === href
  return (
    <Link
      to={href}
      className="relative text-sm font-sans font-medium px-3 py-2 rounded-full"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {isHovered && (
        <motion.span
          layoutId="nav-pill"
          className={`absolute inset-0 rounded-full ${transparent ? 'bg-white/12' : 'bg-brand-green-bg'}`}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {isActive && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold" />
      )}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const { isOpen, open, close }     = useBookingModal()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = !scrolled
  const textColor   = transparent ? 'text-white' : 'text-brand-dark'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          transparent
            ? 'bg-brand-dark/40 backdrop-blur-md'
            : 'bg-white/95 backdrop-blur-md border-b border-brand-border/50 shadow-sm shadow-brand-dark/4'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container-wide flex items-center justify-between h-[72px] lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
            <img
              src="/images/logo.png"
              alt="Octavia Dental"
              className="w-9 h-9 rounded-xl object-contain bg-white flex-shrink-0"
            />
            <div className="leading-none">
              <span className={`font-serif text-[1.1rem] font-medium tracking-tight leading-none ${textColor}`}>
                Octavia Dental
              </span>
              <span className={`block font-sans text-[9px] uppercase tracking-[0.16em] mt-[3px] ${transparent ? 'text-white/50' : 'text-brand-muted'}`}>
                & Facial Aesthetics
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className={`hidden lg:flex items-center gap-1 ${textColor}`} onMouseLeave={() => setHoveredNav(null)}>
            {[
              { id: 'treatments',  label: 'Treatments',       dropdown: treatments   },
              { id: 'aesthetics',  label: 'Facial Aesthetics', href: '/facial-aesthetics' },
              { id: 'team',        label: 'Our Team',          href: '/our-team'     },
              { id: 'gallery',     label: 'Gallery',           href: '/gallery'      },
              { id: 'locations',   label: 'Locations',         dropdown: locationLinks},
              { id: 'blog',        label: 'Blog',              href: '/blog'         },
            ].map(nav => (
              <NavItem
                key={nav.id}
                label={nav.label}
                href={nav.href}
                dropdown={nav.dropdown}
                transparent={transparent}
                isHovered={hoveredNav === nav.id}
                onHover={() => setHoveredNav(nav.id)}
                onLeave={() => setHoveredNav(null)}
              />
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:01483958205"
              className={`flex items-center gap-1.5 text-sm font-sans font-medium transition-colors hover:text-brand-gold ${textColor}`}
            >
              <Phone className="w-3.5 h-3.5" />
              01483 958205
            </a>
            <button
              onClick={() => open()}
              className="btn-primary text-sm"
            >
              Book Free Consultation
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-2 cursor-pointer ${textColor}`}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenBooking={open}
      />

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
