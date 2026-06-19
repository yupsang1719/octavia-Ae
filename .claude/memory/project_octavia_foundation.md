---
name: project-octavia-foundation
description: Octavia Dental website monorepo — Phase 1 Foundation complete. Stack, file layout, and what was built.
metadata:
  type: project
---

Phase 1 Foundation is complete as of 2026-06-05.

**Stack:** MERN — React 18 + Vite (client/) + Express + MongoDB/Mongoose (server/)
**Package manager:** npm (monorepo with concurrently at root)
**Dev command:** `npm run dev` from root (starts both client:3000 and server:5000 concurrently)

**What's done:**
- Tailwind v3 configured with all brand colour tokens and font families (Cormorant Garamond, Inter, Playfair Display)
- Google Fonts added to index.html
- Vite proxy: /api → localhost:5000
- All layout components: Navbar (sticky/transparent on hero, desktop dropdowns, mobile hamburger), Footer, MobileMenu, StickyBookBtn
- All UI components: Button, Badge, Card, WhatsAppButton (wa.me/441483860020), BookingModal (2-step with Zod validation + GDPR), ConsentBanner, SchemaMarkup
- All form components: FormField, ContactForm (Zod + GDPR), ConsultationForm
- Data files: services.js (single source of truth for prices), locations.js (7 locations), team.js
- Utils: seo.js, schema.js (JSON-LD builders), formatters.js
- Hooks: useScrollReveal, useBookingModal, useMeta
- App.jsx with lazy-loaded React Router v6 routes for all 30+ pages
- Stub pages for every route (ready for Phase 2 content)
- Express server: helmet, cors, rate limiting, all 6 route groups
- 5 Mongoose models: Enquiry, BlogPost, GalleryItem, Review, Admin
- Enquiry route: POST /api/enquiries (rate-limited, validator, fires Nodemailer notification + confirmation emails)
- Blog, Gallery, Reviews, Dentally, Admin routes all wired
- JWT auth middleware for admin routes
- Sitemap generator (static pages + published blog posts)
- robots.txt at client/public/robots.txt
- .env.example at root

**Build status:** `npm run build` in client/ passes cleanly (0 errors).

**Next phase:** Phase 2 — Homepage sections (Hero, TrustBar, ServicesGrid, USPSection, TeamSection, GalleryPreview, ReviewsSection, LocationsBar, BlogPreview, CTASection)

**Why:** Instagram icon not in this lucide-react version — replaced with inline SVG in Footer.jsx
