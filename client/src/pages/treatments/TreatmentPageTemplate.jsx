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
import { getTreatmentById } from '../../data/treatments'
import { usePractice } from '../../contexts/PracticeContext'

function fadeUp(delay = 0) {
  return {
    initial:    { opacity: 0, y: 20 },
    whileInView:{ opacity: 1, y: 0 },
    viewport:   { once: true },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function TreatmentHero({ treatment, member, onBook, isPrivate }) {
  const { phone, phoneTel } = usePractice()
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
          {member?.length > 0 && (
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-4">
              {member.length === 1
                ? `${member[0].name} — ${member[0].role}`
                : member.map(m => m.name).join(' & ')}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">
            {treatment.h1}
          </h1>
          <p className="font-display text-xl sm:text-2xl text-brand-gold mb-6 font-medium">
            {treatment.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onBook} className="btn-primary px-8 py-4 text-base">
              {isPrivate ? 'Book free consultation' : 'Request appointment'}
            </button>
            <a
              href={`tel:${phoneTel}`}
              className="btn-ghost-white text-base px-8 py-4"
            >
              {phone}
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

// ── Before/After ──────────────────────────────────────────────────────────────
function BeforeAfterSection({ treatmentId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!treatmentId) return
    axios.get(`/api/gallery/${treatmentId}`).then(({ data }) => {
      if (Array.isArray(data)) setItems(data)
    }).catch(() => {})
  }, [treatmentId])

  if (!items.length) return null

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
          {items.slice(0, 3).map((item, i) => (
            <motion.div key={item._id || i} {...fadeUp(i * 0.08)}>
              <BeforeAfterSlider
                beforeSrc={item.beforeImg || item.url || item.src}
                afterSrc={item.afterImg   || item.url || item.src}
                beforeAlt={`Before ${item.treatment || 'treatment'}`}
                afterAlt={`After ${item.treatment || 'treatment'} at Octavia Dental`}
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
function SpecialistSection({ member: members }) {
  if (!members?.length) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8 leading-snug"
            {...fadeUp(0)}
          >
            {members.length === 1 ? 'Meet your specialist' : 'Meet your specialists'}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((m, i) => (
              <motion.div
                key={m.slug || i}
                className="bg-brand-cream border border-brand-border rounded-sm overflow-hidden"
                {...fadeUp(i * 0.08)}
              >
                {/* Photo */}
                <div className="h-44 bg-brand-green-bg">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-4xl text-brand-green/30">{m.initials || m.name[0]}</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-4">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-brand-gold font-semibold mb-1">Your specialist</p>
                  <h3 className="font-serif text-lg text-brand-dark font-medium leading-snug">{m.name}</h3>
                  <p className="font-sans text-xs text-brand-green font-medium mb-2">{m.role}</p>
                  {m.bio && (
                    <p className="font-sans text-xs text-brand-muted leading-relaxed line-clamp-3 mb-3">{m.bio}</p>
                  )}
                  {m.specialisms?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.specialisms.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] font-sans px-2 py-0.5 bg-white border border-brand-border text-brand-muted rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
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
function TreatmentCTA({ member, onBook, isPrivate }) {
  const { phone, whatsapp, address } = usePractice()
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-wide text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">
            Ready to get started?
          </h2>
          <p className="font-sans text-white/70 max-w-md mx-auto mb-8">
            {isPrivate
              ? `Book a free consultation with ${member?.length ? member.map(m => m.name).join(' or ') : 'our specialist'} to discuss your options and receive a transparent, personalised quote.`
              : 'Get in touch to book your appointment. NHS and private patients are both welcome.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBook}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-dark font-sans font-medium text-base rounded-full transition-all duration-300 hover:bg-brand-cream"
            >
              {isPrivate ? 'Book free consultation' : 'Request appointment'}
            </button>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-white text-base px-8 py-4"
              >
                WhatsApp us
              </a>
            )}
          </div>
          <p className="mt-6 font-sans text-sm text-white/50">
            {phone} · {address}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── Main Template ─────────────────────────────────────────────────────────────
export default function TreatmentPageTemplate({ treatment: treatmentProp, slug }) {
  const { isOpen, open, close } = useBookingModal()
  const { type } = usePractice()
  const isPrivate = type === 'private'
  const [treatment, setTreatment] = useState(treatmentProp || (slug ? getTreatmentById(slug) : null))
  const [member, setMember] = useState(null)

  useEffect(() => {
    const s = slug || treatmentProp?.slug
    if (!s) return
    axios.get(`/api/treatments/${s}`)
      .then(({ data }) => setTreatment(data))
      .catch(() => {})
  }, [slug, treatmentProp?.slug])

  useEffect(() => {
    const slugs = treatment?.specialists?.length ? treatment.specialists : []
    if (!slugs.length) { setMember(null); return }
    Promise.all(slugs.map(s => axios.get(`/api/team/${s}`).then(r => r.data).catch(() => null)))
      .then(results => setMember(results.filter(Boolean)))
  }, [treatment?.specialists])

  if (!treatment) return null

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
        <TreatmentHero treatment={treatment} member={member} onBook={open} isPrivate={isPrivate} />
        <WhatIsIt paragraphs={treatment.whatIsIt} />
        <Benefits benefits={treatment.benefits} />
        <Process steps={treatment.process} />
        <BeforeAfterSection treatmentId={treatment.id} />
        <Pricing treatment={treatment} />
        <FAQSection faqs={treatment.faq} />
        <GDCNotes gdcNote={treatment.gdcNote} rxNote={treatment.rxNote} />
        <SpecialistSection member={member} />
        <TreatmentCTA member={member} onBook={open} isPrivate={isPrivate} />
      </div>

      <BookingModal isOpen={isOpen} onClose={close} defaultService={treatment.id} />
    </>
  )
}
