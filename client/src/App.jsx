import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar        from './components/layout/Navbar'
import Footer        from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import StickyBookBtn from './components/layout/StickyBookBtn'
import ConsentBanner from './components/ui/ConsentBanner'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout   from './components/admin/AdminLayout'

// ── Public pages ──────────────────────────────────────────────────────────────
const Home             = lazy(() => import('./pages/Home'))
const DentalImplants   = lazy(() => import('./pages/treatments/DentalImplants'))
const Invisalign       = lazy(() => import('./pages/treatments/Invisalign'))
const CompositeBonding = lazy(() => import('./pages/treatments/CompositeBonding'))
const Veneers          = lazy(() => import('./pages/treatments/Veneers'))
const TeethWhitening   = lazy(() => import('./pages/treatments/TeethWhitening'))
const SixMonthSmile    = lazy(() => import('./pages/treatments/SixMonthSmile'))
const AirFlowHygiene   = lazy(() => import('./pages/treatments/AirFlowHygiene'))
const Botox            = lazy(() => import('./pages/treatments/Botox'))
const FacialAesthetics = lazy(() => import('./pages/aesthetics/FacialAesthetics'))
const Godalming        = lazy(() => import('./pages/locations/Godalming'))
const Guildford        = lazy(() => import('./pages/locations/Guildford'))
const Haslemere        = lazy(() => import('./pages/locations/Haslemere'))
const Farnham          = lazy(() => import('./pages/locations/Farnham'))
const Cranleigh        = lazy(() => import('./pages/locations/Cranleigh'))
const Hampshire        = lazy(() => import('./pages/locations/Hampshire'))
const NHSAlternative   = lazy(() => import('./pages/locations/NHSAlternative'))
const OurTeam          = lazy(() => import('./pages/team/OurTeam'))
const TeamMemberSlug   = lazy(() => import('./pages/team/TeamMemberSlug'))
const Gallery          = lazy(() => import('./pages/Gallery'))
const Blog             = lazy(() => import('./pages/Blog'))
const BlogPost         = lazy(() => import('./pages/BlogPost'))
const Contact          = lazy(() => import('./pages/Contact'))
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'))
const CookiePolicy     = lazy(() => import('./pages/CookiePolicy'))
const NotFound         = lazy(() => import('./pages/NotFound'))

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminEnquiries  = lazy(() => import('./pages/admin/AdminEnquiries'))
const AdminBlog       = lazy(() => import('./pages/admin/AdminBlog'))
const AdminBlogEditor = lazy(() => import('./pages/admin/AdminBlogEditor'))
const AdminGallery    = lazy(() => import('./pages/admin/AdminGallery'))
const AdminTeam          = lazy(() => import('./pages/admin/AdminTeam'))
const AdminTeamEditor    = lazy(() => import('./pages/admin/AdminTeamEditor'))
const AdminReviews       = lazy(() => import('./pages/admin/AdminReviews'))
const AdminTrustBar      = lazy(() => import('./pages/admin/AdminTrustBar'))
const AdminReviewRequest    = lazy(() => import('./pages/admin/AdminReviewRequest'))
const AdminTreatments       = lazy(() => import('./pages/admin/AdminTreatments'))
const AdminTreatmentEditor  = lazy(() => import('./pages/admin/AdminTreatmentEditor'))

// ── Helpers ───────────────────────────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyBookBtn />
      <ConsentBanner />
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Helmet
        defaultTitle="Octavia Dental & Facial Aesthetics | Godalming, Surrey"
        titleTemplate="%s"
      >
        <meta name="description"       content="Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, Botox. No waiting list. New patients welcome." />
        <link rel="canonical"          href="https://octavia-dental.co.uk" />
        <meta name="robots"            content="index, follow" />
        <meta name="author"            content="Octavia Dental & Facial Aesthetics" />
        <meta property="og:site_name"  content="Octavia Dental & Facial Aesthetics" />
        <meta property="og:type"       content="website" />
        <meta property="og:image"      content="https://octavia-dental.co.uk/images/og-default.webp" />
        <meta name="twitter:card"      content="summary_large_image" />
        <meta name="twitter:image"     content="https://octavia-dental.co.uk/images/og-default.webp" />
      </Helmet>

      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"                              element={<Home />} />
            <Route path="/treatments/dental-implants"    element={<DentalImplants />} />
            <Route path="/treatments/invisalign"         element={<Invisalign />} />
            <Route path="/treatments/composite-bonding"  element={<CompositeBonding />} />
            <Route path="/treatments/veneers"            element={<Veneers />} />
            <Route path="/treatments/teeth-whitening"    element={<TeethWhitening />} />
            <Route path="/treatments/six-month-smile"    element={<SixMonthSmile />} />
            <Route path="/treatments/air-flow-hygiene"   element={<AirFlowHygiene />} />
            <Route path="/treatments/botox-anti-wrinkle" element={<Botox />} />
            <Route path="/facial-aesthetics"             element={<FacialAesthetics />} />
            <Route path="/dentist-godalming"             element={<Godalming />} />
            <Route path="/dentist-guildford"             element={<Guildford />} />
            <Route path="/dentist-haslemere"             element={<Haslemere />} />
            <Route path="/dentist-farnham"               element={<Farnham />} />
            <Route path="/dentist-cranleigh"             element={<Cranleigh />} />
            <Route path="/dentist-hampshire"             element={<Hampshire />} />
            <Route path="/nhs-alternative-surrey"        element={<NHSAlternative />} />
            <Route path="/our-team"                      element={<OurTeam />} />
            <Route path="/our-team/:slug"                element={<TeamMemberSlug />} />
            <Route path="/gallery"                       element={<Gallery />} />
            <Route path="/blog"                          element={<Blog />} />
            <Route path="/blog/:slug"                    element={<BlogPost />} />
            <Route path="/contact"                       element={<Contact />} />
            <Route path="/privacy-policy"                element={<PrivacyPolicy />} />
            <Route path="/cookie-policy"                 element={<CookiePolicy />} />
            <Route path="*"                              element={<NotFound />} />
          </Route>

          {/* ── Admin routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
          >
            <Route index                  element={<AdminDashboard />} />
            <Route path="enquiries"       element={<AdminEnquiries />} />
            <Route path="blog"            element={<AdminBlog />} />
            <Route path="blog/new"        element={<AdminBlogEditor />} />
            <Route path="blog/edit/:id"   element={<AdminBlogEditor />} />
            <Route path="gallery"         element={<AdminGallery />} />
            <Route path="team"            element={<AdminTeam />} />
            <Route path="team/:id"        element={<AdminTeamEditor />} />
            <Route path="reviews"          element={<AdminReviews />} />
            <Route path="trust-bar"        element={<AdminTrustBar />} />
            <Route path="review-request"       element={<AdminReviewRequest />} />
            <Route path="treatments"            element={<AdminTreatments />} />
            <Route path="treatments/:slug"      element={<AdminTreatmentEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
