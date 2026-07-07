import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import ContactForm from '../components/forms/ContactForm'
import { usePractice } from '../contexts/PracticeContext'
import { SITE_URL } from '../utils/seo'

function fade(d=0){return{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.45,delay:d,ease:'easeOut'}}}

const GETTING_HERE = {
  'octavia-aesthetic': [
    'Parking available on Lower South Street (pay-and-display) and at Flambard Way car park, a 3-minute walk.',
    'Godalming railway station is a 7-minute walk. Regular services from London Waterloo, Guildford and Haslemere.',
  ],
  'octavia-house': [
    'Adjacent to Crown Court Car Park and the Wilfred Noyce Community Centre.',
    'Godalming railway station is a 5-minute walk. Disabled access available on the ground floor.',
  ],
  'new-octavia': [
    'Located in Beacon Hill, Hindhead. Use GU26 6NP for sat nav.',
  ],
}

export default function Contact() {
  const {
    name, phone, phoneTel, email: practiceEmail,
    address, whatsapp, hours, metaTitle, slug,
  } = usePractice()

  const gettingHere = GETTING_HERE[slug] || []
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=16`

  return (
    <>
      <Helmet>
        <title>Contact Us | {metaTitle}</title>
        <meta name="description" content={`Contact ${name}. Call ${phone} or send a message. ${address}.`} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title"       content={`Contact Us | ${name}`} />
        <meta property="og:description" content={`Call ${phone} or send a message. ${address}.`} />
        <meta property="og:url"         content={`${SITE_URL}/contact`} />
        <meta name="twitter:card"       content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-24">
          <motion.div className="max-w-xl" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Get in touch</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white font-medium leading-[1.08] mb-4">Contact us.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">
              {whatsapp
                ? "Call, WhatsApp or fill in the form below and we'll be in touch within 2 hours."
                : "Call or fill in the form below and we'll be in touch within 2 hours."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left — contact details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Practice card */}
              <motion.div className="bg-brand-cream border border-brand-border rounded-xl p-6 space-y-4" {...fade(0)}>
                <h2 className="font-serif text-xl text-brand-dark font-medium">{name}</h2>

                <a href={`tel:${phoneTel}`} className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors">{phone}</span>
                </a>

                {practiceEmail && (
                  <a href={`mailto:${practiceEmail}`} className="flex items-start gap-3 group">
                    <Mail className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors break-all">{practiceEmail}</span>
                  </a>
                )}

                <address className="flex items-start gap-3 not-italic">
                  <MapPin className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-brand-dark">{address}</span>
                </address>

                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full justify-center bg-[#25D366] text-white font-sans font-medium text-sm rounded-full py-3 hover:opacity-90 transition-opacity mt-2">
                    <MessageCircle className="w-4 h-4" /> WhatsApp us
                  </a>
                )}
              </motion.div>

              {/* Hours */}
              <motion.div className="bg-brand-cream border border-brand-border rounded-xl p-6" {...fade(0.1)}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-brand-green" />
                  <h3 className="font-serif text-lg text-brand-dark font-medium">Opening hours</h3>
                </div>
                <ul className="space-y-2">
                  {hours.map((h, i) => {
                    const [mainHours, lunchNote] = h.closed ? [] : h.hours.split(' (')
                    return (
                      <li key={i} className="font-sans text-sm">
                        <div className="flex justify-between">
                          <span className="text-brand-muted">{h.day}</span>
                          <span className={`font-medium ${h.closed ? 'text-brand-subtle' : 'text-brand-dark'}`}>
                            {h.closed ? 'Closed' : mainHours}
                          </span>
                        </div>
                        {lunchNote && (
                          <p className="text-brand-subtle text-xs text-right mt-0.5">({lunchNote}</p>
                        )}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-4 font-sans text-xs text-brand-subtle">Hours may vary on bank holidays. Please call to confirm.</p>
              </motion.div>

              {/* Getting here */}
              {gettingHere.length > 0 && (
                <motion.div className="bg-brand-cream border border-brand-border rounded-xl p-6" {...fade(0.15)}>
                  <h3 className="font-serif text-lg text-brand-dark font-medium mb-3">Getting here</h3>
                  {gettingHere.map((line, i) => (
                    <p key={i} className={`font-sans text-sm text-brand-muted leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>{line}</p>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right — contact form */}
            <div className="lg:col-span-3">
              <motion.div {...fade(0.05)}>
                <h2 className="font-serif text-2xl text-brand-dark font-medium mb-6">Send us a message</h2>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="w-full h-80 lg:h-96 bg-brand-border">
        <iframe
          title={`${name} — map`}
          width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="border-0" aria-label={`Map showing ${name} location`}
        />
      </div>
    </>
  )
}
