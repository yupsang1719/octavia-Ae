import { Helmet } from 'react-helmet-async'
import Hero           from '../components/sections/Hero'
import TrustBar       from '../components/sections/TrustBar'
import ServicesGrid   from '../components/sections/ServicesGrid'
import USPSection     from '../components/sections/USPSection'
import TeamSection    from '../components/sections/TeamSection'
import ReviewsMarquee from '../components/sections/ReviewsMarquee'
import GalleryPreview from '../components/sections/GalleryPreview'
import LocationsBar   from '../components/sections/LocationsBar'
import BlogPreview    from '../components/sections/BlogPreview'
import CTASection     from '../components/sections/CTASection'
import SchemaMarkup   from '../components/ui/SchemaMarkup'
import { dentalClinicSchema } from '../utils/schema'
import { SITE_URL } from '../utils/seo'
import { usePractice } from '../contexts/PracticeContext'

export default function Home() {
  const { metaTitle, metaDesc } = usePractice()

  const title = metaTitle || 'Private Dentist Godalming | Octavia Dental & Facial Aesthetics'
  const desc  = metaDesc  || 'Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, anti-wrinkle injections. No waiting list. New patients welcome.'

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={SITE_URL} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image"       content={`${SITE_URL}/images/og-default.webp`} />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image"       content={`${SITE_URL}/images/og-default.webp`} />
      </Helmet>

      <SchemaMarkup schema={dentalClinicSchema} />

      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Trust Bar */}
      <TrustBar />

      {/* Section 3: Services */}
      <ServicesGrid />

      {/* Section 4: USPs + NHS card */}
      <USPSection />

      {/* Section 5: Team */}
      <TeamSection />

      {/* Section 6: Reviews marquee — only renders if published reviews exist */}
      <ReviewsMarquee />

      {/* Section 7: Gallery preview */}
      <GalleryPreview />

      {/* Section 7: Locations bar */}
      <LocationsBar />

      {/* Section 9: Blog preview */}
      <BlogPreview />

      {/* Section 10: CTA */}
      <CTASection />
    </>
  )
}
