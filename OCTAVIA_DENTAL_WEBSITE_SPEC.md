# Octavia Dental & Facial Aesthetics — Website Build Specification

> **For Claude Code:** This is the complete specification for building the Octavia Dental & Facial Aesthetics website. Read this entire document before writing any code. Build in the order listed in the Implementation Sequence section.

---

## 1. Project Overview

**Practice name:** Octavia Dental & Facial Aesthetics  
**Website domain:** octavia-dental.co.uk  
**Address:** Seymour House, Lower South Street, Godalming, Surrey, GU7 1BZ  
**Phone:** 01483 860020  
**Email:** info@octavia-dental.co.uk  
**Instagram:** @octaviadental  
**Practice type:** Private dental + facial aesthetics  
**Booking system:** Dentally (integration required)  
**Finance:** To be integrated later (Tabeo or Payl8r — leave placeholder)

**Business goal:** Attract private dental and facial aesthetics patients across Surrey and Hampshire. Rank on Google for treatment + location keywords across 5 geographic zones. Convert visitors to consultations via WhatsApp and online booking.

---

## 2. Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **HTTP client:** Axios
- **SEO:** React Helmet Async
- **Image optimisation:** react-lazy-load-image-component

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Auth:** JWT + bcrypt (admin panel only)
- **Email:** Nodemailer (SMTP via Microsoft 365)
- **File uploads:** Multer + Cloudinary
- **Rate limiting:** express-rate-limit
- **Security:** helmet, cors, express-validator

### DevOps
- **Package manager:** npm
- **Environment:** dotenv
- **Linting:** ESLint + Prettier
- **Version control:** Git

---

## 3. Brand Guidelines

### Colours (use these exact values as Tailwind custom colours)
```js
// tailwind.config.js
colors: {
  brand: {
    green:      '#2D5A1E',   // primary dark green
    'green-mid':'#5B8A7D',   // teal/mid green
    'green-lt': '#6AAF30',   // lime green (logo accent)
    'green-bg': '#E8F5EF',   // light green background
    gold:       '#C8A96E',   // gold primary
    'gold-dk':  '#D4AF37',   // gold dark
    'gold-lt':  '#EDD9A3',   // gold light
    cream:      '#FAFAF7',   // off-white background
    dark:       '#1A1A1A',   // near-black text
    muted:      '#666666',   // body text
    subtle:     '#999999',   // captions
    border:     '#E8EDE4',   // light border
  }
}
```

