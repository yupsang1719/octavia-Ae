import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar        from './components/layout/Navbar'
import Footer        from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import StickyBookBtn from './components/layout/StickyBookBtn'
import ConsentBanner from './components/ui/ConsentBanner'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ManagerRoute   from './components/admin/ManagerRoute'
import AdminLayout   from './components/admin/AdminLayout'
import { useAuth } from './contexts/AuthContext'

// ── Public pages ──────────────────────────────────────────────────────────────
const Home             = lazy(() => import('./pages/Home'))
const DentalImplants   = lazy(() => import('./pages/treatments/DentalImplants'))
const Invisalign       = lazy(() => import('./pages/treatments/Invisalign'))
const CompositeBonding = lazy(() => import('./pages/treatments/CompositeBonding'))
const Veneers          = lazy(() => import('./pages/treatments/Veneers'))
const TeethWhitening   = lazy(() => import('./pages/treatments/TeethWhitening'))
const SixMonthSmile    = lazy(() => import('./pages/treatments/SixMonthSmile'))
const AirFlowHygiene   = lazy(() => import('./pages/treatments/AirFlowHygiene'))
const Botox              = lazy(() => import('./pages/treatments/Botox'))
const GeneralDentistry   = lazy(() => import('./pages/treatments/GeneralDentistry'))
const RootCanal          = lazy(() => import('./pages/treatments/RootCanal'))
const Fillings           = lazy(() => import('./pages/treatments/Fillings'))
const Crowns             = lazy(() => import('./pages/treatments/Crowns'))
const Bridges            = lazy(() => import('./pages/treatments/Bridges'))
const Dentures           = lazy(() => import('./pages/treatments/Dentures'))
const FacialAesthetics = lazy(() => import('./pages/aesthetics/FacialAesthetics'))
const Godalming        = lazy(() => import('./pages/locations/Godalming'))
const Guildford        = lazy(() => import('./pages/locations/Guildford'))
const Haslemere        = lazy(() => import('./pages/locations/Haslemere'))
const Farnham          = lazy(() => import('./pages/locations/Farnham'))
const Cranleigh        = lazy(() => import('./pages/locations/Cranleigh'))
const Hampshire        = lazy(() => import('./pages/locations/Hampshire'))
const NHSAlternative   = lazy(() => import('./pages/locations/NHSAlternative'))
const NHSBand1         = lazy(() => import('./pages/nhs/Band1'))
const NHSBand2         = lazy(() => import('./pages/nhs/Band2'))
const NHSBand3         = lazy(() => import('./pages/nhs/Band3'))
const Hindhead         = lazy(() => import('./pages/locations/Hindhead'))
const Liphook          = lazy(() => import('./pages/locations/Liphook'))
const Grayshott        = lazy(() => import('./pages/locations/Grayshott'))
const Bordon           = lazy(() => import('./pages/locations/Bordon'))
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
const AdminTrustBar             = lazy(() => import('./pages/admin/AdminTrustBar'))
const AdminOpeningHours         = lazy(() => import('./pages/admin/AdminOpeningHours'))
const AdminReviewRequest        = lazy(() => import('./pages/admin/AdminReviewRequest'))
const AdminTreatments           = lazy(() => import('./pages/admin/AdminTreatments'))
const AdminTreatmentEditor      = lazy(() => import('./pages/admin/AdminTreatmentEditor'))
const AdminNHSBands             = lazy(() => import('./pages/admin/AdminNHSBands'))
const AdminPatients             = lazy(() => import('./pages/admin/AdminPatients'))
const AdminEmailTemplates       = lazy(() => import('./pages/admin/AdminEmailTemplates'))
const AdminEmailTemplateEditor  = lazy(() => import('./pages/admin/AdminEmailTemplateEditor'))
const AdminPracticeSettings     = lazy(() => import('./pages/admin/AdminPracticeSettings'))

// ── Stock pages ───────────────────────────────────────────────────────────────
const StockDashboard    = lazy(() => import('./pages/admin/stock/StockDashboard'))
const StockGoodsIn      = lazy(() => import('./pages/admin/stock/StockGoodsIn'))
const StockTransfer     = lazy(() => import('./pages/admin/stock/StockTransfer'))
const StockCount        = lazy(() => import('./pages/admin/stock/StockCount'))
const StockQuickLog     = lazy(() => import('./pages/admin/stock/StockQuickLog'))
const StockExpiryWatch  = lazy(() => import('./pages/admin/stock/StockExpiryWatch'))
const StockItems        = lazy(() => import('./pages/admin/stock/StockItems'))

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

