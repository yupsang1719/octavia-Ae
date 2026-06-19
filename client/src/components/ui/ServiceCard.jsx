import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ServiceCard({ service }) {
  return (
    <Link
      to={service.href}
      className="group relative flex flex-col bg-white border border-brand-border/70 rounded-xl p-6 transition-all duration-400 ease-out hover:shadow-xl hover:shadow-brand-dark/8 hover:border-brand-gold/30 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Gold top accent line */}
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="w-11 h-11 rounded-lg bg-brand-green-bg flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-brand-green group-hover:shadow-md group-hover:shadow-brand-green/20">
        <ServiceIcon id={service.id} className="w-5 h-5 text-brand-green group-hover:text-white transition-colors duration-300" />
      </div>

      <h3 className="font-sans text-[1rem] text-brand-dark font-semibold mb-2 leading-snug tracking-tight">
        {service.name}
      </h3>

      <p className="font-sans text-[13px] text-brand-muted leading-relaxed flex-1 mb-5">
        {service.tagline}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/50">
        <span className="font-sans text-xs text-brand-subtle">
          From{' '}
          <span className="font-semibold text-brand-gold">{service.priceFrom}</span>
        </span>
        <ArrowRight className="w-4 h-4 text-brand-subtle group-hover:text-brand-green group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  )
}

function ServiceIcon({ id, className }) {
  const icons = {
    implants:      <ToothIcon className={className} />,
    invisalign:    <AlignersIcon className={className} />,
    bonding:       <SparkleIcon className={className} />,
    veneers:       <GemIcon className={className} />,
    whitening:     <SunIcon className={className} />,
    sixmonthsmile: <ClockIcon className={className} />,
    airflow:       <WindIcon className={className} />,
    botox:         <SyringeIcon className={className} />,
  }
  return icons[id] || <SparkleIcon className={className} />
}

function ToothIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 2 6 4 6 7c0 1.5.5 3 1 4.5L8 20a1 1 0 0 0 2 0l.5-4h3l.5 4a1 1 0 0 0 2 0l1-8.5c.5-1.5 1-3 1-4.5 0-3-3-5-6-5Z" />
    </svg>
  )
}
function AlignersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M7 8v8M11 8v8M15 8v8" />
    </svg>
  )
}
function SparkleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
    </svg>
  )
}
function GemIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 18 3 22 9 12 22 2 9" />
      <polyline points="2 9 12 14 22 9" />
      <line x1="12" y1="3" x2="12" y2="14" />
    </svg>
  )
}
function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}
function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function WindIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}
function SyringeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2l4 4-4 4" />
      <path d="M14.5 5.5L18 2" />
      <path d="M10 6l8 8" />
      <path d="M6 10l-4 4 2 2 4-4" />
      <path d="M14 14l-4 4-2-2 4-4" />
      <path d="M2 22l4-4" />
    </svg>
  )
}
