import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Phone, ArrowRight, Info } from 'lucide-react'
import { NHS_BANDS } from '../../data/nhsBands'
import FAQAccordion from '../../components/ui/FAQAccordion'
import SchemaMarkup from '../../components/ui/SchemaMarkup'
import { faqSchema, breadcrumbSchema } from '../../utils/schema'
import { SITE_URL } from '../../utils/seo'
import { usePractice } from '../../contexts/PracticeContext'

function fade(delay = 0) {
  return {
    initial:     { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true },
    transition:  { duration: 0.45, delay, ease: 'easeOut' },
  }
}

const BAND_COLOURS = {
  1: { bg: 'bg-brand-green',  badge: 'bg-green-900/40 text-green-300 border-green-700/40' },
  2: { bg: 'bg-[#1a3a6b]',   badge: 'bg-blue-900/40 text-blue-300 border-blue-700/40' },
  3: { bg: 'bg-[#4a1a1a]',   badge: 'bg-red-900/40 text-red-300 border-red-700/40' },
}

export default function NHSBandPage({ band }) {
  const { name, phone, phoneTel, address } = usePractice()
  const colours = BAND_COLOURS[band.number] || BAND_COLOURS[1]
  const canonical = `${SITE_URL}/nhs/${band.slug}`

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'NHS Treatments', url: '/nhs/band-1' },
      { name: band.name },
    ]),
    ...(band.faq?.length ? [faqSchema(band.faq)] : []),
  ]

  const otherBands = NHS_BANDS.filter(b => b.slug !== band.slug)

  return (
    <>
      <Helmet>
        <title>{band.metaTitle}</title>
        <meta name="description" content={band.metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={band.metaTitle} />
        <meta property="og:description" content={band.metaDesc} />
        <meta property="og:url"         content={canonical} />
      </Helmet>

      {schemas.map((s, i) => <SchemaMarkup key={i} schema={s} />)}

      {/* ── Hero ── */}
      <section className={`relative ${colours.bg} pt-16 overflow-hidden`}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="container-wide py-20 lg:py-28 relative z-10">
          <motion.div className="max-w-2xl" {...fade(0)}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${colours.badge}`}>
                NHS Treatment
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-3">
              {band.h1}
            </h1>
            <p className="font-sans text-lg text-white/70 mb-2">{band.tagline}</p>
            <p className="font-display text-3xl text-white font-medium mb-8">
              {band.price} <span className="font-sans text-base text-white/50 font-normal">per course of treatment</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="btn-primary bg-white text-brand-green hover:bg-brand-cream px-8 py-4 text-base">
                Contact us
              </Link>
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-base rounded-sm transition-all duration-300 hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>
            <p className="mt-5 font-sans text-sm text-white/40">
              You only ever pay one charge — the highest band reached in a single course of treatment
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto space-y-5">
            {band.intro.map((para, i) => (
              <motion.p key={i} className="font-sans text-brand-muted leading-relaxed" {...fade(i * 0.06)}>
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's covered ── */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

            <motion.div {...fade(0)}>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-6">
                What {band.name} covers
              </h2>
              <ul className="space-y-3">
                {band.covers.map((item, i) => (
                  <motion.li key={i} className="flex items-start gap-3" {...fade(i * 0.05)}>
                    <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-brand-dark leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {band.notCovers?.length > 0 && (
              <motion.div {...fade(0.1)}>
                <h2 className="font-serif text-2xl text-brand-dark font-medium mb-6">
                  Not included in {band.name}
                </h2>
                <ul className="space-y-3">
                  {band.notCovers.map((item, i) => (
                    <motion.li key={i} className="flex items-start gap-3" {...fade(i * 0.05)}>
                      <XCircle className="w-5 h-5 text-brand-muted/50 flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-sm text-brand-muted leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Single charge explainer ── */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div
            className="max-w-3xl mx-auto bg-brand-green/5 border border-brand-green/20 rounded-sm p-6 lg:p-8 flex gap-5"
            {...fade(0)}
          >
            <Info className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-xl text-brand-dark font-medium mb-2">
                One charge, all treatment
              </h3>
              <p className="font-sans text-sm text-brand-muted leading-relaxed mb-3">
                For any complete course of NHS dental treatment, you pay a single charge — the one for the highest band of treatment you receive. If your examination reveals you need a filling and a crown, you pay only the Band 3 charge of £332.10. You are never charged for each band separately.
              </p>
              <p className="font-sans text-sm text-brand-muted leading-relaxed">
                Some patients qualify for free NHS dental treatment — including those under 18, pregnant patients, and those receiving certain benefits. Check whether you are exempt at the{' '}
                <a
                  href="https://www.nhsbsa.nhs.uk/exemptions-nhs-dental-charges"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green underline"
                >
                  NHSBSA website
                </a>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── All bands comparison ── */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <motion.h2 className="font-serif text-3xl text-brand-dark font-medium mb-8" {...fade(0)}>
            NHS charge bands — April 2026
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            {NHS_BANDS.map((b, i) => (
              <motion.div
                key={b.slug}
                className={`rounded-sm border p-5 ${b.slug === band.slug ? 'border-brand-green bg-white shadow-sm' : 'border-brand-border bg-white/60'}`}
                {...fade(i * 0.08)}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-brand-muted font-semibold mb-1">{b.name}</p>
                <p className="font-display text-2xl text-brand-dark font-medium mb-1">{b.price}</p>
                <p className="font-sans text-xs text-brand-muted leading-relaxed mb-3">{b.tagline}</p>
                {b.slug !== band.slug && (
                  <Link
                    to={`/nhs/${b.slug}`}
                    className="inline-flex items-center gap-1 font-sans text-xs font-medium text-brand-green hover:underline"
                  >
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                {b.slug === band.slug && (
                  <span className="font-sans text-xs font-semibold text-brand-green">Current page</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {band.faq?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <motion.h2 className="font-serif text-3xl text-brand-dark font-medium mb-8" {...fade(0)}>
                Frequently asked questions
              </motion.h2>
              <motion.div {...fade(0.1)}>
                <FAQAccordion faqs={band.faq} />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-padding bg-brand-green">
        <div className="container-wide text-center">
          <motion.div {...fade(0)}>
            <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">
              Ready to book your appointment?
            </h2>
            <p className="font-sans text-white/70 max-w-md mx-auto mb-8">
              Contact {name} to arrange your appointment. Our team will confirm which band applies to your treatment and answer any questions about costs before you commit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-green font-sans font-medium text-base rounded-sm transition-all hover:bg-brand-cream"
              >
                Contact us
              </Link>
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-base rounded-sm transition-all hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>
            <p className="mt-6 font-sans text-sm text-white/40">{address}</p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
