import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const DEFAULTS = [
  { value: '500+', label: 'Happy patients' },
  { value: '5.0★', label: 'Google rating' },
  { value: '2',    label: 'Specialist dentists' },
  { value: 'Free', label: 'Consultations' },
  { value: 'None', label: 'Waiting list' },
]

function parseStat(value) {
  const match = value.match(/^([\d.]+)(.*)$/)
  if (!match) return { numeric: null, suffix: '', decimal: false }
  const num = parseFloat(match[1])
  return {
    numeric:  isNaN(num) ? null : num,
    suffix:   match[2] || '',
    decimal:  match[1].includes('.'),
  }
}

function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const { numeric, suffix, decimal } = parseStat(value)
  const count = useMotionValue(0)
  const displayed = useTransform(count, v =>
    decimal ? v.toFixed(1) + suffix : Math.round(v) + suffix
  )

  useEffect(() => {
    if (inView && numeric !== null) {
      animate(count, numeric, { duration: 1.8, ease: [0.22, 1, 0.36, 1] })
    }
  }, [inView, numeric, count])

  if (numeric === null) {
    return (
      <motion.span
        ref={ref}
        className="font-display text-3xl font-medium text-brand-gold tracking-tight"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {value}
      </motion.span>
    )
  }

  return (
    <motion.span
      ref={ref}
      className="font-display text-3xl font-medium text-brand-gold tracking-tight"
      style={{ display: 'block' }}
    >
      {displayed}
    </motion.span>
  )
}

export default function TrustBar() {
  const [stats, setStats] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/settings/trust-bar')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setStats(data) })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-brand-dark overflow-hidden border-t border-white/5">
      <div className="container-wide py-0">
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(stats.length, 6)}`}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`flex flex-col items-center justify-center py-8 px-6 text-center relative ${
                i < stats.length - 1
                  ? 'after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-white/8'
                  : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: 'easeOut' }}
            >
              <CountUp value={stat.value} />
              <span className="font-sans text-[11px] text-white/45 uppercase tracking-[0.15em] mt-1.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
