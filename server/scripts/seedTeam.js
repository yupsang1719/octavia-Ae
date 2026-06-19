import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

const members = [
  {
    name: 'Dr Ali',
    slug: 'dr-ali',
    role: 'Implant & Restorative Specialist',
    eyebrow: 'Implant & Restorative Specialist',
    category: 'dentist',
    specialisms: ['Dental Implants', 'Complex Restorative', 'Crowns & Bridges'],
    gdcNumber: '',
    image: '/images/team/dr-ali.jpg',
    initials: 'DA',
    bio: 'Dr Ali is the principal implant specialist at Octavia Dental & Facial Aesthetics. With extensive postgraduate training in implant dentistry, he provides permanent tooth replacement solutions for patients across Surrey and Hampshire. His meticulous approach and dedication to clinical excellence mean patients can expect natural-looking, long-lasting results.',
    bioExtended: [
      'Dr Ali brings a meticulous, patient-centred approach to every implant case — from single tooth replacements to complex full-arch restorations. His calm, reassuring manner has earned the trust of patients who have previously been anxious about dental treatment, and his results speak for themselves.',
      "Patients travel from across Surrey and Hampshire to benefit from Dr Ali's expertise at our Godalming clinic — a testament to the reputation he has built through consistently outstanding clinical outcomes and genuine care for his patients' wellbeing.",
    ],
    qualifications: [
      'BDS — Primary dental qualification',
      'Postgraduate Diploma in Implantology',
      'GDC registered clinician',
      'Member of the Association of Dental Implantology (ADI)',
    ],
    treatments: [
      { label: 'Dental Implants',     href: '/treatments/dental-implants' },
      { label: 'Crowns & Bridges',    href: '/treatments/dental-implants' },
      { label: 'Complex Restorative', href: '/treatments/dental-implants' },
    ],
    bookingService: 'implants',
    ctaHeading: 'Book a consultation with Dr Ali',
    ctaBody: 'Free initial consultation includes a full clinical assessment and a personalised treatment plan.',
    prescriptionNotice: false,
    hasPage: true,
    metaTitle: 'Dr Ali — Dental Implant Specialist | Octavia Dental Godalming',
    metaDesc: 'Dr Ali is our dental implant specialist at Octavia Dental, Godalming. GDC registered with extensive experience in implants, restorative and complex dental cases.',
    published: true,
    order: 1,
  },
  {
    name: 'Dr Ana',
    slug: 'dr-ana',
    role: 'Cosmetic Dentist & Aesthetics Specialist',
    eyebrow: 'Cosmetic Dentist & Aesthetics Specialist',
    category: 'dentist',
    specialisms: ['Composite Bonding', 'Invisalign', 'Facial Aesthetics', 'Veneers', 'Teeth Whitening'],
    gdcNumber: '',
    image: '/images/team/dr-ana.jpg',
    initials: 'DA',
    bio: 'Dr Ana is our cosmetic dentist and facial aesthetics specialist. She combines a passion for smile design with advanced training in non-surgical aesthetics, offering patients a truly comprehensive approach to their appearance. Her warm, reassuring manner puts even nervous patients at ease.',
    bioExtended: [
      "Dr Ana's approach to cosmetic dentistry is shaped by a philosophy of subtle enhancement — helping patients look like the best version of themselves, rather than changing their appearance beyond recognition. She is known for her attention to detail and her ability to put even the most anxious patients at ease.",
      'Her dual expertise in cosmetic dentistry and facial aesthetics makes Dr Ana uniquely positioned to deliver a complete smile and face refresh in a single practice visit — a combination that previously required appointments across multiple providers.',
    ],
    qualifications: [
      'BDS — Primary dental qualification',
      'Postgraduate training in cosmetic dentistry',
      'Advanced certificate in facial aesthetics',
      'GDC registered clinician',
      'Certified Invisalign provider',
    ],
    treatments: [
      { label: 'Composite Bonding',    href: '/treatments/composite-bonding' },
      { label: 'Invisalign',           href: '/treatments/invisalign' },
      { label: 'Porcelain Veneers',    href: '/treatments/veneers' },
      { label: 'Teeth Whitening',      href: '/treatments/teeth-whitening' },
      { label: 'Botox & Anti-Wrinkle', href: '/treatments/botox-anti-wrinkle' },
      { label: '6 Month Smile',        href: '/treatments/six-month-smile' },
      { label: 'Air Flow Hygiene',     href: '/treatments/air-flow-hygiene' },
    ],
    bookingService: 'bonding',
    ctaHeading: 'Book a consultation with Dr Ana',
    ctaBody: 'Whether you want to enhance your smile or refresh your appearance, Dr Ana will guide you through all your options at no cost.',
    prescriptionNotice: true,
    hasPage: true,
    metaTitle: 'Dr Ana — Cosmetic & Aesthetics Dentist | Octavia Dental Godalming',
    metaDesc: 'Dr Ana specialises in cosmetic dentistry and facial aesthetics at Octavia Dental, Godalming. Invisalign, composite bonding, veneers, Botox and anti-wrinkle injections.',
    published: true,
    order: 2,
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const data of members) {
    await TeamMember.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true })
    console.log(`Upserted: ${data.name}`)
  }

  console.log('Team seeded successfully')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
