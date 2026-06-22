import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import ContactForm from '../components/forms/ContactForm'
import { SITE_URL } from '../utils/seo'

function fade(d=0){return{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.45,delay:d,ease:'easeOut'}}}

const HOURS = [
  { day:'Monday – Thursday', hours:'8:30 am – 6:00 pm' },
  { day:'Friday',            hours:'8:30 am – 5:00 pm' },
  { day:'Saturday',          hours:'9:00 am – 2:00 pm' },
  { day:'Sunday',            hours:'Closed' },
]

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Octavia Dental & Facial Aesthetics Godalming</title>
        <meta name="description" content="Contact Octavia Dental & Facial Aesthetics in Godalming, Surrey. Call 01483 860020, WhatsApp us or send a message. Seymour House, Lower South Street, GU7 1BZ." />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title"       content="Contact Us | Octavia Dental & Facial Aesthetics" />
        <meta property="og:description" content="Call 01483 860020 or send a message. Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ." />
        <meta property="og:url"         content={`${SITE_URL}/contact`} />
        <meta name="twitter:card"       content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-24">
          <motion.div className="max-w-xl" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Get in touch</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white font-medium leading-[1.08] mb-4">Contact us.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">We would love to hear from you. Call, WhatsApp or fill in the form below and we will be in touch within 2 hours.</p>
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
                <h2 className="font-serif text-xl text-brand-dark font-medium">Octavia Dental & Facial Aesthetics</h2>

                <a href="tel:01483860020" className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors">01483 860020</span>
                </a>

                <a href="mailto:info@octavia-dental.co.uk" className="flex items-start gap-3 group">
                  <Mail className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-brand-dark group-hover:text-brand-green transition-colors break-all">info@octavia-dental.co.uk</span>
                </a>

                <address className="flex items-start gap-3 not-italic">
                  <MapPin className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-sm text-brand-dark">
                    Seymour House<br />Lower South Street<br />Godalming, Surrey<br />GU7 1BZ
                  </span>
                </address>

                <a href="https://wa.me/447584965468" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center bg-[#25D366] text-white font-sans font-medium text-sm rounded-full py-3 hover:opacity-90 transition-opacity mt-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp us
                </a>
              </motion.div>

              {/* Hours */}
              <motion.div className="bg-brand-cream border border-brand-border rounded-xl p-6" {...fade(0.1)}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-brand-green" />
                  <h3 className="font-serif text-lg text-brand-dark font-medium">Opening hours</h3>
                </div>
                <ul className="space-y-2">
                  {HOURS.map(h => (
                    <li key={h.day} className="flex justify-between font-sans text-sm">
                      <span className="text-brand-muted">{h.day}</span>
                      <span className={`font-medium ${h.hours === 'Closed' ? 'text-brand-subtle' : 'text-brand-dark'}`}>{h.hours}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-sans text-xs text-brand-subtle">Hours may vary on bank holidays. Please call to confirm.</p>
              </motion.div>

              {/* Parking */}
              <motion.div className="bg-brand-cream border border-brand-border rounded-xl p-6" {...fade(0.15)}>
                <h3 className="font-serif text-lg text-brand-dark font-medium mb-3">Getting here</h3>
                <p className="font-sans text-sm text-brand-muted leading-relaxed mb-2">Parking is available on Lower South Street (pay-and-display) and at Flambard Way car park, a 3-minute walk from the practice.</p>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">Godalming railway station is a 7-minute walk. Regular services from London Waterloo, Guildford and Haslemere.</p>
              </motion.div>
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
          title="Octavia Dental & Facial Aesthetics — Godalming"
          width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=Seymour+House,+Lower+South+Street,+Godalming,+GU7+1BZ&output=embed&z=16"
          className="border-0" aria-label="Map showing Octavia Dental location"
        />
      </div>
    </>
  )
}
