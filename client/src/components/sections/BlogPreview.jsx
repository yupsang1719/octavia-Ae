import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import axios from 'axios'
import { formatDate, readTime } from '../../utils/formatters'
import GoldRule from '../ui/GoldRule'
import AnimatedHeading from '../ui/AnimatedHeading'

const CATEGORY_LABELS = {
  dental:     'Dental',
  aesthetics: 'Facial Aesthetics',
  local:      'Local',
  news:       'News',
}

export default function BlogPreview() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get('/api/blog?limit=3').then(({ data }) => {
      if (data.posts?.length) setPosts(data.posts)
    }).catch(() => {/* use placeholders */})
  }, [])

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span
              className="section-label"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              From the practice
            </motion.span>
            <GoldRule delay={0.2} />
            <AnimatedHeading
              as="h2"
              className="font-serif text-4xl lg:text-5xl text-brand-dark font-medium leading-tight tracking-tight"
              delay={0.15}
            >
              Advice & insights.
            </AnimatedHeading>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-green flex-shrink-0 hover:text-brand-green/80 group transition-colors duration-200"
            >
              All articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Post cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post._id || post.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block bg-white border border-brand-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-brand-dark/8 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
              >
                {post.featuredImg && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImg}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="text-xs font-sans font-medium text-brand-green bg-brand-green-bg px-3 py-1 rounded-full">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-sans text-brand-subtle">
                      <Clock className="w-3 h-3" />
                      {readTime(post.excerpt)}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-brand-dark font-medium leading-snug mb-2 tracking-tight group-hover:text-brand-green transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="font-sans text-[13px] text-brand-muted line-clamp-2 leading-relaxed mb-5">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs font-sans text-brand-subtle pt-4 border-t border-brand-border/50">
                    <span>{post.author}</span>
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
