import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

// Only one story plays at a time across the page
let currentlyPlaying = null

function StoryPlayer({ story, large = false }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  function play() {
    setStarted(true)
    // Wait a tick so the native controls render before play()
    requestAnimationFrame(() => ref.current?.play().catch(() => {}))
  }

  function onPlay() {
    if (currentlyPlaying && currentlyPlaying !== ref.current) currentlyPlaying.pause()
    currentlyPlaying = ref.current
  }

  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-brand-dark shadow-lg shadow-brand-dark/10 border border-brand-border/40">
      <video
        ref={ref}
        src={story.videoUrl}
        poster={story.posterUrl}
        preload="none"
        playsInline
        controls={started}
        onPlay={onPlay}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        aria-label={`${story.name} shares their experience`}
      />
      {!started && (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent"
          aria-label={`Play ${story.name}'s story`}
        >
          <span className={`flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-brand-dark shadow-xl transition-transform duration-300 group-hover:scale-110 ${
            large ? 'w-20 h-20' : 'w-14 h-14'
          }`}>
            <Play className={large ? 'w-7 h-7 ml-1' : 'w-5 h-5 ml-0.5'} fill="currentColor" />
          </span>
          {!large && (
            <span className="absolute bottom-3 left-4 right-4 text-left font-sans text-sm font-semibold text-white drop-shadow">
              {story.name}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

function Featured({ story, treatmentLabel }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] mx-auto md:mx-0 md:justify-self-end"
      >
        <StoryPlayer story={story} large />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center md:text-left"
      >
        {story.quote && (
          <blockquote className="font-serif text-2xl lg:text-3xl text-brand-dark leading-snug mb-6">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
        )}
        <p className="font-sans text-sm font-semibold text-brand-dark">{story.name}</p>
        {treatmentLabel && (
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-gold-dk mt-1">
            {treatmentLabel}
          </p>
        )}
      </motion.div>
    </div>
  )
}

/**
 * Video testimonials. Hidden entirely when nothing is published.
 * - treatment: only show stories tagged with this treatment slug
 * - treatmentLabel: label under the patient's name (treatment pages pass their own name)
 */
export default function PatientStories({ treatment, treatmentLabel, heading = 'In their own words.', className = 'bg-white' }) {
  const [stories, setStories] = useState([])
  const [labels, setLabels]   = useState({})

  useEffect(() => {
    const qs = treatment ? `?treatment=${encodeURIComponent(treatment)}` : ''
    fetch(`/api/patient-stories${qs}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setStories(data) })
      .catch(() => {})
  }, [treatment])

  // Home page: map treatment slugs to display names
  useEffect(() => {
    if (treatment || !stories.some(s => s.treatment)) return
    fetch('/api/treatments')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLabels(Object.fromEntries(data.map(t => [t.slug, t.name])))
      })
      .catch(() => {})
  }, [treatment, stories])

  if (!stories.length) return null

  const [first, ...rest] = stories
  const labelFor = s => treatmentLabel || labels[s.treatment] || ''

  return (
    <section className={`section-padding overflow-hidden ${className}`}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            Patient stories
          </motion.span>
          <GoldRule className="mx-auto" />
          <AnimatedHeading
            as="h2"
            className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight tracking-tight"
            delay={0.1}
          >
            {heading}
          </AnimatedHeading>
        </div>

        <Featured story={first} treatmentLabel={labelFor(first)} />

        {rest.length > 0 && (
          <div className="mt-14 -mx-5 px-5 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:mx-auto md:px-0 md:max-w-5xl md:grid md:grid-cols-3 md:overflow-visible">
            {rest.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="flex-none w-[72%] sm:w-[45%] md:w-auto snap-start"
              >
                <StoryPlayer story={s} />
                {(s.quote || labelFor(s)) && (
                  <div className="mt-3 px-1">
                    {s.quote && <p className="font-sans text-[13px] text-brand-dark/75 leading-relaxed line-clamp-2">&ldquo;{s.quote}&rdquo;</p>}
                    {labelFor(s) && (
                      <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-gold-dk mt-1.5">{labelFor(s)}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-center font-sans text-xs text-brand-subtle mt-10 max-w-lg mx-auto">
          Shared with the patient's written consent. Individual results may vary.
        </p>
      </div>
    </section>
  )
}
