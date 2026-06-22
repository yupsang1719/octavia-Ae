import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-brand-gold fill-current flex-shrink-0" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const GoogleLogo = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

function ReviewCard({ review }) {
  return (
    <div className="flex-none w-[280px] bg-white border border-brand-border/40 rounded-2xl p-6 shadow-sm shadow-brand-dark/4 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating ?? 5 }).map((_, i) => <StarIcon key={i} />)}
        </div>
        <GoogleLogo />
      </div>
      <p className="font-sans text-[13px] text-brand-dark/75 leading-relaxed mb-5 line-clamp-3">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-end justify-between gap-3 pt-4 border-t border-brand-border/40">
        <div>
          <p className="font-sans text-xs font-semibold text-brand-dark leading-tight">{review.author}</p>
          {review.location && (
            <p className="font-sans text-[11px] text-brand-subtle mt-0.5">{review.location}</p>
          )}
        </div>
        {review.treatment && (
          <span className="text-[10px] font-sans font-medium text-brand-gold bg-brand-gold/8 px-2.5 py-1 rounded-full border border-brand-gold/20 whitespace-nowrap">
            {review.treatment}
          </span>
        )}
      </div>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left', speed = 40 }) {
  const [paused, setPaused] = useState(false)
  if (!items.length) return null
  // Duplicate enough times to fill the track
  const fill = Math.max(2, Math.ceil(8 / items.length))
  const track = Array.from({ length: fill }, () => items).flat()
  const doubled = [...track, ...track]
  const animation = direction === 'left'
    ? `marquee-left ${speed}s linear infinite`
    : `marquee-right ${speed}s linear infinite`

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="flex gap-4 py-2"
        style={{
          width: 'max-content',
          animation,
          animationPlayState: paused ? 'paused' : 'running',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review._id ?? review.author}-${i}`} review={review} />
        ))}
      </div>
    </div>
  )
}

function GoogleRatingBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-3 bg-white border border-brand-border/60 rounded-xl px-5 py-3 shadow-sm"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <GoogleLogo />
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
        </div>
        <p className="font-sans text-xs text-brand-muted">
          <span className="font-bold text-brand-dark">5.0</span>
          <span className="text-brand-subtle"> · Google Reviews</span>
        </p>
      </div>
    </motion.div>
  )
}

function FeaturedGrid({ reviews }) {
  return (
    <div className="container-wide">
      <div className={`grid gap-5 max-w-4xl mx-auto ${
        reviews.length === 1 ? 'grid-cols-1 max-w-lg' :
        reviews.length === 2 ? 'sm:grid-cols-2 max-w-2xl' :
        'sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {reviews.map((review, i) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-brand-border/40 rounded-2xl p-6 shadow-sm shadow-brand-dark/4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating ?? 5 }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <GoogleLogo />
            </div>
            <p className="font-sans text-[13px] text-brand-dark/75 leading-relaxed mb-5">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-end justify-between gap-3 pt-4 border-t border-brand-border/40">
              <div>
                <p className="font-sans text-xs font-semibold text-brand-dark leading-tight">{review.author}</p>
                {review.location && <p className="font-sans text-[11px] text-brand-subtle mt-0.5">{review.location}</p>}
              </div>
              {review.treatment && (
                <span className="text-[10px] font-sans font-medium text-brand-gold bg-brand-gold/8 px-2.5 py-1 rounded-full border border-brand-gold/20 whitespace-nowrap">
                  {review.treatment}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const MARQUEE_THRESHOLD = 4

export default function ReviewsMarquee() {
  const [reviews, setReviews] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (loaded && reviews.length === 0) return null

  const useMarquee = reviews.length >= MARQUEE_THRESHOLD
  const mid  = Math.ceil(reviews.length / 2)
  const row1 = reviews.slice(0, mid)
  const row2 = reviews.slice(mid)

  return (
    <section className="section-padding bg-brand-cream overflow-hidden">
      <div className="container-wide mb-14">
        <div className="text-center">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            Patient reviews
          </motion.span>
          <GoldRule className="mx-auto" />
          <AnimatedHeading
            as="h2"
            className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium mb-7 leading-tight tracking-tight"
            delay={0.1}
          >
            What our patients say.
          </AnimatedHeading>
          <GoogleRatingBadge />
        </div>
      </div>

      {useMarquee ? (
        <div className="flex flex-col gap-4">
          <MarqueeRow items={row1} direction="left"  speed={42} />
          <MarqueeRow items={row2.length ? row2 : row1} direction="right" speed={55} />
        </div>
      ) : (
        <FeaturedGrid reviews={reviews} />
      )}

      <motion.p
        className="text-center font-sans text-xs text-brand-subtle mt-10 px-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        All reviews are genuine and unedited. Source verified at time of publication.
      </motion.p>
    </section>
  )
}