### Typography
```js
// tailwind.config.js - extend fontFamily
fontFamily: {
  serif:  ['Cormorant Garamond', 'Georgia', 'serif'],   // headings
  sans:   ['Inter', 'system-ui', 'sans-serif'],          // body
  display:['Playfair Display', 'Georgia', 'serif'],      // hero/display
}
```
Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet"/>
```

### Design principles
- Dominant white/cream backgrounds — never grey
- Dark green (#2D5A1E) for primary CTAs and headings
- Gold (#C8A96E) as accent only — not overused
- Generous whitespace — minimum 80px section padding desktop, 48px mobile
- Photography-first — all sections designed around real photos
- Mobile-first — design for 390px viewport, scale up
- No stock photo placeholders in production — use Unsplash signed URLs as development placeholders only

---

## 4. Project Structure

```
octavia-dental/
├── client/                          # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── sitemap.xml              # generate dynamically
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   └── StickyBookBtn.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── ReviewCard.jsx
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   ├── ServiceCard.jsx
│   │   │   │   ├── BeforeAfterSlider.jsx
│   │   │   │   ├── WhatsAppButton.jsx
│   │   │   │   ├── BookingModal.jsx
│   │   │   │   ├── ConsentBanner.jsx
│   │   │   │   └── SchemaMarkup.jsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── TrustBar.jsx
│   │   │   │   ├── ServicesGrid.jsx
│   │   │   │   ├── USPSection.jsx
│   │   │   │   ├── TeamSection.jsx
│   │   │   │   ├── ReviewsSection.jsx
│   │   │   │   ├── LocationsBar.jsx
│   │   │   │   ├── CTASection.jsx
│   │   │   │   ├── BlogPreview.jsx
│   │   │   │   └── GalleryPreview.jsx
│   │   │   └── forms/
│   │   │       ├── ContactForm.jsx
│   │   │       ├── ConsultationForm.jsx
│   │   │       └── FormField.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── treatments/
│   │   │   │   ├── DentalImplants.jsx
│   │   │   │   ├── Invisalign.jsx
│   │   │   │   ├── SixMonthSmile.jsx
│   │   │   │   ├── CompositeBonding.jsx
│   │   │   │   ├── Veneers.jsx
│   │   │   │   ├── TeethWhitening.jsx
│   │   │   │   ├── AirFlowHygiene.jsx
│   │   │   │   └── Botox.jsx
│   │   │   ├── aesthetics/
│   │   │   │   └── FacialAesthetics.jsx
│   │   │   ├── locations/
│   │   │   │   ├── Godalming.jsx
│   │   │   │   ├── Guildford.jsx
│   │   │   │   ├── Haslemere.jsx
│   │   │   │   ├── Farnham.jsx
│   │   │   │   ├── Cranleigh.jsx
│   │   │   │   ├── Hampshire.jsx
│   │   │   │   └── NHSAlternative.jsx
│   │   │   ├── team/
│   │   │   │   ├── OurTeam.jsx
│   │   │   │   ├── DrAC.jsx
│   │   │   │   └── DrAna.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── CookiePolicy.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useScrollReveal.js
│   │   │   ├── useBookingModal.js
│   │   │   └── useMeta.js
│   │   ├── utils/
│   │   │   ├── seo.js
│   │   │   ├── schema.js
│   │   │   └── formatters.js
│   │   ├── data/
│   │   │   ├── services.js
│   │   │   ├── locations.js
│   │   │   └── team.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── Enquiry.js
│   │   ├── BlogPost.js
│   │   ├── GalleryItem.js
│   │   ├── Review.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── enquiries.js
│   │   ├── blog.js
│   │   ├── gallery.js
│   │   ├── reviews.js
│   │   ├── dentally.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── validateRequest.js
│   ├── controllers/
│   │   ├── enquiryController.js
│   │   ├── blogController.js
│   │   ├── galleryController.js
│   │   └── adminController.js
│   ├── utils/
│   │   ├── email.js                 # Nodemailer via M365
│   │   └── sitemapGenerator.js
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
└── package.json                     # root package with scripts
```

---

## 5. Environment Variables

Create `.env.example` at root:
```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/octavia-dental

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Microsoft 365 Email (GoDaddy hosted)
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=info@octavia-dental.co.uk
EMAIL_PASS=your_m365_password
EMAIL_FROM=info@octavia-dental.co.uk
EMAIL_TO=info@octavia-dental.co.uk

# Cloudinary (image storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Dentally API
DENTALLY_API_KEY=
DENTALLY_SITE_ID=
DENTALLY_BASE_URL=https://api.dentally.co/v1

# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 6. Database Schemas

### Enquiry model
```js
{
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true },
  phone:       { type: String },
  service:     { type: String, enum: ['implants','invisalign','bonding','veneers',
                  'whitening','botox','airflow','sixmonthsmile','general','other'] },
  location:    { type: String },  // where patient is from
  message:     { type: String },
  source:      { type: String },  // page they came from
  status:      { type: String, enum: ['new','contacted','booked','closed'], default: 'new' },
  gdprConsent: { type: Boolean, required: true },
  createdAt:   { type: Date, default: Date.now }
}
```

### BlogPost model
```js
{
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     { type: String, required: true, maxlength: 160 },
  body:        { type: String, required: true },  // markdown
  category:    { type: String, enum: ['dental','aesthetics','local','news'] },
  tags:        [String],
  author:      { type: String, default: 'Dr AC' },
  featuredImg: { type: String },  // Cloudinary URL
  seoTitle:    { type: String },
  seoDesc:     { type: String },
  location:    { type: String },  // for location-specific posts
  published:   { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now }
}
```

### GalleryItem model
```js
{
  title:       { type: String, required: true },
  treatment:   { type: String, required: true },
  beforeImg:   { type: String },  // Cloudinary URL
  afterImg:    { type: String },  // Cloudinary URL
  description: { type: String },
  consentRef:  { type: String, required: true },  // GDC consent form reference
  published:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
}
```

