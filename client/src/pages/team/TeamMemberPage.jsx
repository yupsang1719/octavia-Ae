import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import BookingModal from '../../components/ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'
import { SITE_URL } from '../../utils/seo'

const ease = [0.22, 1, 0.36, 1]

function inView(delay = 0) {
  return { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay, ease: 'easeOut' } }
}

const CATEGORY_ORDER = [
  { key: 'dentist',          label: 'Dentists' },
  { key: 'hygienist',        label: 'Hygienists' },
  { key: 'therapist',        label: 'Therapists' },
  { key: 'nurse',            label: 'Dental Nurses' },
  { key: 'trainee-nurse',    label: 'Trainee Nurses' },
  { key: 'practice-manager', label: 'Practice Management' },
  { key: 'receptionist',     label: 'Reception' },
  { key: 'marketing',        label: 'Marketing' },
  { key: 'other',            label: 'Team' },
]

export default function TeamMemberPage({ member }) {
  const { isOpen, open, close } = useBookingModal()
  const firstName = member.name.replace(/^Dr\s+/, '').split(' ')[0]

  const [otherMembers, setOtherMembers] = useState([])

  useEffect(() => {
    axios.get('/api/team')
      .then(({ data }) => setOtherMembers(data.filter(m => m.slug !== member.slug)))
      .catch(() => {})
  }, [member.slug])

  const grouped = CATEGORY_ORDER
    .map(cat => ({ ...cat, members: otherMembers.filter(m => m.category === cat.key) }))
    .filter(g => g.members.length > 0)

  return (
    <>
      <Helmet>
        <title>{member.metaTitle || `${member.name} | Octavia Dental`}</title>
        <meta name="description"         content={member.metaDesc} />
        <link rel="canonical"            href={`${SITE_URL}/our-team/${member.slug}`} />
        <meta property="og:type"         content="profile" />
        <meta property="og:title"        content={member.metaTitle} />
        <meta property="og:description"  content={member.metaDesc} />
        <meta property="og:url"          content={`${SITE_URL}/our-team/${member.slug}`} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={member.metaTitle} />
        <meta name="twitter:description" content={member.metaDesc} />
      </Helmet>

      {/* ── HERO — photo left (framed), content right ───────────────────────── */}
      <section className="bg-brand-dark pt-16">
        <div className="container-wide py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-[auto_1fr] gap-14 xl:gap-20 items-center">

            {/* LEFT — framed portrait */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              {/*
                Wrapper has extra bottom+right padding so the offset accent
                block behind the frame has room to peek out.
              */}
              <div className="relative pb-5 pr-5">

                {/* Offset accent block — fades up from behind the frame */}
                <motion.div
                  className="absolute inset-0 top-5 left-5 border border-brand-gold/25"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                />

                {/* Frame container (mat + photo + SVG border) */}
                <div className="relative">

                  {/* SVG border — draws itself clockwise around the mat */}
                  <svg
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <motion.rect
                      x="0.75" y="0.75"
                      width="98.5" height="98.5"
                      fill="none"
                      stroke="#C8A96E"
                      strokeWidth="0.55"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 1.9, delay: 0.45, ease: 'easeInOut' },
                        opacity:    { duration: 0.01, delay: 0.45 },
                      }}
                    />
                  </svg>

                  {/* Dark mat — frames the photo like a mount board */}
                  <div className="p-[10px] bg-brand-dark">

                    {/* Thin inner border between mat and photo */}
                    <div className="border border-white/[0.07]">

                      {/* Photo — wipes in top-to-bottom via clip-path */}
                      <motion.div
                        initial={{ clipPath: 'inset(0 0 100% 0)' }}
                        animate={{ clipPath: 'inset(0 0 0% 0)' }}
                        transition={{ duration: 1.0, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={`${member.name} — ${member.role}`}
                            width={460}
                            height={460}
                            className="block w-[280px] sm:w-[340px] lg:w-[400px] xl:w-[460px] aspect-square object-cover object-top"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-[280px] sm:w-[340px] lg:w-[400px] xl:w-[460px] aspect-square bg-gradient-to-br from-brand-green/20 to-brand-green-bg flex items-center justify-center">
                            <span className="font-serif text-8xl text-brand-green/10 font-medium select-none">
                              {member.initials}
                            </span>
                          </div>
                        )}
                      </motion.div>

                    </div>
                  </div>

                  {/* Shimmer sweep — fires once after photo and frame settle */}
                  <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(108deg, transparent 30%, rgba(200,169,110,0.18) 50%, transparent 70%)',
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 1.0, delay: 1.5, ease: 'easeOut' }}
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT — staggered content reveal */}
            <div className="min-w-0">

              {/* Eyebrow */}
              <motion.span
                className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold block mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                {member.eyebrow || member.role}
              </motion.span>

              {/* Gold rule — draws in from left */}
              <motion.div
                className="h-px bg-brand-gold mb-7"
                initial={{ width: 0 }}
                animate={{ width: '2rem' }}
                transition={{ duration: 0.5, delay: 0.75, ease }}
              />

              {/* Name */}
              <motion.h1
                className="font-display text-5xl sm:text-6xl xl:text-7xl text-white font-medium leading-[0.92] tracking-tight mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.8, ease }}
              >
                {member.name}
              </motion.h1>

              {/* Role + GDC */}
              <motion.p
                className="font-sans text-brand-green-mid text-sm uppercase tracking-widest mb-8"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.92, ease }}
              >
                {member.role}
                {member.gdcNumber && (
                  <span className="ml-4 pl-4 border-l border-white/15 text-white/30 normal-case tracking-normal">
                    GDC {member.gdcNumber}
                  </span>
                )}
              </motion.p>

              {/* Specialisms — stagger each tag */}
              {member.specialisms?.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-10"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.07, delayChildren: 1.0 } },
                  }}
                >
                  {member.specialisms.map(s => (
                    <motion.span
                      key={s}
                      variants={{
                        hidden:   { opacity: 0, scale: 0.82, y: 6 },
                        visible:  { opacity: 1, scale: 1,    y: 0 },
                      }}
                      transition={{ duration: 0.3, ease }}
                      className="font-sans text-[11px] px-3 py-1.5 border border-white/15 text-white/60 rounded-full"
                    >
                      {s}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Buttons */}
              {member.category === 'dentist' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.18, ease }}
                >
                  <button
                    onClick={() => open()}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-white font-sans font-medium text-sm rounded-sm hover:bg-brand-gold-dk transition-colors"
                  >
                    Book with {firstName}
                  </button>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ───────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="container-wide py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-[1fr_320px] gap-14 xl:gap-20 items-start">

            {/* ── LEFT: Bio + Treatments ─────────────────────────────────────── */}
            <div className="min-w-0">

              {/* About */}
              <motion.div {...inView(0)} className="mb-3">
                <span className="section-label">About</span>
                <div className="gold-rule" />
              </motion.div>

              <motion.h2 {...inView(0.05)} className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight mb-8">
                {member.name}
              </motion.h2>

              {/* Lead paragraph in serif */}
              <motion.p {...inView(0.1)} className="font-serif text-xl text-brand-dark/75 leading-[1.75] mb-7">
                {member.bio}
              </motion.p>

              {member.bioExtended?.map((para, i) => (
                <motion.p key={i} {...inView(0.12 + i * 0.05)} className="font-sans text-brand-muted leading-relaxed mb-5 text-[15px]">
                  {para}
                </motion.p>
              ))}

              {member.prescriptionNotice && (
                <motion.div {...inView(0.3)} className="mt-4 border-l-2 border-brand-green pl-5 py-1 mb-5">
                  <p className="font-sans text-xs text-brand-muted leading-relaxed">
                    <strong className="text-brand-green font-semibold">Prescription notice —</strong>{' '}
                    Anti-wrinkle treatments are prescription-only medicines. {member.name} carries out a full clinical assessment prior to all facial aesthetics treatment, in accordance with GDC guidance.
                  </p>
                </motion.div>
              )}

              {/* Treatments */}
              {member.treatments?.length > 0 && (
                <motion.div {...inView(0.15)} className="mt-12 pt-12 border-t border-brand-border">
                  <span className="section-label">Treatments offered</span>
                  <div className="gold-rule" />
                  <h3 className="font-serif text-3xl text-brand-dark font-medium mb-7">
                    Explore treatments with {firstName}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {member.treatments.map((t, i) => (
                      <motion.div key={t.label} {...inView(0.05 * i)}>
                        <Link
                          to={t.href}
                          className="group flex items-center gap-3 px-4 py-3.5 border border-brand-border rounded-sm hover:border-brand-green hover:shadow-card transition-all bg-brand-cream/50"
                        >
                          <div className="w-5 h-5 rounded-full bg-brand-green-bg flex items-center justify-center flex-shrink-0">
                            <ArrowRight className="w-2.5 h-2.5 text-brand-green group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors">
                            {t.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA strip — dentists only */}
              {member.category === 'dentist' && (
                <motion.div
                  {...inView(0.1)}
                  className="mt-12 pt-10 border-t border-brand-border"
                >
                  <p className="font-sans text-xs uppercase tracking-widest text-brand-subtle mb-3">Ready to begin?</p>
                  <h3 className="font-serif text-2xl text-brand-dark font-medium mb-2">
                    {member.ctaHeading || `Book with ${firstName}`}
                  </h3>
                  {member.ctaBody && (
                    <p className="font-sans text-sm text-brand-muted leading-relaxed mb-6 max-w-md">
                      {member.ctaBody}
                    </p>
                  )}
                  <button
                    onClick={() => open()}
                    className="btn-primary"
                  >
                    Book free consultation
                  </button>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ──────────────────────────────────────────────── */}
            <div className="mt-14 lg:mt-0 lg:sticky lg:top-28 space-y-8">

              {/* Education & Training */}
              {member.qualifications?.length > 0 && (
                <motion.div {...inView(0.1)} className="bg-brand-dark rounded-sm overflow-hidden">
                  <div className="px-6 pt-6 pb-4 border-b border-white/8">
                    <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-gold font-semibold">
                      Education & Training
                    </span>
                  </div>
                  <ul className="px-6 py-4 space-y-4">
                    {member.qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-4 h-px bg-brand-gold flex-shrink-0 mt-[9px]" />
                        <p className="font-sans text-sm text-white/65 leading-snug">{q}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Other team members */}
              {grouped.length > 0 && (
                <motion.div {...inView(0.15)}>
                  <div className="mb-4">
                    <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-subtle font-semibold">
                      Meet the team
                    </span>
                    <div className="w-6 h-px bg-brand-gold mt-2" />
                  </div>

                  <div className="space-y-5">
                    {grouped.map(group => (
                      <div key={group.key}>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-brand-subtle mb-2 pl-1">
                          {group.label}
                        </p>
                        <div className="space-y-1">
                          {group.members.map(m => (
                            <Link
                              key={m._id}
                              to={m.hasPage ? `/our-team/${m.slug}` : '/our-team'}
                              className="group flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-brand-cream transition-colors"
                            >
                              {/* Avatar */}
                              <div className="w-9 h-9 rounded-full bg-brand-green-bg flex-shrink-0 overflow-hidden">
                                {m.image ? (
                                  <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="font-serif text-xs text-brand-green/50 font-medium">
                                      {m.initials || m.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div className="min-w-0">
                                <p className="font-sans text-sm font-medium text-brand-dark group-hover:text-brand-green transition-colors leading-tight truncate">
                                  {m.name}
                                </p>
                                <p className="font-sans text-[11px] text-brand-subtle leading-tight truncate">{m.role}</p>
                              </div>
                              {m.hasPage && (
                                <ArrowRight className="w-3 h-3 text-brand-subtle flex-shrink-0 ml-auto group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/our-team"
                    className="mt-4 flex items-center gap-1.5 text-xs font-sans font-medium text-brand-green hover:text-brand-green/70 transition-colors"
                  >
                    View full team <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </div>

      <BookingModal isOpen={isOpen} onClose={close} defaultService={member.bookingService} />
    </>
  )
}
