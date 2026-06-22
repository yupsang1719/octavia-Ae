import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, Share2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import SchemaMarkup from '../components/ui/SchemaMarkup'
import BookingModal from '../components/ui/BookingModal'
import { useBookingModal } from '../hooks/useBookingModal'
import { blogPostSchema } from '../utils/schema'
import { formatDate, readTime } from '../utils/formatters'
import { SITE_URL } from '../utils/seo'

function ShareButtons({ title, slug }) {
  const url = `${SITE_URL}/blog/${slug}`
  const waText = encodeURIComponent(`${title} — ${url}`)
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-sm text-brand-muted flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Share:</span>
      <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
        className="text-xs font-sans px-3 py-1.5 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity">
        WhatsApp
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"
        className="text-xs font-sans px-3 py-1.5 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity">
        Facebook
      </a>
      <button onClick={copyLink}
        className="text-xs font-sans px-3 py-1.5 bg-brand-cream border border-brand-border text-brand-muted rounded-full hover:border-brand-green transition-colors">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost]       = useState(null)
  const [related, setRelated] = useState([])
  const [notFound, setNotFound] = useState(false)
  const { isOpen, open, close } = useBookingModal()

  useEffect(() => {
    setPost(null); setNotFound(false); setRelated([])
    axios.get(`/api/blog/${slug}`).then(({ data }) => {
      setPost(data)
      if (data.category) {
        axios.get(`/api/blog/category/${data.category}`).then(({ data: rel }) => {
          const arr = Array.isArray(rel) ? rel : []
          setRelated(arr.filter(p => p.slug !== slug).slice(0, 2))
        }).catch(() => {})
      }
    }).catch(() => {
      setNotFound(true)
    })
  }, [slug])

  if (notFound) return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-cream">
      <p className="font-serif text-3xl text-brand-dark">Article not found</p>
      <Link to="/blog" className="btn-secondary text-sm">Back to blog</Link>
    </div>
  )

  if (!post) return (
    <div className="pt-16 min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const schema = blogPostSchema({ title:post.title, description:post.excerpt, slug:post.slug, publishedAt:post.publishedAt, author:post.author, image:post.featuredImg })

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title} | Octavia Dental Godalming</title>
        <meta name="description" content={post.seoDesc || post.excerpt} />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        {post.featuredImg && <meta property="og:image" content={post.featuredImg} />}
      </Helmet>
      <SchemaMarkup schema={schema} />

      {/* Hero */}
      <div className="pt-16 bg-brand-cream border-b border-brand-border">
        <div className="container-wide max-w-4xl py-12 lg:py-16">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.45}}>
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-sans text-brand-muted hover:text-brand-green transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              {post.category && <span className="text-xs font-sans font-medium text-brand-green bg-brand-green-bg px-2.5 py-0.5 rounded-full capitalize">{post.category}</span>}
              <span className="flex items-center gap-1 text-xs font-sans text-brand-subtle"><Clock className="w-3 h-3"/>{readTime(post.body || post.excerpt)}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-dark font-medium leading-tight mb-4">{post.title}</h1>
            <p className="font-sans text-brand-muted leading-relaxed mb-6 text-lg">{post.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-green-bg flex items-center justify-center">
                  <span className="font-sans text-xs font-semibold text-brand-green">{post.author?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-brand-dark">{post.author}</p>
                  <p className="font-sans text-xs text-brand-subtle">{post.publishedAt ? formatDate(post.publishedAt) : ''}</p>
                </div>
              </div>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </motion.div>
        </div>
      </div>

      {post.featuredImg && (
        <div className="container-wide max-w-4xl">
          <img src={post.featuredImg} alt={post.title} className="w-full aspect-video object-cover" loading="eager" />
        </div>
      )}

      {/* Body */}
      <div className="container-wide max-w-3xl py-12 lg:py-16">
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-dark prose-p:font-sans prose-p:text-brand-muted prose-p:leading-relaxed prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline max-w-none">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {/* Bottom share */}
        <div className="mt-10 pt-8 border-t border-brand-border">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-brand-dark font-medium mb-6">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group block bg-brand-cream border border-brand-border rounded-sm p-5 hover:shadow-sm transition-shadow">
                  <p className="font-serif text-base text-brand-dark font-medium group-hover:text-brand-green transition-colors leading-snug mb-2">{p.title}</p>
                  <p className="font-sans text-xs text-brand-subtle">{p.author} · {p.publishedAt ? formatDate(p.publishedAt) : ''}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Inline CTA */}
        <div className="mt-12 bg-brand-green rounded-sm p-8 text-center">
          <h3 className="font-serif text-2xl text-white font-medium mb-3">Have a question?</h3>
          <p className="font-sans text-white/70 mb-6 text-sm">Book a free consultation with Dr Ali or Dr Ana and get expert advice tailored to your situation.</p>
          <button onClick={() => open()} className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-green font-sans font-medium text-sm rounded-sm hover:bg-brand-cream transition-all">
            Book free consultation
          </button>
        </div>
      </div>

      <BookingModal isOpen={isOpen} onClose={close} />
    </>
  )
}