// Staff accounts have no use for the general CMS dashboard — send them
// straight to their Stock landing page instead.
function AdminIndex() {
  const { role } = useAuth()
  return role === 'manager' ? <AdminDashboard /> : <Navigate to="/admin/stock" replace />
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
        <meta name="description"       content="Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, anti-wrinkle injections. No waiting list. New patients welcome." />
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
            <Route path="/treatments/botox-anti-wrinkle"    element={<Botox />} />
            <Route path="/treatments/general-dentistry"    element={<GeneralDentistry />} />
            <Route path="/treatments/root-canal"         element={<RootCanal />} />
            <Route path="/treatments/fillings"           element={<Fillings />} />
            <Route path="/treatments/crowns"             element={<Crowns />} />
            <Route path="/treatments/bridges"            element={<Bridges />} />
            <Route path="/treatments/dentures"           element={<Dentures />} />
            <Route path="/facial-aesthetics"             element={<FacialAesthetics />} />
            <Route path="/dentist-godalming"             element={<Godalming />} />
            <Route path="/dentist-guildford"             element={<Guildford />} />
            <Route path="/dentist-haslemere"             element={<Haslemere />} />
            <Route path="/dentist-farnham"               element={<Farnham />} />
            <Route path="/dentist-cranleigh"             element={<Cranleigh />} />
            <Route path="/dentist-hampshire"             element={<Hampshire />} />
            <Route path="/nhs-alternative-surrey"        element={<NHSAlternative />} />
            <Route path="/nhs/band-1"                    element={<NHSBand1 />} />
            <Route path="/nhs/band-2"                    element={<NHSBand2 />} />
            <Route path="/nhs/band-3"                    element={<NHSBand3 />} />
            <Route path="/dentist-hindhead"              element={<Hindhead />} />
            <Route path="/dentist-liphook"               element={<Liphook />} />
            <Route path="/dentist-grayshott"             element={<Grayshott />} />
            <Route path="/dentist-bordon"                element={<Bordon />} />
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
            <Route index                  element={<AdminIndex />} />
            <Route path="enquiries"       element={<ManagerRoute><AdminEnquiries /></ManagerRoute>} />
            <Route path="blog"            element={<ManagerRoute><AdminBlog /></ManagerRoute>} />
            <Route path="blog/new"        element={<ManagerRoute><AdminBlogEditor /></ManagerRoute>} />
            <Route path="blog/edit/:id"   element={<ManagerRoute><AdminBlogEditor /></ManagerRoute>} />
            <Route path="gallery"         element={<ManagerRoute><AdminGallery /></ManagerRoute>} />
            <Route path="team"            element={<ManagerRoute><AdminTeam /></ManagerRoute>} />
            <Route path="team/:id"        element={<ManagerRoute><AdminTeamEditor /></ManagerRoute>} />
            <Route path="reviews"          element={<ManagerRoute><AdminReviews /></ManagerRoute>} />
            <Route path="trust-bar"        element={<ManagerRoute><AdminTrustBar /></ManagerRoute>} />
            <Route path="opening-hours"    element={<ManagerRoute><AdminOpeningHours /></ManagerRoute>} />
            <Route path="review-request"       element={<ManagerRoute><AdminReviewRequest /></ManagerRoute>} />
            <Route path="treatments"                    element={<ManagerRoute><AdminTreatments /></ManagerRoute>} />
            <Route path="nhs-bands"                     element={<ManagerRoute><AdminNHSBands /></ManagerRoute>} />
            <Route path="treatments/:slug"             element={<ManagerRoute><AdminTreatmentEditor /></ManagerRoute>} />
            <Route path="patients"                     element={<ManagerRoute><AdminPatients /></ManagerRoute>} />
            <Route path="email-templates"              element={<ManagerRoute><AdminEmailTemplates /></ManagerRoute>} />
            <Route path="email-templates/:id"          element={<ManagerRoute><AdminEmailTemplateEditor /></ManagerRoute>} />
            <Route path="practice-settings"            element={<ManagerRoute><AdminPracticeSettings /></ManagerRoute>} />

            {/* Stock — Dashboard/Count/Quick Log open to manager + staff; the rest manager-only */}
            <Route path="stock"                element={<StockDashboard />} />
            <Route path="stock/count"          element={<StockCount />} />
            <Route path="stock/quick-log"      element={<StockQuickLog />} />
            <Route path="stock/goods-in"       element={<ManagerRoute><StockGoodsIn /></ManagerRoute>} />
            <Route path="stock/transfer"       element={<ManagerRoute><StockTransfer /></ManagerRoute>} />
            <Route path="stock/expiry-watch"   element={<ManagerRoute><StockExpiryWatch /></ManagerRoute>} />
            <Route path="stock/items"          element={<ManagerRoute><StockItems /></ManagerRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
