import { motion } from 'framer-motion'

export default function GoldRule({ className = '', delay = 0.15 }) {
  return (
    <motion.span
      className={`block h-0.5 bg-brand-gold mb-5 origin-left ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '2.5rem' }}
    />
  )
}
