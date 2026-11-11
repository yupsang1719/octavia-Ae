import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const locations = [
  { label: 'Godalming',       href: '/dentist-godalming',     primary: true },
  { label: 'Guildford',       href: '/dentist-guildford' },
  { label: 'Haslemere',       href: '/dentist-haslemere' },
  { label: 'Farnham',         href: '/dentist-farnham' },
  { label: 'Cranleigh',       href: '/dentist-cranleigh' },
  { label: 'Waverley',        href: '/dentist-cranleigh' },
  { label: 'Hampshire',       href: '/dentist-hampshire' },
  { label: 'Petersfield',     href: '/dentist-hampshire' },
  { label: 'Alton',           href: '/dentist-hampshire' },
  { label: 'NHS Alternative', href: '/nhs-alternative-surrey', highlight: true },
]

export default function LocationsBar() {
  return (
    <section className="py-10 bg-white border-y border-brand-border/50">
      <div className="container-wide">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-brand-green" />
            <span className="font-sans text-[13px] font-medium text-brand-dark whitespace-nowrap">
              Serving patients from:
            </span>
          </div>

          <div className="overflow-hidden">
            <ul className="-ml-6 flex flex-wrap gap-y-2">
              {locations.map((loc, i) => (
                <li key={`${loc.label}-${i}`} className="relative pl-6">
                  <span aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 bg-brand-gold" />
                  <Link
                    to={loc.href}
                    className={`font-sans text-sm underline-offset-4 decoration-brand-gold/60 hover:underline transition-colors duration-200 ${
                      loc.primary
                        ? 'text-brand-dark font-semibold'
                        : loc.highlight
                        ? 'text-brand-green font-medium'
                        : 'text-brand-muted hover:text-brand-dark'
                    }`}
                  >
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
