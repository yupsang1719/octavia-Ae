import '../env.js'
import mongoose from 'mongoose'
import Treatment from '../models/Treatment.js'

const PRACTICE = 'octavia-house'
const LOCATION = 'Godalming'
const PRACTICE_NAME = 'Octavia House Dental Practice'

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
    metaDesc: `Expert dental implants in ${LOCATION}. Permanent tooth replacement from £2,500. Free consultation available.`,
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
      { step: 2, title: 'Implant placement', body: 'Under local anaesthetic, the titanium implant post is placed into the jawbone. Most patients report far less discomfort than expected.' },
      { step: 3, title: 'Healing period', body: 'Over 8–12 weeks, the implant fuses with your bone (osseointegration). A temporary restoration keeps your smile looking natural during this time.' },
      { step: 4, title: 'Crown fitting', body: 'Once the implant has fully integrated, a custom-made porcelain crown is attached — matched precisely to the colour and shape of your surrounding teeth.' },
      { step: 5, title: 'Aftercare', body: 'You receive a follow-up appointment and an aftercare plan. With regular hygiene visits and normal brushing, your implant should last a lifetime.' },
    ],
    faq: [
      { q: 'Are dental implants painful?', a: 'Most patients report less discomfort than expected. The procedure is carried out under local anaesthetic so you feel no pain during treatment. Some mild soreness for a few days afterwards is normal and easily managed with over-the-counter pain relief.' },
      { q: 'How long do dental implants last?', a: 'With proper care, dental implants can last 20 years or more. Many last a lifetime. Good oral hygiene and regular check-ups are the key factors.' },
      { q: 'Am I a candidate for dental implants?', a: 'Most adults with good general health are suitable candidates. Our dentist will assess your bone density, gum health and overall oral health at your free consultation.' },
      { q: 'How much do dental implants cost?', a: `A single dental implant at ${PRACTICE_NAME} starts from £2,500. We will provide a full personalised quote at your free consultation.` },
      { q: 'How long does the implant process take?', a: 'The full process typically takes 3–6 months, allowing time for the implant to integrate with the jawbone.' },
      { q: 'Can I get implants if I have had bone loss?', a: 'Bone grafting can often restore sufficient bone volume for implant placement. Our dentist will assess your X-rays at consultation and advise on your individual situation.' },
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
      'Invisalign is the world\'s leading clear aligner system, used to straighten teeth gradually using a series of custom-made, removable trays. Each tray is worn for approximately two weeks before progressing to the next, gently shifting your teeth into the desired position.',
      'Unlike traditional metal braces, Invisalign aligners are virtually invisible when worn, making them the preferred choice for adults and teenagers who want to improve their smile discreetly.',
      `At ${PRACTICE_NAME}, we use the latest iTero scanning technology to create a precise digital model of your teeth, allowing you to preview your expected results before treatment even begins.`,
    ],
    benefits: [
      'Virtually invisible — most people will not notice you are wearing them',
      'Removable — eat, drink and brush normally',
      'No dietary restrictions during treatment',
      'Comfortable smooth plastic — no metal wires or brackets',
      'Digital preview of your expected results before you start',
      'Shorter treatment times than many traditional options',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist assesses your teeth, discusses your goals and confirms whether Invisalign is right for you.' },
      { step: 2, title: 'Digital scan & treatment planning', body: 'A precise 3D iTero scan replaces messy impressions. You can see a simulation of your final smile before committing to treatment.' },
      { step: 3, title: 'Receive your aligners', body: 'Your custom aligner series arrives, usually within 2–3 weeks.' },
      { step: 4, title: 'Progress check-ups', body: 'Regular short appointments every 6–8 weeks to monitor your progress and hand over your next batch of aligners.' },
      { step: 5, title: 'Retainers', body: 'Once treatment is complete, a retainer is provided to maintain your new smile.' },
    ],
    faq: [
      { q: 'How long does Invisalign take?', a: 'Most cases take 6–18 months depending on complexity.' },
      { q: 'Can I eat and drink with Invisalign?', a: 'You remove your aligners to eat and drink anything other than water, so there are no dietary restrictions.' },
      { q: 'Is Invisalign noticeable?', a: 'Invisalign aligners are virtually invisible. Most people will not notice you are wearing them.' },
      { q: 'How much does Invisalign cost?', a: `Invisalign at ${PRACTICE_NAME} is priced following your free consultation. Comprehensive cases typically range from £2,800 to £5,000.` },
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
    metaDesc: `Composite bonding in ${LOCATION} from £250 per tooth. Same-day treatment, no drilling. Free consultation.`,
    heroImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 3,
    whatIsIt: [
      'Composite bonding is a cosmetic dental treatment in which a tooth-coloured resin material is applied directly to the surface of your teeth and sculpted by hand to correct chips, gaps, discolouration, uneven lengths or shape irregularities.',
      'The treatment requires no drilling in most cases and no anaesthetic — meaning it is completely pain-free for the vast majority of patients. It can typically be completed in a single appointment.',
    ],
    benefits: [
      'Same-day results — often completed in a single 1–3 hour appointment',
      'No drilling or injections required in most cases',
      'Completely reversible — no tooth structure is removed',
      'Corrects chips, gaps, discolouration and uneven teeth',
      'Matched precisely to your natural tooth colour',
      'One of the most affordable cosmetic treatments available',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist discusses your smile goals and assesses your teeth, explaining what composite bonding can achieve and providing a clear quote.' },
      { step: 2, title: 'Shade matching', body: 'The composite resin is carefully matched to your existing tooth colour.' },
      { step: 3, title: 'Surface preparation', body: 'The tooth surface is gently etched to help the resin bond securely.' },
      { step: 4, title: 'Bonding & sculpting', body: 'The resin is applied layer by layer and sculpted to achieve the desired shape.' },
      { step: 5, title: 'Polish & review', body: 'The composite is polished to a smooth, natural finish.' },
    ],
    faq: [
      { q: 'Does composite bonding hurt?', a: 'Composite bonding is a pain-free treatment. No injections or drilling are required in most cases.' },
      { q: 'How long does composite bonding last?', a: 'With good care, composite bonding lasts 5–7 years.' },
      { q: 'How much does composite bonding cost?', a: `From £250 per tooth at ${PRACTICE_NAME}. Full quote provided at your free consultation.` },
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
    metaDesc: `Porcelain veneers in ${LOCATION} from £800 per tooth. Natural-looking, long-lasting results. Free consultation.`,
    heroImage: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 4,
    whatIsIt: [
      'Porcelain veneers are ultra-thin ceramic shells, custom-crafted to bond to the front surface of your teeth. They are designed to permanently correct colour, shape, alignment and proportion, creating a smile that is both radiant and completely natural in appearance.',
      'Unlike composite bonding, porcelain veneers are fabricated in a dental laboratory to millimetre precision, with exceptional translucency and a stain-resistant surface.',
    ],
    benefits: [
      'Long-lasting — porcelain veneers typically last 10–15 years',
      'Stain-resistant surface that stays bright',
      'Exceptional translucency — mimics natural tooth enamel',
      'Corrects colour, shape, alignment and proportion',
      'Custom-crafted in a specialist dental laboratory',
    ],
    process: [
      { step: 1, title: 'Consultation & smile design', body: 'Our dentist discusses your goals and designs your veneers using a digital mockup so you can preview your result.' },
      { step: 2, title: 'Tooth preparation', body: 'A small amount of enamel is removed from the front of each tooth under local anaesthetic.' },
      { step: 3, title: 'Impressions & temporaries', body: 'Precise impressions are taken and sent to our ceramist. Temporary veneers are fitted in the meantime.' },
      { step: 4, title: 'Veneer fitting', body: 'Each veneer is checked for fit, colour and shape, then bonded permanently.' },
      { step: 5, title: 'Review appointment', body: 'A short follow-up appointment 1–2 weeks later checks your bite and ensures you are completely happy.' },
    ],
    faq: [
      { q: 'Are porcelain veneers permanent?', a: 'Because a small amount of enamel is removed during preparation, veneers are considered a long-term commitment lasting 10–15 years.' },
      { q: 'How much do porcelain veneers cost?', a: `Porcelain veneers at ${PRACTICE_NAME} start from £800 per tooth.` },
    ],
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    tagline: 'A brighter smile — safely.',
    priceFrom: '£299',
    priceNote: 'In-surgery whitening from £399. Home whitening kits from £299. Combination packages available.',
    financeAvailable: false,
    h1: `Teeth Whitening in ${LOCATION}`,
    title: `Teeth Whitening ${LOCATION} Surrey | Professional | ${PRACTICE_NAME}`,
    metaDesc: `Professional teeth whitening in ${LOCATION} from £299. In-surgery and home kits available.`,
    heroImage: 'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 5,
    whatIsIt: [
      'Professional teeth whitening is the safest, most effective way to lighten the natural colour of your teeth without damaging them. We offer both in-surgery whitening and custom home whitening kits.',
      'Professional whitening uses clinically proven concentrations that can lighten teeth by several shades safely — far more effective than over-the-counter products.',
    ],
    benefits: [
      'Noticeable results in a single visit or within 2 weeks of home use',
      'Safe, clinically proven concentrations',
      'Custom-fitted trays for even, comfortable whitening',
      'Can lighten teeth by 4–8 shades',
      'Long-lasting results with simple maintenance',
    ],
    process: [
      { step: 1, title: 'Shade assessment', body: 'We photograph your teeth and record your current shade.' },
      { step: 2, title: 'Custom tray impressions', body: 'Precise impressions create trays that fit your teeth exactly.' },
      { step: 3, title: 'Whitening treatment', body: 'In-surgery or home kit as agreed at consultation.' },
      { step: 4, title: 'Review & top-up', body: 'We review results and provide top-up gel to maintain your shade.' },
    ],
    faq: [
      { q: 'Is professional teeth whitening safe?', a: 'Yes. Professional whitening carried out by a GDC-registered dentist is safe.' },
      { q: 'How many shades whiter can I expect?', a: 'Most patients achieve 4–8 shades of whitening.' },
      { q: 'How long do results last?', a: 'Professional whitening results typically last 12–18 months.' },
    ],
  },
  {
    slug: 'six-month-smile',
    name: '6 Month Smile',
    tagline: 'A straighter smile in as little as 6 months.',
    priceFrom: '£2,000',
    priceNote: 'From £2,000 depending on complexity. Full quote provided at free consultation.',
    financeAvailable: false,
    h1: `6 Month Smile in ${LOCATION}`,
    title: `6 Month Smile ${LOCATION} Surrey | Short-Term Braces | ${PRACTICE_NAME}`,
    metaDesc: `6 Month Smile orthodontics in ${LOCATION}. Straighten your front teeth in as little as 6 months using clear braces.`,
    heroImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-rachayita-pant'],
    gdcNote: false, rxNote: false, order: 6,
    whatIsIt: [
      '6 Month Smile is a short-term orthodontic system specifically designed to straighten the front teeth in a fraction of the time taken by traditional braces. Most cases are completed in just 4–9 months.',
      'The system uses tooth-coloured brackets and clear wires that are far less visible than conventional metal braces.',
    ],
    benefits: [
      'Faster results than traditional orthodontics — typically 4–9 months',
      'Tooth-coloured brackets and wires — far less visible than metal braces',
      'Fixed appliance — no need to remember to wear trays',
      'Lower cost than comprehensive Invisalign treatment',
    ],
    process: [
      { step: 1, title: 'Free consultation', body: 'Our dentist assesses your teeth and bite and confirms whether 6 Month Smile is the right treatment.' },
      { step: 2, title: 'Records & treatment planning', body: 'Detailed records are submitted to the 6 Month Smile lab.' },
      { step: 3, title: 'Bracket placement', body: 'Tooth-coloured brackets and clear wire are fitted.' },
      { step: 4, title: 'Monthly adjustments', body: 'Regular short appointments every 4–6 weeks.' },
      { step: 5, title: 'Debond & retainers', body: 'Brackets removed and retainer provided.' },
    ],
    faq: [
      { q: 'How long does 6 Month Smile take?', a: 'Most cases complete in 4–9 months.' },
      { q: 'How much does 6 Month Smile cost?', a: `From £2,000 at ${PRACTICE_NAME} depending on complexity.` },
    ],
  },
  {
    slug: 'air-flow-hygiene',
    name: 'Air Flow Hygiene',
    tagline: 'The deepest clean your teeth have ever had.',
    priceFrom: '£99',
    priceNote: 'Air Flow hygiene appointment from £99. Combined with stain removal from £129.',
    financeAvailable: false,
    h1: `Air Flow Hygiene in ${LOCATION}`,
    title: `Air Flow Hygiene ${LOCATION} | Advanced Dental Cleaning | ${PRACTICE_NAME}`,
    metaDesc: `Air Flow advanced hygiene treatment in ${LOCATION}. Deeper, fresher clean than standard scale and polish.`,
    heroImage: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-sadikchha-gurung'],
    gdcNote: false, rxNote: false, order: 7,
    whatIsIt: [
      'Air Flow is an advanced dental hygiene system that uses a controlled stream of compressed air, warm water and fine powder particles to remove plaque, staining and early calculus from your teeth and beneath the gum line.',
      'The treatment leaves teeth feeling exceptionally clean and noticeably brighter, as surface staining from tea, coffee, wine and tobacco is removed efficiently.',
    ],
    benefits: [
      'Removes staining, plaque and early calculus in one appointment',
      'Reaches areas traditional cleaning cannot',
      'Gentle and comfortable — no scraping sensation',
      'Leaves teeth visibly brighter',
      'Reduces risk of gum disease and early decay',
    ],
    process: [
      { step: 1, title: 'Oral health assessment', body: 'We review your gum health and confirm Air Flow is appropriate.' },
      { step: 2, title: 'Air Flow treatment', body: 'Fine powder, water and air removes plaque, stain and early calculus.' },
      { step: 3, title: 'Ultrasonic scaling (if needed)', body: 'Hardened calculus is removed with an ultrasonic scaler.' },
      { step: 4, title: 'Polish & fluoride', body: 'Teeth are polished and fluoride applied to strengthen enamel.' },
    ],
    faq: [
      { q: 'Is Air Flow better than a standard scale and polish?', a: 'Air Flow reaches areas standard cleaning cannot and removes staining far more effectively.' },
      { q: 'How often should I have Air Flow?', a: 'Most patients benefit from an Air Flow appointment every 6 months.' },
    ],
  },
  {
    slug: 'general-dentistry',
    name: 'General Dentistry',
    tagline: 'NHS and private care — all under one roof.',
    priceFrom: 'NHS or from £65',
    priceNote: 'NHS treatment available. Private check-up from £65. Treatment costs quoted at examination.',
    financeAvailable: false,
    h1: `General Dentistry in ${LOCATION}`,
    title: `General Dentistry ${LOCATION} | NHS & Private Dentist | ${PRACTICE_NAME}`,
    metaDesc: `NHS and private general dentistry in ${LOCATION}, Surrey. Check-ups, fillings, hygiene and emergency care. New patients welcome.`,
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    specialists: ['dr-ravi-pant'],
    gdcNote: false, rxNote: false, order: 8,
    whatIsIt: [
      `At ${PRACTICE_NAME}, we provide both NHS and private general dentistry — covering everything you need to maintain healthy teeth and gums, from routine check-ups and hygiene to fillings, X-rays and emergency care.`,
      'Whether you are an NHS patient or prefer private care, every appointment is thorough and personalised. We look beyond the obvious to identify early signs of decay, gum disease and other conditions that are far easier to treat when caught early.',
    ],
    benefits: [
      'NHS treatment available for eligible patients',
      'Comprehensive check-ups including gum assessment and cancer screening',
      'White composite fillings',
      'Professional hygiene appointments',
      'Digital X-rays with immediate on-screen results',
      'Emergency appointments available',
    ],
    process: [
      { step: 1, title: 'Comprehensive examination', body: 'Thorough clinical examination of teeth, gums, bite and soft tissues.' },
      { step: 2, title: 'Gum health assessment', body: 'We measure pocket depths around each tooth to assess gum health.' },
      { step: 3, title: 'Oral cancer screening', body: 'Systematic check of soft tissues for any unusual changes.' },
      { step: 4, title: 'Treatment plan & discussion', body: 'We explain our findings and all your options — including NHS and private costs — clearly.' },
      { step: 5, title: 'Hygiene & preventive care', body: 'Professional clean and tailored oral hygiene advice.' },
      { step: 6, title: 'Restorative treatment (if needed)', body: 'Fillings and repairs using tooth-coloured materials.' },
    ],
    faq: [
      { q: 'Do you accept NHS patients?', a: `Yes. ${PRACTICE_NAME} provides NHS dental treatment for eligible patients. Please call us to check availability.` },
      { q: 'How much does an NHS check-up cost?', a: 'NHS dental charges are set by the government. Band 1 (examination, X-rays, scale & polish) is £26.80. We will confirm your treatment band before proceeding.' },
      { q: 'How often should I have a check-up?', a: 'For most patients, every six months is the right interval. We will recommend a personalised recall interval at your first appointment.' },
      { q: 'Can I be seen as an emergency patient?', a: `Yes. Call us on 01483 860020 and we will do everything we can to see you quickly.` },
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
