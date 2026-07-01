import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Shield, Award, Heart } from 'lucide-react'
import axios from 'axios'
import TeamCard from '../../components/ui/TeamCard'
import BookingModal from '../../components/ui/BookingModal'
import { useBookingModal } from '../../hooks/useBookingModal'
import { SITE_URL } from '../../utils/seo'

function fade(d = 0) {
  return { initial:{opacity:0,y:18}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.45,delay:d,ease:'easeOut'} }
}

const CATEGORY_ORDER = [
  { key: 'dentist',          label: 'Our specialist dentists' },
  { key: 'hygienist',        label: 'Dental hygienists' },
  { key: 'therapist',        label: 'Dental therapists' },
  { key: 'nurse',            label: 'Dental nurses' },
  { key: 'trainee-nurse',    label: 'Trainee dental nurses' },
  { key: 'practice-manager', label: 'Practice management' },
  { key: 'receptionist',     label: 'Reception & patient care' },
  { key: 'marketing',        label: 'Marketing' },
  { key: 'other',            label: 'Team' },
]

const TRUST_POINTS = [
  {
    icon: Award,
    heading: 'Specialist-led care',
    body: 'Every clinical treatment is led by a specialist — not a generalist. Dr Ali holds a postgraduate diploma in implantology. Dr Ana Biel is a dual-qualified Dentist and Medical Doctor with a Master\'s in Oral Surgery and Implantology.',
  },
  {
    icon: Shield,
    heading: 'GDC registered',
    body: 'All clinicians are registered with the General Dental Council. GDC numbers are available on request. We are regulated by the Care Quality Commission (CQC).',
  },
  {
    icon: Heart,
    heading: 'Patient-centred always',
    body: 'We only recommend what is right for your situation. Free consultations mean there is no pressure — you see the full picture before committing to anything.',
  },
]

export default function OurTeam() {
  const { isOpen, open, close } = useBookingModal()
  const [members, setMembers] = useState([])

  useEffect(() => {
    axios.get('/api/team').then(({ data }) => setMembers(data)).catch(() => {})
  }, [])

  // Group published members by category, preserving CATEGORY_ORDER
  const grouped = CATEGORY_ORDER.map(cat => ({
    ...cat,
    members: members.filter(m => m.category === cat.key),
  })).filter(g => g.members.length > 0)

  return (
    <>
      <Helmet>
        <title>Our Team | Octavia Dental & Facial Aesthetics Godalming</title>
        <meta name="description" content="Meet the specialist dental team at Octavia Dental in Godalming — GDC registered dentists, hygienists, nurses, and support staff." />
        <link rel="canonical" href={`${SITE_URL}/our-team`} />
        <meta property="og:title"       content="Our Team | Octavia Dental & Facial Aesthetics" />
        <meta property="og:description" content="Meet the team at Octavia Dental, Godalming — specialist dentists and supporting staff." />
        <meta name="twitter:card"       content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-28">
          <motion.div className="max-w-2xl" {...fade(0)}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">The team</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">
              Specialists you can trust.
            </h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">
              Two specialist dentists. One clinic. Everything under one roof in Godalming, Surrey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team by category */}
      {grouped.map((group, gi) => (
        <section key={group.key} className={`section-padding ${gi % 2 === 0 ? 'bg-white' : 'bg-brand-cream'}`}>
          <div className="container-wide">
            <motion.h2
              className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-2"
              {...fade(0)}
            >
              {group.label}
            </motion.h2>
            <motion.p className="font-sans text-brand-muted mb-10 text-sm" {...fade(0.08)}>
              {group.key === 'dentist' ? 'Click a card to read more about each clinician.' : 'GDC registered. Available on request.'}
            </motion.p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
              {group.members.map((member, i) => (
                <motion.div key={member._id} {...fade(i * 0.1)}>
                  <TeamCard member={member} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Trust points */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-10" {...fade(0)}>
            Why patients choose our team
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TRUST_POINTS.map(({ icon: Icon, heading, body }, i) => (
              <motion.div
                key={heading}
                className="bg-white border border-brand-border rounded-sm p-6"
                {...fade(i * 0.1)}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-green-bg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-green" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-brand-dark font-medium mb-2">{heading}</h3>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting team card (reception/admin who aren't in CMS yet) */}
      {!grouped.find(g => g.key === 'receptionist') && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <motion.h2 className="font-serif text-3xl lg:text-4xl text-brand-dark font-medium mb-6" {...fade(0)}>
              Supporting team
            </motion.h2>
            <div className="max-w-xl">
              <motion.div className="bg-brand-cream border border-brand-border rounded-sm p-6" {...fade(0.1)}>
                <h3 className="font-serif text-lg text-brand-dark font-medium mb-1">Reception & Patient Care</h3>
                <p className="font-sans text-sm text-brand-green font-medium mb-3">Front of house</p>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">
                  Our friendly reception team are here to make every visit to Octavia Dental as smooth and comfortable as possible — from booking your first appointment to supporting you throughout treatment.
                </p>
                <div className="mt-4 pt-4 border-t border-brand-border flex flex-wrap gap-4 text-sm font-sans">
                  <a href="tel:01483860020" className="text-brand-green hover:underline">01483 860020</a>
                  <a href="mailto:info@octavia-dental.co.uk" className="text-brand-green hover:underline">info@octavia-dental.co.uk</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-brand-green">
        <div className="container-wide text-center">
          <motion.div {...fade(0)}>
            <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">Ready to meet the team?</h2>
            <p className="font-sans text-white/70 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Book a free consultation and take the first step towards the smile you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => open()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-green font-sans font-medium text-sm rounded-sm hover:bg-brand-cream transition-all"
              >
                Book free consultation
              </button>
              <a
                href="https://wa.me/447584965468"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-sans font-medium text-sm rounded-sm hover:bg-white/10 transition-all"
              >
                WhatsApp us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
