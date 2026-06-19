import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
}

const item = {
  hidden:  { y: 12, opacity: 0, filter: 'blur(6px)' },
  visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 28 } },
}

export default function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/our-team/${member.slug}`}
      className="group block relative rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portrait image */}
      <div className="aspect-[3/4] relative bg-brand-green-bg overflow-hidden">
        {member.image ? (
          <motion.img
            src={member.image}
            alt={`${member.name} — ${member.role}`}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-green/8 to-brand-green-bg gap-3">
            <div className="w-20 h-20 rounded-full bg-brand-green/15 flex items-center justify-center">
              <span className="font-serif text-2xl text-brand-green/40 font-medium select-none">
                {member.initials || member.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        )}

        {/* Permanent bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-dark/75 to-transparent pointer-events-none" />

        {/* Default name label */}
        <AnimatePresence>
          {!hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-5 left-5 right-5"
            >
              <p className="font-serif text-xl text-white font-medium leading-tight">{member.name}</p>
              <p className="font-sans text-[11px] text-brand-gold uppercase tracking-[0.18em] mt-0.5">{member.role}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-brand-dark/75 backdrop-blur-[2px] flex flex-col justify-end p-6"
            >
              <motion.div variants={stagger} initial="hidden" animate="visible" exit="exit">
                <motion.p variants={item} className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-gold mb-2">
                  {member.role}
                </motion.p>
                <motion.h3 variants={item} className="font-serif text-2xl text-white font-medium tracking-tight mb-3">
                  {member.name}
                </motion.h3>
                <motion.div variants={item} className="flex flex-wrap gap-1.5 mb-4">
                  {member.specialisms?.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] font-sans px-2.5 py-1 bg-white/10 text-white/80 rounded-full border border-white/15">
                      {s}
                    </span>
                  ))}
                </motion.div>
                <motion.div variants={item} className="flex items-center gap-1.5 font-sans text-sm text-brand-gold group-hover:gap-2.5 transition-all duration-200">
                  Meet {member.name.split(' ')[0]}
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
                <motion.div variants={item} className="mt-4 h-px w-10 bg-brand-gold" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  )
}
