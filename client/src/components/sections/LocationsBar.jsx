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

          <div className="flex flex-wrap gap-2">
            {locations.map((loc, i) => (
              <motion.div
                key={`${loc.label}-${i}`}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.035, duration: 0.3, ease: 'easeOut' }}
              >
                <Link
                  to={loc.href}
                  className={`inline-block px-4 py-1.5 rounded-full border font-sans text-xs font-medium cursor-pointer transition-all duration-200 ${
                    loc.primary
                      ? 'bg-brand-green text-white border-brand-green hover:bg-brand-green/90'
                      : loc.highlight
                      ? 'bg-brand-gold/10 text-brand-dark border-brand-gold/30 hover:border-brand-gold hover:text-brand-dark'
                      : 'bg-white text-brand-muted border-brand-border hover:border-brand-green/40 hover:text-brand-green'
                  }`}
                >
                  {loc.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
