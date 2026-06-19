import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const stats = [
  { value: '500+', label: 'Happy patients',     numeric: 500, suffix: '+' },
  { value: '5.0★', label: 'Google rating',      numeric: 5.0, suffix: '★', decimal: true },
  { value: '2',    label: 'Specialist dentists', numeric: 2,   suffix: '' },
  { value: 'Free', label: 'Consultations',       numeric: null },
  { value: 'None', label: 'Waiting list',        numeric: null },
]

function CountUp({ numeric, suffix, decimal, value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const displayed = useTransform(count, (v) =>
    decimal ? v.toFixed(1) + suffix : Math.round(v) + suffix
  )

  useEffect(() => {
    if (inView && numeric !== null) {
      animate(count, numeric, {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      })
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
  return (
    <div className="bg-brand-dark overflow-hidden border-t border-white/5">
      <div className="container-wide py-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
              <CountUp
                numeric={stat.numeric}
                suffix={stat.suffix}
                decimal={stat.decimal}
                value={stat.value}
              />
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
