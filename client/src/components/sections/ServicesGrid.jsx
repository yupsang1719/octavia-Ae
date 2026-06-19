import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import GoldRule from '../ui/GoldRule'
import { services } from '../../data/services'

/* ── Service icons ──────────────────────────────────────────────────────────── */
function ServiceIcon({ id, className }) {
  const icons = {
    implants: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9 2 6 4 6 7c0 1.5.5 3 1 4.5L8 20a1 1 0 0 0 2 0l.5-4h3l.5 4a1 1 0 0 0 2 0l1-8.5c.5-1.5 1-3 1-4.5 0-3-3-5-6-5Z" />
      </svg>
    ),
    invisalign: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="8" rx="4" />
        <path d="M7 8v8M11 8v8M15 8v8" />
      </svg>
    ),
    bonding: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
      </svg>
    ),
    veneers: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6 3 18 3 22 9 12 22 2 9" />
        <polyline points="2 9 12 14 22 9" />
        <line x1="12" y1="3" x2="12" y2="14" />
      </svg>
    ),
    whitening: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
    sixmonthsmile: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    airflow: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      </svg>
    ),
    botox: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2l4 4-4 4" />
        <path d="M14.5 5.5L18 2" />
        <path d="M10 6l8 8" />
        <path d="M6 10l-4 4 2 2 4-4" />
        <path d="M14 14l-4 4-2-2 4-4" />
        <path d="M2 22l4-4" />
      </svg>
    ),
  }
  return icons[id] || icons.bonding
}

/* ── Individual service row ─────────────────────────────────────────────────── */
function ServiceRow({ service, index }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={service.href}
        className="group relative flex items-center gap-4 sm:gap-8 py-5 sm:py-6 border-b border-white/10 overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover sweep */}
        <motion.div
          className="absolute inset-0 bg-white/4 pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Index number */}
        <span className="font-sans text-[10px] font-medium text-brand-gold/40 tracking-[0.22em] flex-shrink-0 w-6 select-none relative z-10">
          {num}
        </span>

        {/* Icon */}
        <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0 relative z-10 transition-all duration-300 group-hover:border-brand-gold/50 group-hover:bg-brand-gold/8">
          <ServiceIcon id={service.id} className="w-4 h-4 text-white/60 group-hover:text-brand-gold transition-colors duration-300" />
        </div>

        {/* Name + tagline */}
        <div className="flex-1 min-w-0 relative z-10">
          <h3 className="font-serif text-xl sm:text-2xl text-white font-light tracking-tight leading-tight transition-colors duration-200 group-hover:text-brand-gold/90">
            {service.name}
          </h3>
          <p className="font-sans text-[12px] text-white/40 mt-0.5 leading-relaxed hidden sm:block">
            {service.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 relative z-10 hidden md:block">
          <span className="font-sans text-[11px] font-medium text-brand-gold/80 bg-brand-gold/8 border border-brand-gold/20 px-3 py-1.5 rounded-full whitespace-nowrap">
            {service.priceFrom}
          </span>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0 relative z-10 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/40 group-hover:bg-brand-gold/8 transition-all duration-300"
          animate={{ x: hovered ? 2 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-brand-gold transition-colors duration-300" />
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ── Section ────────────────────────────────────────────────────────────────── */
export default function ServicesGrid() {
  return (
    <section className="section-padding bg-brand-green relative overflow-hidden">
      {/* Subtle decorative rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-white/4 pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full border border-white/3 pointer-events-none" />

      <div className="container-wide relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <motion.span
              className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-gold/80 font-semibold mb-4 block"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              Our treatments
            </motion.span>
            <GoldRule delay={0.2} />
            <motion.h2
              className="font-serif text-4xl lg:text-5xl xl:text-6xl text-white font-light leading-[1.08] tracking-[-0.025em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Everything under one roof.
            </motion.h2>
          </div>

          <motion.p
            className="font-sans text-[15px] text-white/50 max-w-xs leading-relaxed lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Smile transformations to subtle facial aesthetics — our specialist team delivers results that last.
          </motion.p>
        </div>

        {/* Services list */}
        <div className="border-t border-white/10">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-sans text-[11px] text-white/25 max-w-xs leading-relaxed">
            Prices are indicative and confirmed at consultation. Individual results may vary.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-brand-gold hover:text-white transition-colors duration-200 group flex-shrink-0"
          >
            Book a free consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