### Review model
```js
{
  author:    { type: String, required: true },
  location:  { type: String },
  treatment: { type: String },
  rating:    { type: Number, min: 1, max: 5, required: true },
  text:      { type: String, required: true },
  source:    { type: String, enum: ['google','website'], default: 'google' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 7. API Routes

### Base URL: `/api`

#### Enquiries
```
POST   /api/enquiries          — Submit contact/consultation form
GET    /api/enquiries          — Get all (admin only)
PATCH  /api/enquiries/:id      — Update status (admin only)
```

#### Blog
```
GET    /api/blog               — Get published posts (paginated)
GET    /api/blog/:slug         — Get single post
GET    /api/blog/category/:cat — Get by category
POST   /api/blog               — Create post (admin)
PUT    /api/blog/:id           — Update post (admin)
DELETE /api/blog/:id           — Delete post (admin)
```

#### Gallery
```
GET    /api/gallery            — Get published items
GET    /api/gallery/:treatment — Get by treatment
POST   /api/gallery            — Upload item (admin)
DELETE /api/gallery/:id        — Delete (admin)
```

#### Dentally integration
```
GET    /api/dentally/slots     — Get available appointment slots
POST   /api/dentally/book      — Create appointment request
```

#### Admin
```
POST   /api/admin/login        — Authenticate admin
GET    /api/admin/dashboard    — Stats overview
```

---

## 8. Page Specifications

### 8.1 Homepage (`/`)

**Meta:**
- Title: `Private Dentist Godalming | Octavia Dental & Facial Aesthetics`
- Description: `Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, Botox. No waiting list. New patients welcome.`

**Sections in order:**
1. `<Navbar />` — sticky, transparent on hero, white on scroll
2. `<Hero />` — full viewport height, split layout desktop, stacked mobile
3. `<TrustBar />` — dark green strip, 5 stats
4. `<ServicesGrid />` — 8 service cards, 4-col desktop, 2-col tablet, 1-col mobile
5. `<USPSection />` — 3 USP points left, NHS card right
6. `<TeamSection />` — Dr AC, Dr Ana, team cards
7. `<GalleryPreview />` — 6 before/after thumbnails, link to gallery
8. `<ReviewsSection />` — 3 review cards + Google rating badge
9. `<LocationsBar />` — all 10 location pills
10. `<BlogPreview />` — latest 3 posts
11. `<CTASection />` — book + WhatsApp CTAs
12. `<Footer />`

**Hero component props:**
```jsx
headline="Your smile. Your confidence."
subheadline="Under one roof."
body="Private dental & facial aesthetics in Godalming, Surrey."
tags={['No waiting list','New patients welcome','Free consultations','Surrey & Hampshire']}
primaryCta={{ label: 'Book free consultation', action: 'openBooking' }}
secondaryCta={{ label: 'WhatsApp us', action: 'whatsapp', number: '441483860020' }}
heroImage="/images/hero-team.jpg"   // replace with real photo
```

---

### 8.2 Treatment Pages (8 pages)

Each treatment page follows the same template. Create a reusable `TreatmentPageTemplate.jsx` component.

**Template structure:**
```
1. Hero — treatment name, one-line tagline, hero image, Book CTA
2. What is it — 2-3 paragraphs, patient-friendly language
3. Benefits — icon list, 4-6 points
4. Process — step-by-step numbered list
5. Before/After slider — pulled from gallery API filtered by treatment
6. Pricing — transparent price table
7. FAQ — accordion, 5-8 questions (generates FAQ schema)
8. Meet the specialist — Dr AC or Dr Ana card
9. CTA — book consultation
```

**Individual page data:**

#### Dental Implants (`/treatments/dental-implants`)
```js
{
  title: 'Dental Implants Godalming Surrey | Octavia Dental',
  metaDesc: 'Expert dental implants in Godalming. Dr AC is our implant specialist. Permanent tooth replacement from £2,500. Free consultation. Serving Surrey & Hampshire.',
  h1: 'Dental Implants in Godalming',
  tagline: 'Permanent. Natural-looking. Life-changing.',
  specialist: 'DrAC',
  priceFrom: '£2,500',
  keywords: ['dental implants Godalming','dental implants Surrey','dental implants Guildford'],
  faq: [
    { q: 'Are dental implants painful?', a: 'Most patients report less discomfort than expected. The procedure is carried out under local anaesthetic so you feel no pain during treatment. Some mild soreness for a few days afterwards is normal and easily managed.' },
    { q: 'How long do dental implants last?', a: 'With proper care, dental implants can last 20 years or more. Many last a lifetime. Good oral hygiene and regular check-ups are the key factors.' },
    { q: 'Am I a candidate for dental implants?', a: 'Most adults with good general health are suitable candidates. Dr AC will assess your bone density, gum health and overall oral health at your free consultation.' },
    { q: 'How much do dental implants cost in Godalming?', a: 'A single dental implant at Octavia Dental starts from £2,500. Dr AC will provide a full personalised quote at your free consultation.' },
    { q: 'How long does the implant process take?', a: 'The full process typically takes 3–6 months, allowing time for the implant to integrate with the jawbone. Some patients are eligible for same-day teeth procedures.' }
  ]
}
```

#### Invisalign (`/treatments/invisalign`)
```js
{
  title: 'Invisalign Godalming Surrey | Clear Braces | Octavia Dental',
  metaDesc: 'Invisalign clear aligners in Godalming, Surrey. Free consultation. Straighten your teeth without anyone knowing. Serving Guildford, Farnham, Haslemere & Hampshire.',
  h1: 'Invisalign in Godalming',
  tagline: 'Straighten your smile — invisibly.',
  specialist: 'DrAna',
  priceFrom: 'Free consultation',
  faq: [
    { q: 'How long does Invisalign take?', a: 'Most cases take 6–18 months depending on complexity. Mild corrections can be completed in as little as 3 months.' },
    { q: 'Can I eat and drink with Invisalign?', a: 'You remove your aligners to eat and drink, so there are no dietary restrictions. Simply remove, eat, brush, and replace.' },
    { q: 'Is Invisalign noticeable?', a: 'Invisalign aligners are virtually invisible. Most people will not notice you are wearing them.' },
    { q: 'How much does Invisalign cost?', a: 'Invisalign at Octavia Dental is priced following your free consultation when we assess complexity. Comprehensive cases typically range from £2,800 to £5,000.' },
    { q: 'How is Invisalign different from traditional braces?', a: 'Unlike fixed braces, Invisalign aligners are removable, invisible, and more comfortable. There are no metal brackets or wires.' }
  ]
}
```

#### Composite Bonding (`/treatments/composite-bonding`)
```js
{
  title: 'Composite Bonding Godalming Surrey | Same-Day Smile | Octavia Dental',
  metaDesc: 'Composite bonding in Godalming from £250 per tooth. Same-day treatment, no drilling. Cosmetic dentist Dr Ana. Serving Surrey & Hampshire. Book free consultation.',
  h1: 'Composite Bonding in Godalming',
  tagline: 'Transform your smile in a single appointment.',
  specialist: 'DrAna',
  priceFrom: '£250 per tooth',
  faq: [
    { q: 'Does composite bonding hurt?', a: 'Composite bonding is a pain-free treatment. No injections or drilling are required in most cases.' },
    { q: 'How long does composite bonding last?', a: 'With good care, composite bonding lasts 5–7 years. Avoiding hard foods and wearing a night guard if you grind your teeth will extend its life.' },
    { q: 'Does composite bonding damage your teeth?', a: 'No. Composite bonding is one of the most conservative cosmetic treatments available. It does not remove tooth structure.' },
    { q: 'How many teeth can be bonded in one visit?', a: 'Most patients have between 2 and 8 teeth bonded in a single appointment, typically taking 1–3 hours.' },
    { q: 'What is the difference between composite bonding and veneers?', a: 'Composite bonding uses tooth-coloured resin applied directly to the tooth — reversible and lower cost. Veneers are thin porcelain shells — longer-lasting but involve some tooth preparation.' }
  ]
}
```

#### Botox & Anti-Wrinkle (`/treatments/botox-anti-wrinkle`)
```js
{
  title: 'Botox & Anti-Wrinkle Injections Godalming | Dentist-Led | Octavia Dental',
  metaDesc: 'Botox & anti-wrinkle injections by dentist-trained Dr Ana in Godalming, Surrey. Safer than beauty salons. Natural results. Serving Surrey & Hampshire.',
  h1: 'Botox & Anti-Wrinkle Injections in Godalming',
  tagline: 'Precision aesthetics. Delivered by a dental specialist.',
  specialist: 'DrAna',
  priceFrom: '£200',
  gdcNote: true,   // renders GDC compliance note on this page
  faq: [
    { q: 'Why see a dentist for Botox?', a: 'Dentists have the deepest understanding of facial anatomy — muscles, nerves, and bone structure. Dr Ana has advanced training in facial aesthetics and delivers safer, more precise results than most non-medical practitioners.' },
    { q: 'How long does Botox last?', a: 'Anti-wrinkle injections typically last 3–4 months. With regular treatment, results can last longer as muscles gradually relax.' },
    { q: 'Is Botox painful?', a: 'Most patients describe the sensation as a mild pinch. Dr Ana uses the finest needles available and can apply topical numbing cream if preferred.' },
    { q: 'When will I see results?', a: 'Initial effects appear within 48–72 hours. Full results are visible at 10–14 days.' },
    { q: 'Are there any side effects?', a: 'Side effects are rare when administered by a trained professional. Temporary redness or mild bruising at the injection site is the most common and resolves quickly.' }
  ]
}
```

#### Porcelain Veneers (`/treatments/veneers`)
```js
{
  title: 'Porcelain Veneers Godalming Surrey | Octavia Dental',
  metaDesc: 'Porcelain veneers in Godalming from £800 per tooth. Expert cosmetic dentist Dr Ana. Natural-looking, long-lasting results. Free consultation.',
  h1: 'Porcelain Veneers in Godalming',
  tagline: 'Perfection crafted in porcelain.',
  specialist: 'DrAna',
  priceFrom: '£800 per tooth'
}
```

#### Teeth Whitening (`/treatments/teeth-whitening`)
```js
{
  title: 'Teeth Whitening Godalming Surrey | Professional | Octavia Dental',
  metaDesc: 'Professional teeth whitening in Godalming from £299. In-surgery and home kits available. Dramatically whiter teeth in one visit.',
  h1: 'Teeth Whitening in Godalming',
  tagline: 'A brighter smile — guaranteed.',
  specialist: 'DrAna',
  priceFrom: '£299'
}
```

#### 6 Month Smile (`/treatments/six-month-smile`)
```js
{
  title: '6 Month Smile Godalming Surrey | Short-Term Braces | Octavia Dental',
  metaDesc: '6 Month Smile orthodontics in Godalming. Straighten your front teeth in as little as 6 months using clear braces. Free consultation.',
  h1: '6 Month Smile in Godalming',
  tagline: 'A straighter smile in as little as 6 months.',
  specialist: 'DrAna',
  priceFrom: '£2,000'
}
```

#### Air Flow Hygiene (`/treatments/air-flow-hygiene`)
```js
{
  title: 'Air Flow Hygiene Godalming | Advanced Dental Cleaning | Octavia Dental',
  metaDesc: 'Air Flow advanced hygiene treatment in Godalming. Deeper, fresher clean than standard scale and polish. Book your appointment today.',
  h1: 'Air Flow Hygiene in Godalming',
  tagline: 'The deepest clean your teeth have ever had.',
  specialist: 'DrAna',
  priceFrom: '£99'
}
```

---

### 8.3 Location Pages (7 pages)

Each location page must have 800–1,200 words of **unique content** — not copy-paste with swapped names. Create a `LocationPageTemplate.jsx` component.

**Template structure:**
```
1. Hero — "Dentist serving [Town]" + book CTA
2. Intro — describe the town, distance from Godalming, directions
3. Services available — full list with links
4. Why travel to Octavia — named doctors, no waiting list
5. How to get here — directions from [town], parking, public transport
6. FAQ — 4 questions specific to that location
7. Reviews from that area (if available)
8. Map embed — Google Maps with practice pinned
9. CTA — book consultation
```

**Location data:**

```js
// src/data/locations.js
export const locations = [
  {
    slug: 'godalming',
    name: 'Godalming',
    zone: 1,
    h1: 'Your Private Dentist in Godalming',
    metaTitle: 'Private Dentist Godalming GU7 | Octavia Dental & Facial Aesthetics',
    metaDesc: 'Private dental & facial aesthetics clinic in Godalming, Surrey GU7. Implants, Invisalign, Botox. No waiting list. New patients welcome this week.',
    distance: 'We are based on Lower South Street, just off Godalming High Street.',
    directions: 'Find us at Seymour House, Lower South Street, Godalming, GU7 1BZ — a short walk from Godalming town centre.',
    parking: 'Parking is available on Lower South Street and at the nearby Flambard Way car park.',
    nhs_note: false,
  },
  {
    slug: 'guildford',
    name: 'Guildford',
    zone: 2,
    h1: 'Cosmetic Dentist serving Guildford',
    metaTitle: 'Cosmetic Dentist near Guildford Surrey | Octavia Dental',
    metaDesc: 'Serving patients from Guildford for dental implants, Invisalign, composite bonding and Botox. Just 10 minutes from Guildford town centre. Free consultations.',
    distance: 'Just 10 minutes from Guildford town centre via the A3100.',
    directions: 'From Guildford, take the A3100 south towards Godalming. We are on Lower South Street, 5 minutes from Farncombe station.',
    parking: 'Free parking available on site.',
    nhs_note: true,
  },
  {
    slug: 'haslemere',
    name: 'Haslemere',
    zone: 3,
    h1: 'Cosmetic Dentist serving Haslemere & Surrey Hills',
    metaTitle: 'Dentist near Haslemere Surrey Hills | Octavia Dental Godalming',
    metaDesc: 'Serving Haslemere and the Surrey Hills for private dental and facial aesthetics. Just 15 minutes from Haslemere. Implants, Invisalign, Botox. Free consultation.',
    distance: '15 minutes from Haslemere via the A286.',
    directions: 'From Haslemere, take the A286 north to Milford, then follow signs to Godalming town centre.',
    parking: 'Free parking on Lower South Street.',
    nhs_note: true,
  },
  {
    slug: 'farnham',
    name: 'Farnham',
    zone: 4,
    h1: 'Cosmetic Dentist serving Farnham, Surrey',
    metaTitle: 'Cosmetic Dentist near Farnham GU9 | Octavia Dental',
    metaDesc: 'Serving Farnham patients for dental implants, veneers, Invisalign and Botox. 20 minutes from Farnham. Private dentist accepting new patients now.',
    distance: '20 minutes from Farnham via the A31.',
    directions: 'From Farnham, take the A31 east to Guildford then join the A3100 south into Godalming.',
    parking: 'Parking available on Lower South Street and at Flambard Way.',
    nhs_note: true,
  },
  {
    slug: 'cranleigh',
    name: 'Cranleigh',
    zone: 2,
    h1: 'Private Dentist serving Cranleigh & Waverley',
    metaTitle: 'Private Dentist near Cranleigh Surrey | Octavia Dental Godalming',
    metaDesc: 'Serving Cranleigh for private dental care. 20 minutes from Cranleigh. New patients welcome — no waiting list. Implants, Invisalign, composite bonding.',
    distance: '20 minutes from Cranleigh via the B2128.',
    nhs_note: true,
  },
  {
    slug: 'hampshire',
    name: 'Hampshire',
    zone: 5,
    h1: 'Private Dentist for Hampshire — Petersfield, Alton & Liphook',
    metaTitle: 'Private Dentist Hampshire | Petersfield Alton Liphook | Octavia Dental',
    metaDesc: 'Cannot get an NHS dentist in Petersfield, Alton or Liphook? Octavia Dental accepts new patients from Hampshire. 25 minutes via A3. No waiting list.',
    distance: '25 minutes from Petersfield, 30 minutes from Alton via the A3.',
    directions: 'From Petersfield take the A3 north to Godalming. From Alton take the A31 west then A3100.',
    parking: 'Free parking available.',
    nhs_note: true,
    nhs_emphasis: true,   // renders NHS crisis section prominently
  },
  {
    slug: 'nhs-alternative',
    name: 'NHS Alternative Surrey & Hampshire',
    zone: 'regional',
    h1: 'Cannot Get an NHS Dentist in Surrey or Hampshire?',
    metaTitle: 'NHS Dentist Alternative Surrey & Hampshire | Private Dentist | Octavia Dental',
    metaDesc: '82% of new patients in Surrey cannot access NHS dental care. Octavia Dental accepts new patients immediately — no referral, no waiting list.',
    nhs_emphasis: true,
  },
]
```

---

### 8.4 Team Pages

#### Our Team (`/our-team`)
List all team members. Cards for Dr AC, Dr Ana, nurses, reception.

#### Dr AC (`/our-team/dr-ac`)
```js
{
  title: 'Dr AC — Dental Implant Specialist | Octavia Dental Godalming',
  metaDesc: 'Dr AC is our dental implant specialist at Octavia Dental, Godalming. GDC registered with extensive experience in implants, restorative and complex dental cases.',
  name: 'Dr AC',
  role: 'Implant & Restorative Specialist',
  specialisms: ['Dental Implants','Complex Restorative','Crowns & Bridges'],
  gdcNumber: '',   // add when confirmed
  bio: `Dr AC is the principal implant specialist at Octavia Dental & Facial Aesthetics...`,
}
```

#### Dr Ana (`/our-team/dr-ana`)
```js
{
  title: 'Dr Ana — Cosmetic & Aesthetics Dentist | Octavia Dental Godalming',
  metaDesc: 'Dr Ana specialises in cosmetic dentistry and facial aesthetics at Octavia Dental, Godalming. Invisalign, composite bonding, veneers, Botox and anti-wrinkle injections.',
  name: 'Dr Ana',
  role: 'Cosmetic Dentist & Aesthetics Specialist',
  specialisms: ['Composite Bonding','Invisalign','Facial Aesthetics','Veneers','Teeth Whitening'],
  gdcNumber: '',   // add when confirmed
}
```

---

### 8.5 Gallery Page (`/gallery`)

- Filter tabs: All | Implants | Bonding | Veneers | Whitening | Invisalign | Aesthetics
- Before/After slider component for each pair
- GDC disclaimer: "Results may vary. All before and after images are published with written patient consent."
- Lazy load images
- Pulls from `/api/gallery` endpoint

---

### 8.6 Blog (`/blog` and `/blog/:slug`)

- Category filter: All | Dental | Facial Aesthetics | Local | News
- Each post shows author (Dr AC or Dr Ana), date, category, read time
- Structured data: `Article` schema on each post
- Related posts (same category) at end of each post
- Share buttons: WhatsApp, Facebook, copy link

---

### 8.7 Contact Page (`/contact`)

```
- Practice details card (address, phone, email, hours)
- Google Maps embed (Seymour House, GU7 1BZ)
- Contact form (name, email, phone, service interested in, message, GDPR checkbox)
- WhatsApp direct link
- Parking and transport info
```

---

## 9. Key Components

### Navbar
```jsx
// Behaviour:
// - Transparent with white text on homepage hero
// - White background with dark text after scrolling 80px
// - Sticky (position: fixed, top: 0)
// - Mobile: hamburger menu with full-screen overlay

