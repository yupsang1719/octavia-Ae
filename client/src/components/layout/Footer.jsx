import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const treatments = [
  { label: 'Dental Implants',      href: '/treatments/dental-implants' },
  { label: 'Invisalign',           href: '/treatments/invisalign' },
  { label: 'Composite Bonding',    href: '/treatments/composite-bonding' },
  { label: 'Porcelain Veneers',    href: '/treatments/veneers' },
  { label: 'Teeth Whitening',      href: '/treatments/teeth-whitening' },
  { label: '6 Month Smile',        href: '/treatments/six-month-smile' },
  { label: 'Air Flow Hygiene',     href: '/treatments/air-flow-hygiene' },
  { label: 'Botox & Anti-Wrinkle', href: '/treatments/botox-anti-wrinkle' },
]

const locationLinks = [
  { label: 'Godalming',   href: '/dentist-godalming' },
  { label: 'Guildford',   href: '/dentist-guildford' },
  { label: 'Haslemere',   href: '/dentist-haslemere' },
  { label: 'Farnham',     href: '/dentist-farnham' },
  { label: 'Cranleigh',   href: '/dentist-cranleigh' },
  { label: 'Hampshire',   href: '/dentist-hampshire' },
]

const practice = [
  { label: 'Our Team',           href: '/our-team' },
  { label: 'Gallery',            href: '/gallery' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Contact',            href: '/contact' },
  { label: 'NHS Alternative',    href: '/nhs-alternative-surrey' },
  { label: 'Privacy Policy',     href: '/privacy-policy' },
  { label: 'Cookie Policy',      href: '/cookie-policy' },
]

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-[13px] font-sans text-white/55 hover:text-brand-gold transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-brand-dark text-white">
      {/* Gold accent top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="container-wide py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <p className="font-serif text-base text-white font-medium">Stay in the know</p>
              <p className="font-sans text-[13px] text-white/45 mt-0.5">Tips, news and exclusive offers from Octavia Dental.</p>
            </div>
            {subscribed ? (
              <p className="font-sans text-sm text-brand-gold font-medium">Thank you — you're on the list.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center w-full sm:w-auto sm:min-w-[320px]">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white/8 border border-white/12 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white/12 transition-all duration-200 pr-14"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center hover:bg-brand-gold-dk transition-colors duration-200 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Practice info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Octavia Dental"
                className="w-11 h-11 rounded-xl object-contain bg-white flex-shrink-0"
                loading="lazy"
              />
              <div className="leading-none">
                <h2 className="font-serif text-lg text-white font-medium tracking-tight leading-none">
                  Octavia Dental
                </h2>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-brand-gold/60 mt-1.5 font-medium">
                  & Facial Aesthetics
                </p>
              </div>
            </div>
            <p className="font-sans text-[13px] text-white/55 mb-6 leading-relaxed">
              Private dental & facial aesthetics in Godalming, Surrey. No waiting list. New patients welcome.
            </p>
            <ul className="space-y-3">
              <li>
                <a href="tel:01483860020" className="flex items-start gap-2.5 text-[13px] text-white/55 hover:text-brand-gold transition-colors duration-200 font-sans">
                  <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  01483 860020
                </a>
              </li>
              <li>
                <a href="mailto:info@octavia-dental.co.uk" className="flex items-start gap-2.5 text-[13px] text-white/55 hover:text-brand-gold transition-colors duration-200 font-sans">
                  <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  info@octavia-dental.co.uk
                </a>
              </li>
              <li>
                <address className="flex items-start gap-2.5 text-[13px] text-white/55 not-italic font-sans">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  Seymour House, Lower South Street,<br />
                  Godalming, Surrey, GU7 1BZ
                </address>
              </li>
              <li>
                <a
                  href="https://instagram.com/octaviadental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-white/55 hover:text-brand-gold transition-colors duration-200 font-sans"
                >
                  <InstagramIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  @octaviadental
                </a>
              </li>
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-5">
              Treatments
            </h3>
            <ul className="space-y-2.5">
              {treatments.map(t => (
                <FooterLink key={t.href} to={t.href}>{t.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-5">
              We Serve
            </h3>
            <ul className="space-y-2.5">
              {locationLinks.map(l => (
                <FooterLink key={l.href} to={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Practice */}
          <div>
            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-5">
              Practice
            </h3>
            <ul className="space-y-2.5">
              {practice.map(l => (
                <FooterLink key={l.href} to={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans text-white/30">
          <p>© {new Date().getFullYear()} Octavia Dental & Facial Aesthetics. All rights reserved.</p>
          <p>
            GDC registered clinicians.{' '}
            <Link to="/contact" className="underline hover:text-white/50 transition-colors duration-200">
              Complaints procedure
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
