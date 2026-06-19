import { motion } from 'framer-motion'
import ReviewCard from '../ui/ReviewCard'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

const reviews = [
  {
    author: 'Sarah M.',
    location: 'Guildford',
    treatment: 'Composite Bonding',
    rating: 5,
    text: 'I cannot believe the difference in my smile. Dr Ana was so reassuring throughout and the results are absolutely stunning. I only wish I had done this sooner.',
    source: 'google',
  },
  {
    author: 'James T.',
    location: 'Haslemere',
    treatment: 'Dental Implants',
    rating: 5,
    text: 'After years of avoiding the dentist, Dr Ali made the whole implant process completely stress-free. The team are incredibly professional and the practice is spotless. Highly recommend.',
    source: 'google',
  },
  {
    author: 'Emma L.',
    location: 'Godalming',
    treatment: 'Invisalign',
    rating: 5,
    text: "Best decision I've made. The Invisalign results were even better than I expected — and nobody at work even noticed I was wearing them. Brilliant practice.",
    source: 'google',
  },
]

function GoogleRatingBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-3 bg-white border border-brand-border/60 rounded-xl px-5 py-3 shadow-sm"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {[1,2,3,4,5].map(i => (
            <svg key={i} className="w-3.5 h-3.5 text-brand-gold fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="font-sans text-xs text-brand-muted">
          <span className="font-bold text-brand-dark">5.0</span>{' '}
          <span className="text-brand-subtle">· Google Reviews</span>
        </p>
      </div>
    </motion.div>
  )
}

export default function ReviewsSection() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-14">
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

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center font-sans text-xs text-brand-subtle mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          All reviews are genuine and unedited. Source verified at time of publication.
        </motion.p>
      </div>
    </section>
  )
}