// Desktop nav items:
// Treatments (dropdown) | Facial Aesthetics | Our Team | Gallery | Locations (dropdown) | Blog

// Desktop right:
// 01483 860020 (tel link) | Book Free Consultation (primary button)

// Treatments dropdown:
// Dental Implants | Invisalign | Composite Bonding | Veneers | Teeth Whitening | 6 Month Smile | Air Flow Hygiene

// Locations dropdown:
// Godalming | Guildford | Haslemere | Farnham | Cranleigh | Hampshire | NHS Alternative
```

### Sticky Book Button
```jsx
// Mobile only — fixed bottom, full width
// Shows after user scrolls 300px
// "Book Free Consultation" — opens booking modal
// WhatsApp icon on left side of button
```

### WhatsApp Button
```jsx
// Fixed bottom-right on all pages
// Opens wa.me/441483860020
// Animated pulse on desktop
// Green (#25D366) background
// Label: "Chat with us" on hover
```

### BeforeAfterSlider
```jsx
// Drag handle to reveal before/after
// Touch-enabled
// "Results may vary" label below
// Consent ref not shown publicly
// Lazy loads images
```

### BookingModal
```jsx
// Triggered by all "Book" CTAs
// Step 1: Choose treatment (dropdown)
// Step 2: Name, phone, email, preferred time
// Step 3: GDPR consent checkbox
// Step 4: Submit — POST to /api/enquiries
// Step 5: Success message
// Note: Dentally widget embed placeholder — 
//   add <DentallyWidget siteId={DENTALLY_SITE_ID} /> when API confirmed
```

### SchemaMarkup
```jsx
// Renders JSON-LD in <head> for each page type
// Page types:
//   - DentalClinic (homepage)
//   - Dentist (team pages)
//   - MedicalProcedure (treatment pages)
//   - FAQPage (treatment pages with FAQ)
//   - LocalBusiness (location pages)
//   - BlogPosting (blog posts)
```

---

## 10. SEO Requirements

### Every page must have:
- Unique `<title>` tag (50–60 chars)
- Unique `<meta name="description">` (150–160 chars)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags

### Homepage additional schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Octavia Dental & Facial Aesthetics",
  "url": "https://octavia-dental.co.uk",
  "telephone": "01483860020",
  "email": "info@octavia-dental.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Seymour House, Lower South Street",
    "addressLocality": "Godalming",
    "addressRegion": "Surrey",
    "postalCode": "GU7 1BZ",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.1856,
    "longitude": -0.6153
  },
  "openingHoursSpecification": [],
  "priceRange": "££",
  "medicalSpecialty": ["Dentistry", "Cosmetic Dentistry", "Facial Aesthetics"]
}
```

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://octavia-dental.co.uk/sitemap.xml
```

### Sitemap
Generate dynamically from Express. Include all static pages + all published blog posts.

---

## 11. GDC Compliance Requirements

These are non-negotiable on a UK dental website.

1. **Before/after disclaimer** — display on all gallery images: *"Results may vary. All images published with written patient consent."*
2. **Testimonials** — must be genuine and unedited. Display source (Google Review, patient etc).
3. **Botox/aesthetics page** — add note: *"Anti-wrinkle treatments are prescription-only medicines. A full consultation and assessment is carried out prior to treatment."*
4. **GDC registration** — display GDC number for each clinician on their team page.
5. **Complaints procedure** — link in footer to complaints/contact page.
6. **Privacy policy** — full GDPR-compliant policy at `/privacy-policy`.
7. **Cookie consent** — implement cookie consent banner (use `react-cookie-consent` package).
8. **No guaranteed results** — never use language like "guaranteed", "permanent" without qualification.
9. **Pricing** — if showing prices, include *"Prices quoted at consultation may vary based on individual assessment."*

---

## 12. Performance Requirements

- Lighthouse score 90+ on mobile for all pages
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- All images: WebP format, max 200KB, lazy loaded
- Fonts: preloaded, font-display: swap
- No unused CSS in production (Tailwind purge enabled)
- API responses cached where appropriate

---

## 13. Dentally Integration

Dentally provides a REST API and embeddable booking widget.

```js
// server/routes/dentally.js
// GET /api/dentally/slots
// Proxy to: GET https://api.dentally.co/v1/availability
// Headers: { 'Authorization': `Bearer ${DENTALLY_API_KEY}` }

