import { Helmet } from 'react-helmet-async'
import Hero           from '../components/sections/Hero'
import TrustBar       from '../components/sections/TrustBar'
import ServicesGrid   from '../components/sections/ServicesGrid'
import USPSection     from '../components/sections/USPSection'
import TeamSection    from '../components/sections/TeamSection'
import GalleryPreview from '../components/sections/GalleryPreview'
import LocationsBar   from '../components/sections/LocationsBar'
import BlogPreview    from '../components/sections/BlogPreview'
import CTASection     from '../components/sections/CTASection'
import SchemaMarkup   from '../components/ui/SchemaMarkup'
import { dentalClinicSchema } from '../utils/schema'
import { SITE_URL } from '../utils/seo'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Private Dentist Godalming | Octavia Dental &amp; Facial Aesthetics</title>
        <meta name="description" content="Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, Botox. No waiting list. New patients welcome." />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={SITE_URL} />
        <meta property="og:title"       content="Private Dentist Godalming | Octavia Dental & Facial Aesthetics" />
        <meta property="og:description" content="Private dental & facial aesthetics in Godalming, Surrey. Implants, Invisalign, composite bonding, Botox. No waiting list." />
        <meta property="og:image"       content={`${SITE_URL}/images/og-default.webp`} />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Private Dentist Godalming | Octavia Dental & Facial Aesthetics" />
        <meta name="twitter:description" content="Private dental & facial aesthetics in Godalming, Surrey. No waiting list. New patients welcome." />
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

      {/* Section 6: Gallery preview */}
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
