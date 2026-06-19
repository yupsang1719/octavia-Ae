import { motion } from 'framer-motion'

/**
 * Splits text children into words and reveals them with a staggered mask lift.
 * Pass plain string children; for multi-line use multiple instances.
 */
export default function AnimatedHeading({ children, className = '', delay = 0, as = 'h2' }) {
  const Tag = as

  const words = typeof children === 'string' ? children.split(' ') : null

  if (!words) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Tag className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: '0.28em' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: delay + i * 0.055,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