// POST /api/dentally/book  
// Proxy to: POST https://api.dentally.co/v1/appointments
// Body: { patient, appointment_type, start_time, practitioner_id }

// Frontend: embed Dentally booking widget in BookingModal
// <iframe src={`https://booking.dentally.co/${DENTALLY_SITE_ID}`} />
// Or use their JS snippet if provided
```

---

## 14. Finance Integration (Placeholder)

Leave a `<FinanceOptions />` component placeholder on treatment pages (Implants, Invisalign, Veneers) with:
```jsx
<div data-integration="finance" className="finance-placeholder">
  {/* TODO: Integrate Tabeo or Payl8r finance widget */}
  <p>Flexible payment plans available — ask at your consultation.</p>
</div>
```

---

## 15. Implementation Sequence

Build in this exact order:

**Phase 1 — Foundation**
1. Initialise monorepo, install dependencies
2. Configure Tailwind with brand tokens
3. Build `Navbar`, `Footer`, `WhatsAppButton`, `StickyBookBtn`
4. Build `BookingModal` and `ContactForm` with validation
5. Set up Express server with MongoDB connection
6. Build `Enquiry` model and `POST /api/enquiries` route with email notification
7. Deploy skeleton to Vercel (frontend) + Railway (backend)

**Phase 2 — Homepage**
8. Build all homepage sections in order
9. Wire up `SchemaMarkup` for homepage
10. Test mobile responsiveness

**Phase 3 — Treatment Pages**
11. Build `TreatmentPageTemplate`
12. Build all 8 treatment pages using template + data
13. Add `BeforeAfterSlider` component (hardcoded placeholders initially)
14. Add FAQ accordion with schema

**Phase 4 — Location Pages**
15. Build `LocationPageTemplate`
16. Build all 7 location pages
17. Add Google Maps embed to each

**Phase 5 — Content Pages**
18. Team pages (Our Team, Dr AC, Dr Ana)
19. Gallery page + API
20. Blog listing + single post + API
21. Contact page

**Phase 6 — SEO & Performance**
22. React Helmet Async on every page
23. Sitemap generation endpoint
24. Image optimisation audit
25. Lighthouse audit and fixes

**Phase 7 — Admin & CMS**
26. Simple admin panel (login, manage enquiries, publish blog posts, upload gallery)

**Phase 8 — Integrations**
27. Dentally booking widget
28. Finance placeholder
29. Google Analytics 4
30. Microsoft Clarity (heatmaps)

---

## 16. Practice Content (use exactly)

```js
// NAP — use exactly on all pages
const practiceNAP = {
  name:    'Octavia Dental & Facial Aesthetics',
  address: 'Seymour House, Lower South Street, Godalming, Surrey, GU7 1BZ',
  phone:   '01483 860020',
  email:   'info@octavia-dental.co.uk',
  website: 'https://octavia-dental.co.uk',
  instagram: '@octaviadental',
}

// Taglines (approved for use)
const taglines = {
  main:       'Your smile. Your confidence. Under one roof.',
  short:      'Private dental & facial aesthetics in Godalming, Surrey.',
  nhs:        'No waiting list. New patients welcome this week.',
  aesthetics: 'Dental Botox — safer, more precise, longer-lasting.',
  implants:   'Permanent tooth replacement by our specialist, Dr AC.',
}
```

---

## 17. Notes for Claude Code

- Always use Tailwind utility classes — no inline styles, no CSS modules
- All forms must have GDPR consent checkbox — do not submit without it
- All images need `alt` text — use descriptive, keyword-rich alt text
- Keep all animation subtle — `ease-in-out`, max `0.3s` duration on transitions
- Phone numbers must be clickable `<a href="tel:01483860020">`
- WhatsApp links must be `https://wa.me/441483860020` (international format, no spaces)
- Do not hardcode prices in more than one place — use `src/data/services.js` as single source of truth
- The Botox page must include the prescription medicine disclaimer (see GDC section)
- Never say "guaranteed" or "permanent results" — always qualify
- All before/after content requires `consentRef` before being visible

---

*Last updated: June 2026 | Prepared by Octavia Dental In-House Marketing | octavia-dental.co.uk*
