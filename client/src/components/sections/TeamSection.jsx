import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import TeamCard from '../ui/TeamCard'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

export default function TeamSection() {
  const [dentists, setDentists] = useState([])

  useEffect(() => {
    axios.get('/api/team/category/dentist').then(({ data }) => setDentists(data)).catch(() => {})
  }, [])

  return (
    <section className="section-padding bg-white">
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
              Meet the team
            </motion.span>
            <GoldRule delay={0.2} />
            <AnimatedHeading
              as="h2"
              className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight tracking-tight"
              delay={0.15}
            >
              Specialists you can trust.
            </AnimatedHeading>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
          >
            <Link
              to="/our-team"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-green flex-shrink-0 hover:text-brand-green/80 group transition-colors duration-200"
            >
              View full team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Team cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto lg:mx-0">
          {dentists.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 font-sans text-xs text-brand-subtle text-center lg:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          All clinicians are GDC registered. GDC numbers available on individual team pages.
        </motion.p>
      </div>
    </section>
  )
}
