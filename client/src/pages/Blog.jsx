import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import axios from 'axios'
import { formatDate, readTime } from '../utils/formatters'
import { SITE_URL } from '../utils/seo'

const CATEGORIES = ['All','Dental','Facial Aesthetics','Local','News']
const CAT_MAP = { All:'', Dental:'dental', 'Facial Aesthetics':'aesthetics', Local:'local', News:'news' }
const CAT_LABELS = { dental:'Dental', aesthetics:'Facial Aesthetics', local:'Local', news:'News' }

function fade(d=0){return{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.45,delay:d,ease:'easeOut'}}}

export default function Blog() {
  const [category, setCategory] = useState('All')
  const [posts, setPosts]       = useState([])

  useEffect(() => {
    const cat = CAT_MAP[category]
    const url = cat ? `/api/blog/category/${cat}` : '/api/blog?limit=12'
    axios.get(url).then(({ data }) => {
      const arr = Array.isArray(data) ? data : data.posts
      if (arr?.length) setPosts(arr)
    }).catch(() => {})
  }, [category])

  const displayed = category === 'All' ? posts : posts.filter(p => p.category === CAT_MAP[category])

  return (
    <>
      <Helmet>
        <title>Blog | Dental & Aesthetics Advice | Octavia Dental Godalming</title>
        <meta name="description" content="Advice and insights from Dr Ali and Dr Ana at Octavia Dental in Godalming. Dental tips, treatment guides and facial aesthetics advice for Surrey & Hampshire patients." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
      </Helmet>

      <section className="bg-brand-green pt-16">
        <div className="container-wide py-20 lg:py-24">
          <motion.div className="max-w-2xl" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">From the practice</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.08] mb-4">Advice & insights.</h1>
            <p className="font-sans text-lg text-white/70 leading-relaxed">Honest guidance on dental treatments and facial aesthetics from Dr Ali and Dr Ana.</p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <div className="bg-white border-b border-brand-border sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-sans font-medium transition-colors duration-200 ${category===cat ? 'bg-brand-green text-white' : 'text-brand-muted hover:text-brand-green bg-brand-green-bg'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-brand-muted">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((post, i) => (
                <motion.article key={post._id || post.slug} {...fade(i * 0.07)}>
                  <Link to={`/blog/${post.slug}`} className="group block bg-white border border-brand-border rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {post.featuredImg && (
                      <div className="aspect-video overflow-hidden">
                        <img src={post.featuredImg} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {post.category && <span className="text-xs font-sans font-medium text-brand-green bg-brand-green-bg px-2.5 py-0.5 rounded-full">{CAT_LABELS[post.category] || post.category}</span>}
                        <span className="flex items-center gap-1 text-xs font-sans text-brand-subtle"><Clock className="w-3 h-3" />{readTime(post.excerpt)}</span>
                      </div>
                      <h2 className="font-serif text-lg text-brand-dark font-medium leading-snug mb-2 group-hover:text-brand-green transition-colors duration-200">{post.title}</h2>
                      <p className="font-sans text-sm text-brand-muted line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs font-sans text-brand-subtle">
                        <span>{post.author}</span>
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
