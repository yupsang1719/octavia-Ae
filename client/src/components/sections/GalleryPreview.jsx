import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'


function GalleryItem({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl overflow-hidden shadow-sm shadow-brand-dark/8 group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <motion.img
          src={item.photo}
          alt={`${item.treatment} result at Octavia Dental`}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent"
        animate={{ opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="font-sans text-xs font-medium text-white/80 tracking-wide">
          {item.treatment}
        </span>
      </div>
    </motion.div>
  )
}

export default function GalleryPreview() {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    fetch('/api/gallery?limit=6')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setPhotos(data.slice(0, 6).map((p, i) => ({
            id: p._id || i,
            treatment: p.treatment || p.caption || '',
            photo: p.url || p.src,
          })))
        }
      })
      .catch(() => {})
  }, [])

  if (!photos.length) return null

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
          {photos.map((item, i) => (
            <GalleryItem key={item.id} item={item} index={i} />
          ))}
        </div>

        <motion.p
          className="text-center font-sans text-xs text-brand-subtle mt-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Results may vary. All images are published with written patient consent in accordance with GDC guidelines.
        </motion.p>
      </div>
    </section>
  )
}
