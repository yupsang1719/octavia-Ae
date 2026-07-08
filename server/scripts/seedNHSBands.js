import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Treatment from '../models/Treatment.js'

const bands = [
  {
    slug:     'band-1',
    name:     'Band 1',
    tagline:  'Examination, diagnosis and preventative care',
    priceFrom: '£27.90',
    h1:       'NHS Band 1 — Examination & Prevention',
    title:    'NHS Band 1 Treatment £27.90 | Octavia House Dental Practice Godalming',
    metaDesc: 'NHS Band 1 treatment costs £27.90 and covers dental examinations, x-rays, scale and polish, and preventative care at Octavia House Dental Practice, Godalming.',
    whatIsIt: [
      'Band 1 is the entry level of NHS dental care and covers all the essential diagnostic and preventative treatment your dentist provides in a single course of care. The Band 1 charge is £27.90 — a fixed cost regardless of how many examinations or preventative treatments are needed within that course.',
      'A Band 1 course of treatment covers your dental examination, any x-rays taken, a scale and polish if clinically needed, and preventative care such as advice, fluoride treatment and fissure sealants. Urgent dental care also falls within the Band 1 charge.',
      'If during your examination your dentist identifies that you need a filling, extraction or other restorative work, your treatment will move to Band 2 or Band 3. You pay only the single charge for the highest band reached — you never pay separately for each item of treatment.',
    ],
    benefits: [
      'Full dental examination',
      'Diagnosis, including x-rays',
      'Scale and polish (if clinically indicated)',
      'Fluoride treatment',
      'Fissure sealants',
      'Preventative advice and care',
      'Urgent dental assessment',
    ],
    notCovers: [
      'Fillings (covered under Band 2)',
      'Extractions (covered under Band 2)',
      'Root canal treatment (covered under Band 2)',
      'Crowns, bridges and dentures (covered under Band 3)',
    ],
    faq: [
      { q: 'What is included in an NHS Band 1 course of treatment?', a: 'Band 1 covers your dental examination, diagnosis (including any x-rays taken), a scale and polish if clinically needed, and preventative treatments such as fluoride application and fissure sealants. Urgent dental care also falls under Band 1.' },
      { q: 'How much does NHS Band 1 cost?', a: 'A Band 1 course of treatment costs £27.90 from 1 April 2026. This is a fixed charge — you pay the same whether you have one examination or several preventative treatments within the same course of care.' },
      { q: 'What if my dentist finds I need a filling during my Band 1 examination?', a: 'If your dentist identifies that you need a filling, extraction or other restorative work, your treatment will move to Band 2. You only pay the Band 2 charge (£76.60) — you do not pay Band 1 on top.' },
      { q: 'Who is exempt from NHS dental charges?', a: 'You may be entitled to free NHS dental treatment if you are under 18, pregnant or have given birth in the last 12 months, receiving certain benefits, or have a valid HC2/HC3 certificate. Check eligibility at the NHSBSA website.' },
      { q: 'Does urgent dental care cost extra?', a: 'No. Urgent dental care falls within the Band 1 charge of £27.90. If further treatment is needed at a follow-up appointment, that may attract a higher band charge.' },
    ],
    order: 1,
  },
  {
    slug:     'band-2',
    name:     'Band 2',
    tagline:  'Fillings, extractions and root canal treatment',
    priceFrom: '£76.60',
    h1:       'NHS Band 2 — Fillings, Extractions & Root Canals',
    title:    'NHS Band 2 Treatment £76.60 | Octavia House Dental Practice Godalming',
    metaDesc: 'NHS Band 2 treatment costs £76.60 and covers fillings, extractions, root canal treatment and everything in Band 1. Octavia House Dental Practice, Godalming.',
    whatIsIt: [
      'Band 2 covers all the restorative dental treatment most patients need. The Band 2 charge is £76.60 — a single fixed charge for all Band 2 and Band 1 treatments within one course of care, regardless of how many fillings, extractions or root canal treatments are needed.',
      'If you come in for an examination and your dentist discovers you need a filling, your treatment is upgraded to Band 2. You pay only the Band 2 charge — not Band 1 separately. If you need multiple fillings in the same course of treatment, you still pay just the one Band 2 charge.',
      'Band 2 covers amalgam and tooth-coloured composite fillings, simple and surgical extractions, root canal treatment and any further treatment following an urgent appointment. It includes everything in Band 1.',
    ],
    benefits: [
      'Everything in Band 1 (examination, x-rays, scale and polish, preventative care)',
      'White (composite) and amalgam fillings',
      'Simple tooth extractions',
      'Surgical extractions',
      'Root canal treatment',
      'Further treatment following an urgent care appointment',
    ],
    notCovers: [
      'Crowns (covered under Band 3)',
      'Bridges (covered under Band 3)',
      'Dentures (covered under Band 3)',
      'Other laboratory-made restorations (covered under Band 3)',
    ],
    faq: [
      { q: 'What is included in an NHS Band 2 course of treatment?', a: 'Band 2 includes everything in Band 1 (examination, x-rays, scale and polish, preventative care), plus fillings (white or amalgam), extractions (simple and surgical), and root canal treatment.' },
      { q: 'How much does NHS Band 2 cost?', a: 'A Band 2 course of treatment costs £76.60 from 1 April 2026. If you need three fillings, you still pay just £76.60, not £76.60 per filling.' },
      { q: 'If I need a filling and an extraction, do I pay twice?', a: 'No. You pay a single Band 2 charge regardless of how many Band 2 treatments you receive in the same course of care.' },
      { q: 'What if I also need a crown or denture?', a: 'If you need a crown, bridge or denture, your treatment moves to Band 3 (£332.10). You pay only the Band 3 charge — not Band 2 on top of it.' },
      { q: 'Are white fillings available on the NHS?', a: 'Yes. White composite fillings are available on the NHS for front teeth. For back teeth, availability depends on clinical need — your dentist will advise.' },
    ],
    order: 2,
  },
  {
    slug:     'band-3',
    name:     'Band 3',
    tagline:  'Crowns, dentures, bridges and complex restorations',
    priceFrom: '£332.10',
    h1:       'NHS Band 3 — Crowns, Dentures & Bridges',
    title:    'NHS Band 3 Treatment £332.10 | Octavia House Dental Practice Godalming',
    metaDesc: 'NHS Band 3 treatment costs £332.10 and covers crowns, dentures, bridges and all laboratory-made restorations. Octavia House Dental Practice, Godalming.',
    whatIsIt: [
      'Band 3 covers the most complex NHS dental treatments — those requiring laboratory fabrication such as crowns, dentures and bridges. The Band 3 charge is £332.10 and covers all Band 3, Band 2 and Band 1 treatments within a single course of care.',
      'If your treatment plan includes a crown, denture or bridge alongside fillings, extractions or other restorative work, you pay only the one Band 3 charge. There is no additional charge for the Band 1 or Band 2 treatments needed within the same course.',
      'Band 3 treatments are laboratory-made restorations crafted to fit your specific teeth. Your dentist will explain exactly what is included in your treatment plan before any work begins.',
    ],
    benefits: [
      'Everything in Bands 1 and 2',
      'Crowns',
      'Bridges',
      'Full and partial dentures',
      'Inlays and onlays',
      'Other laboratory-made restorations',
    ],
    notCovers: [
      'Cosmetic treatments not clinically necessary (e.g. teeth whitening, veneers for purely cosmetic reasons)',
      'Implants (not routinely available on NHS)',
      'Orthodontic treatment for adults (separate NHS orthodontic charges apply)',
    ],
    faq: [
      { q: 'What is included in an NHS Band 3 course of treatment?', a: 'Band 3 includes everything in Bands 1 and 2, plus crowns, bridges, dentures and other laboratory-made restorations.' },
      { q: 'How much does NHS Band 3 cost?', a: 'A Band 3 course of treatment costs £332.10 from 1 April 2026. If you need a crown, two fillings and an extraction, you pay one Band 3 charge.' },
      { q: 'Do I pay Band 3 for every crown I need?', a: 'No. The Band 3 charge covers your entire course of treatment, regardless of how many crowns or other Band 3 items are included.' },
      { q: 'Are dental implants available on the NHS?', a: 'Dental implants are not routinely available on the NHS and are not covered by the Band 3 charge. Private implant treatment is available at our practice.' },
      { q: 'What is the difference between an NHS and private crown?', a: 'NHS crowns are provided to a good clinical standard but material and shade choices may be more limited than private alternatives. Your dentist can explain both options.' },
    ],
    order: 3,
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const band of bands) {
    await Treatment.findOneAndUpdate(
      { slug: band.slug, practice: 'octavia-house' },
      { ...band, practice: 'octavia-house', type: 'nhs-band', published: true },
      { upsert: true, new: true }
    )
    console.log(`  Seeded: ${band.name} (${band.priceFrom})`)
  }

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
