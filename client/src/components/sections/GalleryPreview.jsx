import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BeforeAfterSlider from '../ui/BeforeAfterSlider'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

const BASE = 'auto=format&fit=crop&w=600&h=450&q=80'
const U    = (id) => `https://images.unsplash.com/photo-${id}?${BASE}`

const placeholders = [
  { id: 1, treatment: 'Composite Bonding',  photo: U('1609840114035-3c981b782dfe') },
  { id: 2, treatment: 'Dental Implants',    photo: U('1606811841689-23dfddce3e95') },
  { id: 3, treatment: 'Teeth Whitening',    photo: U('1559599076-9b6f425d1b07') },
  { id: 4, treatment: 'Invisalign',         photo: U('1622253692010-333f2da6031d') },
  { id: 5, treatment: 'Porcelain Veneers',  photo: U('1609840114035-3c981b782dfe') },
  { id: 6, treatment: 'Composite Bonding',  photo: U('1559599076-9b6f425d1b07') },
]

export default function GalleryPreview() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span
              className="section-label"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              Patient results
            </motion.span>
            <GoldRule delay={0.2} />
            <AnimatedHeading
              as="h2"
              className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight tracking-tight"
              delay={0.15}
            >
              Real smiles. Real results.
            </AnimatedHeading>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-green flex-shrink-0 hover:text-brand-green/80 group transition-colors duration-200"
            >
              View full gallery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-xl overflow-hidden shadow-sm shadow-brand-dark/5">
                <BeforeAfterSlider
                  beforeSrc={item.photo}
                  afterSrc={item.photo}
                  beforeAlt={`Before ${item.treatment}`}
                  afterAlt={`After ${item.treatment} at Octavia Dental`}
                />
              </div>
              <p className="text-center text-xs font-sans font-medium text-brand-muted mt-3 tracking-wide">
                {item.treatment}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center font-sans text-xs text-brand-subtle mt-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Results may vary. All before and after images are published with written patient consent in accordance with GDC guidelines.
        </motion.p>
      </div>
    </section>
  )
}
