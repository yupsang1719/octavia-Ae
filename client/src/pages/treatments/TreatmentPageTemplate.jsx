import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SchemaMarkup from '../../components/ui/SchemaMarkup'
import FAQAccordion from '../../components/ui/FAQAccordion'
import BeforeAfterSlider from '../../components/ui/BeforeAfterSlider'
import FinancePlaceholder from '../../components/ui/FinancePlaceholder'
import BookingModal from '../../components/ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'
import { faqSchema, treatmentSchema, breadcrumbSchema } from '../../utils/schema'
import { SITE_URL } from '../../utils/seo'
import { useState, useEffect } from 'react'
import axios from 'axios'

function fadeUp(delay = 0) {
  return {
    initial:    { opacity: 0, y: 20 },
    whileInView:{ opacity: 1, y: 0 },
    viewport:   { once: true },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function TreatmentHero({ treatment, onBook }) {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center bg-brand-dark overflow-hidden">
      {treatment.heroImage && (
        <div className="absolute inset-0">
          <img
            src={treatment.heroImage}
            alt={treatment.h1}
            className="w-full h-full object-cover opacity-40"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-dark/40" />
        </div>
      )}

      <div className="container-wide relative z-10 py-28 lg:py-36">
        <motion.div className="max-w-xl" {...fadeUp(0)}>
          <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-4">
            {treatment.specialist === 'dr-ali' ? 'Dr Ali — Implant & Restorative Specialist' : 'Dr Ana — Cosmetic & Aesthetics Specialist'}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">
            {treatment.h1}
          </h1>
          <p className="font-display text-xl sm:text-2xl text-brand-gold mb-6 font-medium">
            {treatment.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onBook} className="btn-primary px-8 py-4 text-base">
              Book free consultation
            </button>
            <a
              href="tel:01483860020"
              className="btn-ghost-white text-base px-8 py-4"
            >
              01483 860020
            </a>
          </div>
          {treatment.priceFrom && (
            <p className="mt-4 font-sans text-sm text-white/50">
              From <span className="text-white/80 font-medium">{treatment.priceFrom}</span>
              {treatment.priceNote && <span> · {treatment.priceNote}</span>}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ── What Is It ────────────────────────────────────────────────────────────────
function WhatIsIt({ paragraphs }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3"
            {...fadeUp(0)}
          >
            About the treatment
          </motion.p>
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0.05)}
          >
            What is it?
          </motion.h2>
          <div className="space-y-5">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="font-sans text-brand-muted leading-relaxed"
                {...fadeUp(i * 0.06 + 0.1)}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Benefits ──────────────────────────────────────────────────────────────────
function Benefits({ benefits }) {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0)}
          >
            Benefits
          </motion.h2>
          <div className="border border-brand-border/60 rounded-xl overflow-hidden bg-white">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="group relative flex items-start gap-4 px-6 py-5 border-b border-brand-border/40 last:border-b-0 hover:bg-brand-cream/40 transition-colors duration-200"
                initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mt-0.5 group-hover:bg-brand-gold/20 group-hover:border-brand-gold/50 transition-all duration-200">
                  <Check className="w-2.5 h-2.5 text-brand-gold" strokeWidth={3} />
                </div>
                <p className="font-sans text-sm text-brand-dark leading-relaxed">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Process ───────────────────────────────────────────────────────────────────
function Process({ steps }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-10 leading-snug"
            {...fadeUp(0)}
          >
            What to expect
          </motion.h2>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                className="flex gap-5 relative"
                {...fadeUp(i * 0.08)}
              >
                {/* Vertical connector */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-sans font-semibold text-sm flex-shrink-0 z-10">
                    {step.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-brand-border mt-2 mb-2 min-h-[2rem]" />
                  )}
                </div>
                <div className={`pb-8 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
                  <h3 className="font-serif text-lg text-brand-dark font-medium mb-1 mt-1">{step.title}</h3>
                  <p className="font-sans text-sm text-brand-muted leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Dental smile photos matched to each treatment for before/after placeholders
const TREATMENT_PHOTOS = {
  'dental-implants':  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&h=450&q=80',
  'invisalign':       'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&h=450&q=80',
  'composite-bonding':'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&h=450&q=80',
  'veneers':          'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=600&h=450&q=80',
  'teeth-whitening':  'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=600&h=450&q=80',
  'six-month-smile':  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&h=450&q=80',
  'air-flow-hygiene': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&h=450&q=80',
  'botox-anti-wrinkle':'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&h=450&q=80',
}
const DEFAULT_SMILE = 'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=600&h=450&q=80'

// ── Before/After ──────────────────────────────────────────────────────────────
function BeforeAfterSection({ treatmentId }) {
  const photo = TREATMENT_PHOTOS[treatmentId] || DEFAULT_SMILE

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <motion.h2
          className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-10 text-center leading-snug"
          {...fadeUp(0)}
        >
          Patient results
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}>
              <BeforeAfterSlider
                beforeSrc={photo}
                afterSrc={photo}
                beforeAlt={`Before treatment`}
                afterAlt={`After treatment at Octavia Dental`}
              />
            </motion.div>
          ))}
        </div>
        <motion.p
          className="text-center font-sans text-xs text-brand-subtle mt-8 max-w-lg mx-auto"
          {...fadeUp(0.3)}
        >
          Results may vary. All before and after images are published with written patient consent in accordance with GDC guidelines.
        </motion.p>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing({ treatment }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0)}
          >
            Pricing
          </motion.h2>
          <motion.div
            className="border border-brand-border rounded-sm overflow-hidden"
            {...fadeUp(0.1)}
          >
            <div className="bg-brand-green px-6 py-5">
              <p className="font-sans text-xs uppercase tracking-widest text-white/60 mb-1">Starting from</p>
              <p className="font-display text-4xl text-white font-medium">{treatment.priceFrom}</p>
            </div>
            <div className="px-6 py-5 bg-white space-y-3">
              <p className="font-sans text-sm text-brand-muted leading-relaxed">{treatment.priceNote}</p>
              {treatment.financeAvailable && <FinancePlaceholder />}
              <p className="font-sans text-xs text-brand-subtle">
                Prices quoted at consultation may vary based on individual assessment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection({ faqs }) {
  if (!faqs?.length) return null
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0)}
          >
            Frequently asked questions
          </motion.h2>
          <motion.div {...fadeUp(0.1)}>
            <FAQAccordion faqs={faqs} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Specialist ────────────────────────────────────────────────────────────────
function SpecialistSection({ specialistId }) {
  const [member, setMember] = useState(null)
  useEffect(() => {
    if (!specialistId) return
    axios.get(`/api/team/${specialistId}`).then(({ data }) => setMember(data)).catch(() => {})
  }, [specialistId])
  if (!member) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0)}
          >
            Meet your specialist
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 bg-brand-cream border border-brand-border rounded-sm overflow-hidden"
            {...fadeUp(0.1)}
          >
            <div className="sm:w-48 flex-shrink-0">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 sm:h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 sm:h-full bg-brand-green-bg flex items-center justify-center">
                  <svg className="w-16 h-16 text-brand-green/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-1">Your specialist</p>
              <h3 className="font-serif text-2xl text-brand-dark font-medium">{member.name}</h3>
              <p className="font-sans text-sm text-brand-green font-medium mb-3">{member.role}</p>
              <p className="font-sans text-sm text-brand-muted leading-relaxed mb-4">{member.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member.specialisms.map(s => (
                  <span key={s} className="text-xs font-sans px-2.5 py-1 bg-white border border-brand-border text-brand-muted rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── GDC / Rx Notes ────────────────────────────────────────────────────────────
function GDCNotes({ gdcNote, rxNote }) {
  if (!gdcNote && !rxNote) return null
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {rxNote && (
        <p className="font-sans text-xs text-brand-subtle bg-brand-green-bg border border-brand-green/20 rounded-sm px-4 py-3">
          <strong className="text-brand-green">Prescription notice:</strong> Anti-wrinkle treatments are prescription-only medicines. A full consultation and clinical assessment is carried out prior to treatment in accordance with NHS and GDC guidance.
        </p>
      )}
    </div>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function TreatmentCTA({ treatment, onBook }) {
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-wide text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">
            Ready to get started?
          </h2>
          <p className="font-sans text-white/70 max-w-md mx-auto mb-8">
            Book a free consultation with {treatment.specialist === 'dr-ali' ? 'Dr Ali' : 'Dr Ana'} to discuss your options and receive a transparent, personalised quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBook}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-dark font-sans font-medium text-base rounded-full transition-all duration-300 hover:bg-brand-cream"
            >
              Book free consultation
            </button>
            <a
              href="https://wa.me/441483860020"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-white text-base px-8 py-4"
            >
              WhatsApp us
            </a>
          </div>
          <p className="mt-6 font-sans text-sm text-white/50">
            01483 860020 · Seymour House, Lower South Street, Godalming GU7 1BZ
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── Main Template ─────────────────────────────────────────────────────────────
export default function TreatmentPageTemplate({ treatment }) {
  const { isOpen, open, close } = useBookingModal()
  const canonical = `${SITE_URL}/treatments/${treatment.slug}`

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Treatments', url: '/treatments/dental-implants' },
      { name: treatment.h1 },
    ]),
    treatmentSchema({ name: treatment.h1, description: treatment.metaDesc, url: `/treatments/${treatment.slug}` }),
    ...(treatment.faq?.length ? [faqSchema(treatment.faq)] : []),
  ]

  return (
    <>
      <Helmet>
        <title>{treatment.title}</title>
        <meta name="description" content={treatment.metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={treatment.title} />
        <meta property="og:description" content={treatment.metaDesc} />
        <meta property="og:url"         content={canonical} />
        <meta property="og:image"       content={`${SITE_URL}/images/og-default.webp`} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={treatment.title} />
        <meta name="twitter:description" content={treatment.metaDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/images/og-default.webp`} />
      </Helmet>

      {schemas.map((schema, i) => <SchemaMarkup key={i} schema={schema} />)}

      {/* pt-16 offsets the fixed navbar */}
      <div className="pt-16">
        <TreatmentHero treatment={treatment} onBook={open} />
        <WhatIsIt paragraphs={treatment.whatIsIt} />
        <Benefits benefits={treatment.benefits} />
        <Process steps={treatment.process} />
        <BeforeAfterSection treatmentId={treatment.id} />
        <Pricing treatment={treatment} />
        <FAQSection faqs={treatment.faq} />
        <GDCNotes gdcNote={treatment.gdcNote} rxNote={treatment.rxNote} />
        <SpecialistSection specialistId={treatment.specialist} />
        <TreatmentCTA treatment={treatment} onBook={open} />
      </div>

      <BookingModal isOpen={isOpen} onClose={close} defaultService={treatment.id} />
    </>
  )
}
