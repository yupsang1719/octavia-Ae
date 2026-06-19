import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | Octavia Dental</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="pt-16 min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center max-w-md px-4">
          <p className="font-display text-8xl font-medium text-brand-green/20 mb-4">404</p>
          <h1 className="font-serif text-3xl text-brand-dark font-medium mb-3">Page not found</h1>
          <p className="font-sans text-brand-muted mb-8 leading-relaxed">The page you are looking for may have moved or no longer exists. Try one of the links below.</p>
          <div className="flex flex-col gap-2 items-center">
            {[
              { label:'Homepage', href:'/' },
              { label:'Our treatments', href:'/treatments/dental-implants' },
              { label:'Contact us', href:'/contact' },
              { label:'Book free consultation', href:'/contact' },
            ].map(link => (
              <Link key={link.href} to={link.href}
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-green hover:gap-3 transition-all duration-200">
                {link.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
