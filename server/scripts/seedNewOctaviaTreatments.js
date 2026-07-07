import '../env.js'
import mongoose from 'mongoose'
import Treatment from '../models/Treatment.js'

// All 9 treatments — same content as octavia-aesthetic, adapted for New Octavia Dental Surgery
const PRACTICE = 'new-octavia'
const LOCATION = 'Hindhead'
const PRACTICE_NAME = 'New Octavia Dental Surgery'

const treatments = [
  {
    slug: 'dental-implants',
    name: 'Dental Implants',
    tagline: 'Permanent. Natural-looking. Life-changing.',
    priceFrom: '£2,500',
    priceNote: 'Single implant from £2,500. Full treatment cost provided at free consultation.',
    financeAvailable: true,
    h1: `Dental Implants in ${LOCATION}`,
    title: `Dental Implants ${LOCATION} Surrey | ${PRACTICE_NAME}`,
    metaDesc: `Expert dental implants in ${LOCATION}, Surrey. Permanent tooth replacement from £2,500. Free consultation.`,
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-ravi-pant'],
    gdcNote: false, rxNote: false, order: 1,
    whatIsIt: [
      'A dental implant is a small titanium post placed into your jawbone to act as an artificial tooth root. Once it has bonded with the bone — a process called osseointegration — a natural-looking crown is attached on top, giving you a permanent, stable replacement for a missing tooth.',
      'Unlike dentures, implants do not slip or require removal at night. Unlike bridges, they do not require the grinding down of adjacent healthy teeth. The result is a tooth that looks, feels and functions exactly like your natural dentition.',
      `At ${PRACTICE_NAME}, all implant treatment is carried out by our specialist-trained dentists with extensive postgraduate training in implant dentistry.`,
    ],
    benefits: [
      'Permanent solution — can last 20+ years with proper care',
      'Looks and feels like a natural tooth',
      'Prevents bone loss in the jaw',
      'No impact on adjacent healthy teeth',
      'No removal, no adhesives, no dietary restrictions',
      'Improves speech and chewing confidence',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist assesses your bone density, gum health, and overall suitability. You receive a personalised treatment plan and transparent quote at no cost.' },
      { step: 2, title: 'Implant placement', body: 'Under local anaesthetic, the titanium implant post is placed into the jawbone.' },
      { step: 3, title: 'Healing period', body: 'Over 8–12 weeks, the implant fuses with your bone. A temporary restoration keeps your smile looking natural.' },
      { step: 4, title: 'Crown fitting', body: 'A custom-made porcelain crown is attached, matched to your surrounding teeth.' },
      { step: 5, title: 'Aftercare', body: 'A follow-up appointment and aftercare plan are provided.' },
    ],
    faq: [
      { q: 'Are dental implants painful?', a: 'Most patients report less discomfort than expected. The procedure is carried out under local anaesthetic.' },
      { q: 'How long do dental implants last?', a: 'With proper care, dental implants can last 20 years or more.' },
      { q: 'How much do dental implants cost?', a: `A single dental implant at ${PRACTICE_NAME} starts from £2,500.` },
      { q: 'How long does the implant process take?', a: 'The full process typically takes 3–6 months.' },
    ],
  },
  {
    slug: 'invisalign',
    name: 'Invisalign',
    tagline: 'Straighten your smile — invisibly.',
    priceFrom: 'Free consultation',
    priceNote: 'Comprehensive cases typically £2,800–£5,000. Exact cost confirmed at free consultation.',
    financeAvailable: true,
    h1: `Invisalign in ${LOCATION}`,
    title: `Invisalign ${LOCATION} Surrey | Clear Braces | ${PRACTICE_NAME}`,
    metaDesc: `Invisalign clear aligners in ${LOCATION}, Surrey. Free consultation. Straighten your teeth without anyone knowing.`,
    heroImage: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 2,
    whatIsIt: [
      'Invisalign is the world\'s leading clear aligner system, used to straighten teeth gradually using a series of custom-made, removable trays.',
      'Unlike traditional metal braces, Invisalign aligners are virtually invisible when worn, making them the preferred choice for adults and teenagers.',
      `At ${PRACTICE_NAME}, we use the latest iTero scanning technology to create a precise digital model of your teeth.`,
    ],
    benefits: [
      'Virtually invisible — most people will not notice you are wearing them',
      'Removable — eat, drink and brush normally',
      'No dietary restrictions during treatment',
      'Comfortable smooth plastic — no metal wires or brackets',
      'Digital preview of your expected results before you start',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist assesses your teeth and discusses your goals.' },
      { step: 2, title: 'Digital scan & treatment planning', body: 'A 3D iTero scan lets you preview your final smile.' },
      { step: 3, title: 'Receive your aligners', body: 'Your custom aligner series arrives within 2–3 weeks.' },
      { step: 4, title: 'Progress check-ups', body: 'Regular appointments every 6–8 weeks.' },
      { step: 5, title: 'Retainers', body: 'A retainer maintains your new smile long-term.' },
    ],
    faq: [
      { q: 'How long does Invisalign take?', a: 'Most cases take 6–18 months depending on complexity.' },
      { q: 'How much does Invisalign cost?', a: `Comprehensive cases at ${PRACTICE_NAME} typically range from £2,800 to £5,000.` },
    ],
  },
  {
    slug: 'composite-bonding',
    name: 'Composite Bonding',
    tagline: 'Transform your smile in a single appointment.',
    priceFrom: '£250 per tooth',
    priceNote: 'From £250 per tooth. Full smile makeovers from £1,800. Prices confirmed at free consultation.',
    financeAvailable: false,
    h1: `Composite Bonding in ${LOCATION}`,
    title: `Composite Bonding ${LOCATION} Surrey | ${PRACTICE_NAME}`,
    metaDesc: `Composite bonding in ${LOCATION} from £250 per tooth. Same-day treatment, no drilling.`,
    heroImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 3,
    whatIsIt: [
      'Composite bonding is a cosmetic dental treatment in which a tooth-coloured resin material is applied directly to the surface of your teeth and sculpted by hand to correct chips, gaps, discolouration, uneven lengths or shape irregularities.',
      'The treatment requires no drilling in most cases and no anaesthetic — typically completed in a single appointment.',
    ],
    benefits: [
      'Same-day results — often completed in a single 1–3 hour appointment',
      'No drilling or injections required in most cases',
      'Completely reversible — no tooth structure is removed',
      'Corrects chips, gaps, discolouration and uneven teeth',
      'One of the most affordable cosmetic treatments available',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist discusses your smile goals and provides a clear quote.' },
      { step: 2, title: 'Shade matching', body: 'Resin is matched to your existing tooth colour.' },
      { step: 3, title: 'Surface preparation', body: 'The tooth surface is gently etched to help the resin bond.' },
      { step: 4, title: 'Bonding & sculpting', body: 'Resin is applied and sculpted to achieve the desired shape.' },
      { step: 5, title: 'Polish & review', body: 'Polished to a smooth, natural finish.' },
    ],
    faq: [
      { q: 'Does composite bonding hurt?', a: 'Composite bonding is pain-free. No injections or drilling in most cases.' },
      { q: 'How much does composite bonding cost?', a: `From £250 per tooth at ${PRACTICE_NAME}.` },
    ],
  },
  {
    slug: 'veneers',
    name: 'Porcelain Veneers',
    tagline: 'Perfection crafted in porcelain.',
    priceFrom: '£800 per tooth',
    priceNote: 'From £800 per tooth. Full veneer cases from £4,800. Exact costs at free consultation.',
    financeAvailable: true,
    h1: `Porcelain Veneers in ${LOCATION}`,
    title: `Porcelain Veneers ${LOCATION} Surrey | ${PRACTICE_NAME}`,
    metaDesc: `Porcelain veneers in ${LOCATION} from £800 per tooth. Natural-looking, long-lasting results.`,
    heroImage: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 4,
    whatIsIt: [
      'Porcelain veneers are ultra-thin ceramic shells, custom-crafted to bond to the front surface of your teeth, permanently correcting colour, shape, alignment and proportion.',
      'Fabricated in a dental laboratory to millimetre precision, veneers offer exceptional translucency and a stain-resistant surface that maintains its brightness for many years.',
    ],
    benefits: [
      'Long-lasting — typically last 10–15 years',
      'Stain-resistant surface',
      'Exceptional translucency — mimics natural enamel',
      'Corrects colour, shape, alignment and proportion',
      'Custom-crafted in a specialist laboratory',
    ],
    process: [
      { step: 1, title: 'Consultation & smile design', body: 'Digital mockup lets you preview your result before committing.' },
      { step: 2, title: 'Tooth preparation', body: 'A small amount of enamel removed under local anaesthetic.' },
      { step: 3, title: 'Impressions & temporaries', body: 'Impressions sent to ceramist; temporaries fitted.' },
      { step: 4, title: 'Veneer fitting', body: 'Veneers bonded permanently.' },
      { step: 5, title: 'Review appointment', body: 'Follow-up at 1–2 weeks.' },
    ],
    faq: [
      { q: 'How much do porcelain veneers cost?', a: `From £800 per tooth at ${PRACTICE_NAME}.` },
      { q: 'How long do veneers last?', a: 'Porcelain veneers typically last 10–15 years with proper care.' },
    ],
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    tagline: 'A brighter smile — safely.',
    priceFrom: '£299',
    priceNote: 'In-surgery whitening from £399. Home whitening kits from £299.',
    financeAvailable: false,
    h1: `Teeth Whitening in ${LOCATION}`,
    title: `Teeth Whitening ${LOCATION} Surrey | Professional | ${PRACTICE_NAME}`,
    metaDesc: `Professional teeth whitening in ${LOCATION} from £299. In-surgery and home kits available.`,
    heroImage: 'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 5,
    whatIsIt: [
      'Professional teeth whitening is the safest, most effective way to lighten the natural colour of your teeth. We offer both in-surgery whitening and custom home whitening kits.',
      'Professional whitening uses clinically proven concentrations that can lighten teeth by several shades — far more effective than over-the-counter products.',
    ],
    benefits: [
      'Results in one visit or within 2 weeks of home use',
      'Safe, clinically proven concentrations',
      'Custom-fitted trays for even whitening',
      'Can lighten teeth by 4–8 shades',
      'Long-lasting results',
    ],
    process: [
      { step: 1, title: 'Shade assessment', body: 'We photograph and record your current tooth shade.' },
      { step: 2, title: 'Custom tray impressions', body: 'Trays made to fit your teeth exactly.' },
      { step: 3, title: 'Whitening treatment', body: 'In-surgery or home kit as agreed.' },
      { step: 4, title: 'Review & top-up', body: 'Results reviewed and top-up gel provided.' },
    ],
    faq: [
      { q: 'How long do whitening results last?', a: 'Typically 12–18 months depending on lifestyle.' },
      { q: 'How much does teeth whitening cost?', a: `From £299 at ${PRACTICE_NAME}.` },
    ],
  },
  {
    slug: 'six-month-smile',
    name: '6 Month Smile',
    tagline: 'A straighter smile in as little as 6 months.',
    priceFrom: '£2,000',
    priceNote: 'From £2,000 depending on complexity.',
    financeAvailable: false,
    h1: `6 Month Smile in ${LOCATION}`,
    title: `6 Month Smile ${LOCATION} Surrey | ${PRACTICE_NAME}`,
    metaDesc: `6 Month Smile orthodontics in ${LOCATION}. Straighten your front teeth in as little as 6 months.`,
    heroImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 6,
    whatIsIt: [
      '6 Month Smile is a short-term orthodontic system designed to straighten the front teeth in a fraction of the time of traditional braces. Most cases complete in 4–9 months.',
      'The system uses tooth-coloured brackets and clear wires that are far less visible than conventional metal braces.',
    ],
    benefits: [
      'Faster than traditional orthodontics — typically 4–9 months',
      'Tooth-coloured brackets and wires',
      'Fixed appliance — no need to remember to wear trays',
      'Lower cost than comprehensive Invisalign',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist assesses suitability.' },
      { step: 2, title: 'Records & treatment planning', body: 'Records submitted to the 6 Month Smile lab.' },
      { step: 3, title: 'Bracket placement', body: 'Tooth-coloured brackets and clear wire fitted.' },
      { step: 4, title: 'Monthly adjustments', body: 'Appointments every 4–6 weeks.' },
      { step: 5, title: 'Debond & retainers', body: 'Brackets removed and retainer provided.' },
    ],
    faq: [
      { q: 'How much does 6 Month Smile cost?', a: `From £2,000 at ${PRACTICE_NAME}.` },
    ],
  },
  {
    slug: 'air-flow-hygiene',
    name: 'Air Flow Hygiene',
    tagline: 'The deepest clean your teeth have ever had.',
    priceFrom: '£99',
    priceNote: 'Air Flow hygiene appointment from £99.',
    financeAvailable: false,
    h1: `Air Flow Hygiene in ${LOCATION}`,
    title: `Air Flow Hygiene ${LOCATION} | Advanced Dental Cleaning | ${PRACTICE_NAME}`,
    metaDesc: `Air Flow advanced hygiene in ${LOCATION}. Deeper, fresher clean than standard scale and polish.`,
    heroImage: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-sadikchha-gurung'],
    gdcNote: false, rxNote: false, order: 7,
    whatIsIt: [
      'Air Flow is an advanced hygiene system using compressed air, warm water and fine powder to remove plaque, staining and early calculus from teeth and beneath the gum line.',
      'The treatment leaves teeth feeling exceptionally clean and brighter, removing surface staining from tea, coffee and tobacco effectively.',
    ],
    benefits: [
      'Removes staining, plaque and early calculus in one appointment',
      'Reaches areas traditional cleaning cannot',
      'Comfortable — no scraping sensation',
      'Leaves teeth visibly brighter',
      'Reduces risk of gum disease',
    ],
    process: [
      { step: 1, title: 'Oral health assessment', body: 'We review your gum health.' },
      { step: 2, title: 'Air Flow treatment', body: 'Fine powder, water and air clean all surfaces.' },
      { step: 3, title: 'Ultrasonic scaling (if needed)', body: 'Hardened calculus removed.' },
      { step: 4, title: 'Polish & fluoride', body: 'Polished and fluoride applied.' },
    ],
    faq: [
      { q: 'How often should I have Air Flow?', a: 'Most patients benefit every 6 months.' },
    ],
  },
  {
    slug: 'botox-anti-wrinkle',
    name: 'Botox & Anti-Wrinkle',
    tagline: 'Precision aesthetics. Delivered by a dental specialist.',
    priceFrom: '£200',
    priceNote: 'From £200 per area. Full face assessment and pricing at consultation.',
    financeAvailable: false,
    h1: `Botox & Anti-Wrinkle Injections in ${LOCATION}`,
    title: `Botox & Anti-Wrinkle Injections ${LOCATION} | Dentist-Led | ${PRACTICE_NAME}`,
    metaDesc: `Botox & anti-wrinkle injections by dentist-trained professionals in ${LOCATION}, Surrey. Natural results.`,
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-sadikchha-gurung'],
    gdcNote: true, rxNote: true, order: 8,
    whatIsIt: [
      'Anti-wrinkle injections (commonly known as Botox) temporarily relax specific facial muscles, softening frown lines, forehead lines and crow\'s feet.',
      'Dentists have a uniquely deep understanding of facial anatomy, allowing precise placement of injections for natural-looking results.',
    ],
    benefits: [
      'Administered by dental professionals with facial anatomy expertise',
      'Natural-looking results',
      'Treats frown lines, forehead lines and crow\'s feet',
      'Results visible within 48–72 hours',
      'No downtime',
    ],
    process: [
      { step: 1, title: 'Facial consultation', body: 'Full facial assessment and medical history review.' },
      { step: 2, title: 'Treatment planning', body: 'Precise injection points mapped.' },
      { step: 3, title: 'Injections', body: 'Ultra-fine needle micro-injections in approximately 15–20 minutes.' },
      { step: 4, title: 'Aftercare', body: 'Return to normal activities immediately.' },
      { step: 5, title: '2-week review', body: 'Complimentary review to assess results.' },
    ],
    faq: [
      { q: 'How long does Botox last?', a: 'Anti-wrinkle injections typically last 3–4 months.' },
      { q: 'How much does Botox cost?', a: `From £200 per area at ${PRACTICE_NAME}.` },
    ],
  },
  {
    slug: 'general-dentistry',
    name: 'General Dentistry',
    tagline: 'Preventive, restorative, and routine care — all under one roof.',
    priceFrom: '£65',
    priceNote: 'Check-up from £65. Hygiene from £85. Treatment costs quoted at examination.',
    financeAvailable: false,
    h1: `General Dentistry in ${LOCATION}`,
    title: `General Dentistry ${LOCATION} | Private Dentist | ${PRACTICE_NAME}`,
    metaDesc: `Private general dentistry in ${LOCATION}, Surrey. Check-ups, fillings, hygiene and emergency care. New patients welcome.`,
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-ravi-pant'],
    gdcNote: false, rxNote: false, order: 9,
    whatIsIt: [
      `At ${PRACTICE_NAME}, our private general dentistry covers everything you need to maintain healthy teeth and gums — check-ups, hygiene, fillings, X-rays and emergency care.`,
      'Every appointment is thorough and unhurried. We look beyond the obvious to identify early signs of decay, gum disease and other conditions while they are still easy to treat.',
    ],
    benefits: [
      'Comprehensive check-ups including gum assessment and cancer screening',
      'White composite fillings',
      'Professional hygiene appointments',
      'Digital X-rays',
      'Emergency appointments available',
      'No waiting lists',
    ],
    process: [
      { step: 1, title: 'Comprehensive examination', body: 'Thorough examination of teeth, gums, bite and soft tissues.' },
      { step: 2, title: 'Gum health assessment', body: 'Pocket depths measured to assess gum health.' },
      { step: 3, title: 'Oral cancer screening', body: 'Systematic check of soft tissues.' },
      { step: 4, title: 'Treatment plan & discussion', body: 'All options explained clearly with costs.' },
      { step: 5, title: 'Hygiene & preventive care', body: 'Professional clean and oral hygiene advice.' },
      { step: 6, title: 'Restorative treatment (if needed)', body: 'Fillings and repairs using tooth-coloured materials.' },
    ],
    faq: [
      { q: 'Are you accepting new patients?', a: `Yes. ${PRACTICE_NAME} welcomes new private patients. Call us on 01428 604445.` },
      { q: 'How much does a check-up cost?', a: `A private check-up at ${PRACTICE_NAME} starts from £65.` },
      { q: 'Can I be seen as an emergency patient?', a: 'Yes. Call us on 01428 604445 and we will do everything we can to see you quickly.' },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const t of treatments) {
    await Treatment.findOneAndUpdate(
      { slug: t.slug, practice: PRACTICE },
      { ...t, practice: PRACTICE },
      { upsert: true, new: true }
    )
    console.log(`  Seeded: ${t.name}`)
  }

  console.log(`Done — ${treatments.length} treatments seeded for ${PRACTICE}`)
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
