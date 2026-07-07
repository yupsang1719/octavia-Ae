import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Car, Train, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import SchemaMarkup from '../../components/ui/SchemaMarkup'
import FAQAccordion from '../../components/ui/FAQAccordion'
import BookingModal from '../../components/ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'
import { usePractice } from '../../contexts/PracticeContext'
import { localBusinessSchema, faqSchema, breadcrumbSchema } from '../../utils/schema'
import { SITE_URL } from '../../utils/seo'
import { services } from '../../data/services'

function fade(delay = 0) {
  return {
    initial:     { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true },
    transition:  { duration: 0.45, delay, ease: 'easeOut' },
  }
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function LocationHero({ location, onBook, phone, phoneTel, isPrivate }) {
  return (
    <section className="relative bg-brand-green pt-16 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

      <div className="container-wide py-20 lg:py-28 relative z-10">
        <motion.div className="max-w-2xl" {...fade(0)}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span className="font-sans text-xs uppercase tracking-widest text-white/50 font-semibold">
              {location.distance}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">
            {location.h1}
          </h1>
          {location.metaDesc && (
            <p className="font-sans text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
              {location.metaDesc}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onBook} className="btn-primary bg-white text-brand-green hover:bg-brand-cream px-8 py-4 text-base">
              {isPrivate ? 'Book free consultation' : 'Request appointment'}
            </button>
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-base rounded-sm transition-all duration-300 hover:bg-white/10"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          </div>
          <p className="mt-5 font-sans text-sm text-white/40">
            {isPrivate
              ? 'No waiting list · No referral needed · New patients welcome this week'
              : 'NHS & private patients welcome · New patients accepted'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── NHS Crisis Banner ─────────────────────────────────────────────────────────
function NHSBanner({ stats }) {
  if (!stats) return null
  return (
    <div className="bg-brand-dark text-white py-8">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center justify-center py-6 px-4 bg-brand-dark text-center"
              {...fade(i * 0.08)}
            >
              <span className="font-display text-3xl font-medium text-brand-gold mb-1">{item.stat}</span>
              <span className="font-sans text-xs text-white/50 leading-tight text-center">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Intro ─────────────────────────────────────────────────────────────────────
function Intro({ paragraphs }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto space-y-5">
          {paragraphs.map((para, i) => (
            <motion.p key={i} className="font-sans text-brand-muted leading-relaxed" {...fade(i * 0.06)}>
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services Grid ─────────────────────────────────────────────────────────────
function ServicesAvailable() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8" {...fade(0)}>
          Treatments available
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((service, i) => (
            <motion.div key={service.id} {...fade(i * 0.05)}>
              <Link
                to={service.href}
                className="group flex items-center gap-3 bg-white border border-brand-border rounded-sm px-4 py-3 transition-all duration-200 hover:border-brand-green/30 hover:shadow-sm"
              >
                <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors duration-200">
                  {service.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-border ml-auto group-hover:text-brand-green transition-colors duration-200" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why Choose ────────────────────────────────────────────────────────────────
function WhyChoose({ locationName, practiceName, isPrivate }) {
  const points = isPrivate
    ? [
        { title: 'No waiting list',         body: `New patients from ${locationName} can be seen within days. Contact us today and we can find you an early appointment.` },
        { title: 'Specialist dentists',      body: 'Dr Ali leads all implant and complex restorative cases. Dr Ana specialises in cosmetic dentistry and facial aesthetics. You see an expert for your treatment — every time.' },
        { title: 'Free initial consultation',body: 'All new patients receive a complimentary consultation. We discuss your concerns, assess your teeth and give you a clear, transparent quote before you commit to anything.' },
        { title: 'Modern, purpose-built clinic', body: 'Our clinic is equipped with the latest digital scanning, imaging and treatment technology — delivering results that rival London practices at a fraction of the cost.' },
      ]
    : [
        { title: 'NHS & private care',      body: `We offer both NHS and private dental care to patients from ${locationName}. New NHS patients are welcome — no long waits to register.` },
        { title: 'Experienced team',         body: 'Our experienced dental team takes time to know each patient properly. We combine NHS accessibility with the highest standard of private care.' },
        { title: 'Prevention first',         body: 'Our philosophy centres on prevention. Great oral health, maintained well, lasts a lifetime — and we help you get there.' },
        { title: 'CQC registered',           body: 'We are registered with the Care Quality Commission and all clinicians hold current GDC registration. Numbers are available on request.' },
      ]

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-10" {...fade(0)}>
          Why choose {practiceName}?
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              className="flex gap-4 bg-brand-cream rounded-sm border border-brand-border p-6"
              {...fade(i * 0.08)}
            >
              <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg text-brand-dark font-medium mb-1">{point.title}</h3>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">{point.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How to Get Here ───────────────────────────────────────────────────────────
function HowToGetHere({ location, address, phone, phoneTel }) {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8" {...fade(0)}>
          How to get here
        </motion.h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {location.directions && (
            <motion.div className="bg-white rounded-sm border border-brand-border p-6" {...fade(0.05)}>
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-5 h-5 text-brand-green" />
                <h3 className="font-serif text-lg text-brand-dark font-medium">By car</h3>
              </div>
              <p className="font-sans text-sm text-brand-muted leading-relaxed">{location.directions}</p>
            </motion.div>
          )}
          {location.parking && (
            <motion.div className="bg-white rounded-sm border border-brand-border p-6" {...fade(0.1)}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-brand-green" />
                <h3 className="font-serif text-lg text-brand-dark font-medium">Parking</h3>
              </div>
              <p className="font-sans text-sm text-brand-muted leading-relaxed">{location.parking}</p>
            </motion.div>
          )}
          {location.transport && (
            <motion.div className="bg-white rounded-sm border border-brand-border p-6" {...fade(0.15)}>
              <div className="flex items-center gap-2 mb-3">
                <Train className="w-5 h-5 text-brand-green" />
                <h3 className="font-serif text-lg text-brand-dark font-medium">By train</h3>
              </div>
              <p className="font-sans text-sm text-brand-muted leading-relaxed">{location.transport}</p>
            </motion.div>
          )}
        </div>

        <motion.div
          className="mt-6 bg-brand-green/5 border border-brand-green/20 rounded-sm px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2"
          {...fade(0.2)}
        >
          <div className="flex items-center gap-2 text-sm font-sans text-brand-dark">
            <MapPin className="w-4 h-4 text-brand-green" />
            <span className="font-medium">{address}</span>
          </div>
          <a href={`tel:${phoneTel}`} className="flex items-center gap-2 text-sm font-sans text-brand-green font-medium hover:underline">
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ── Google Maps ───────────────────────────────────────────────────────────────
function GoogleMapEmbed({ address, name }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=16`
  return (
    <div className="w-full h-72 lg:h-96 bg-brand-border overflow-hidden">
      <iframe
        title={`${name} — map`}
        width="100%" height="100%"
        loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        src={src}
        className="border-0"
        aria-label={`Map showing ${name} location`}
      />
    </div>
  )
}

// ── NHS Section (private only) ────────────────────────────────────────────────
function NHSSection({ locationName }) {
  return (
    <section className="section-padding bg-brand-dark text-white">
      <div className="container-wide">
        <div className="max-w-2xl">
          <motion.div {...fade(0)}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">
              NHS alternative
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4 leading-snug">
              {`Can't get an NHS dentist${locationName ? ` near ${locationName}` : ' in Surrey or Hampshire'}?`}
            </h2>
            <p className="font-sans text-white/70 leading-relaxed mb-6">
              You don't have to keep waiting. Octavia Dental accepts new patients immediately — no referral, no waiting list, no delay. Private care at a price you can understand, from a team that genuinely has time for you.
            </p>
            <ul className="space-y-2 mb-8">
              {['No referral letter needed', 'Free initial consultation', 'Seen within days, not months', 'Flexible payment plans for larger treatments'].map(point => (
                <li key={point} className="flex items-center gap-2 font-sans text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to="/nhs-alternative-surrey"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-gold hover:text-white transition-colors"
            >
              Read more about the NHS alternative <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function LocationFAQ({ faqs }) {
  if (!faqs?.length) return null
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-8" {...fade(0)}>
            Frequently asked questions
          </motion.h2>
          <motion.div {...fade(0.1)}>
            <FAQAccordion faqs={faqs} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function LocationCTA({ locationName, onBook, phone, phoneTel, whatsapp, address, isPrivate }) {
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-wide text-center">
        <motion.div {...fade(0)}>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">
            {isPrivate ? 'Ready to book your free consultation?' : 'Ready to book your appointment?'}
          </h2>
          <p className="font-sans text-white/70 max-w-md mx-auto mb-8">
            {isPrivate
              ? (locationName
                  ? `We welcome patients from ${locationName} — book today and be seen within the week.`
                  : 'No referral, no waiting list. Contact us today and we can see you within days.')
              : (locationName
                  ? `We welcome NHS and private patients from ${locationName}. Get in touch to book.`
                  : 'NHS and private patients welcome. Contact us to book your appointment.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBook}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-green font-sans font-medium text-base rounded-sm transition-all hover:bg-brand-cream"
            >
              {isPrivate ? 'Book free consultation' : 'Request appointment'}
            </button>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-base rounded-sm transition-all hover:bg-white/10"
              >
                WhatsApp us
              </a>
            )}
          </div>
          <p className="mt-6 font-sans text-sm text-white/40">
            {phone} · {address}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── Main Template ─────────────────────────────────────────────────────────────
export default function LocationPageTemplate({ location }) {
  const { isOpen, open, close } = useBookingModal()
  const { name, phone, phoneTel, whatsapp, address, type } = usePractice()
  const isPrivate = type === 'private'

  const canonical = `${SITE_URL}/${
    location.slug === 'nhs-alternative' ? 'nhs-alternative-surrey' : `dentist-${location.slug}`
  }`
  const isNHSPage = location.slug === 'nhs-alternative'

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: `Dentist ${location.name}` },
    ]),
    localBusinessSchema({ name: location.name, description: location.metaDesc, url: canonical.replace(SITE_URL, '') }),
    ...(location.faq?.length ? [faqSchema(location.faq)] : []),
  ]

  return (
    <>
      <Helmet>
        <title>{location.metaTitle}</title>
        <meta name="description" content={location.metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={location.metaTitle} />
        <meta property="og:description" content={location.metaDesc} />
        <meta property="og:url"         content={canonical} />
        <meta property="og:image"       content={`${SITE_URL}/images/og-default.webp`} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={location.metaTitle} />
        <meta name="twitter:description" content={location.metaDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/images/og-default.webp`} />
      </Helmet>

      {schemas.map((s, i) => <SchemaMarkup key={i} schema={s} />)}

      <LocationHero location={location} onBook={open} phone={phone} phoneTel={phoneTel} isPrivate={isPrivate} />

      {location.nhsStats && <NHSBanner stats={location.nhsStats} />}

      {location.intro?.length > 0 && <Intro paragraphs={location.intro} />}

      {!isNHSPage && <ServicesAvailable />}

      <WhyChoose
        locationName={location.slug === 'nhs-alternative' ? 'patients across Surrey & Hampshire' : location.name}
        practiceName={name}
        isPrivate={isPrivate}
      />

      {location.nhs_note && !isNHSPage && isPrivate && (
        <NHSSection locationName={location.name} />
      )}

      <HowToGetHere location={location} address={address} phone={phone} phoneTel={phoneTel} />

      <GoogleMapEmbed address={address} name={name} />

      <LocationFAQ faqs={location.faq} />

      <LocationCTA
        locationName={location.slug === 'nhs-alternative' ? null : location.name}
        onBook={open}
        phone={phone}
        phoneTel={phoneTel}
        whatsapp={whatsapp}
        address={address}
        isPrivate={isPrivate}
      />

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
