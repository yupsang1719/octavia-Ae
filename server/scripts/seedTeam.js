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
    name: 'Dr Ana Biel',
    slug: 'dr-ana',
    role: 'Oral Surgery & Facial Aesthetics Specialist',
    eyebrow: 'Dual-Qualified Dentist & Medical Doctor',
    category: 'dentist',
    specialisms: ['Oral Surgery', 'Dental Implants', 'Bone Preservation', 'Facial Aesthetics', 'General Dentistry'],
    gdcNumber: '',
    image: '/images/team/dr-ana.jpg',
    initials: 'AB',
    bio: 'Dr Ana Biel is a dual-qualified Dentist and Medical Doctor, registered with the General Dental Council (GDC), with extensive expertise in General Dentistry, Oral Surgery, Implant Dentistry, and Facial Aesthetics. She specialises in complex tooth extractions, bone preservation procedures, and dental implantology, providing predictable, evidence-based, long-term solutions for patients requiring tooth replacement.',
    bioExtended: [
      'Dr Biel has a particular interest in oral surgery, specialising in complex tooth extractions, bone preservation procedures, and dental implantology. Her surgical precision, combined with her comprehensive medical background, enables her to deliver a holistic, medically informed approach to patient care.',
      'Alongside her implant practice, Dr Biel provides facial aesthetic treatments — non-surgical procedures designed to enhance facial harmony while maintaining natural-looking results. Her medical training provides an in-depth understanding of facial anatomy, ensuring treatments are carried out safely, precisely, and to the highest clinical standards.',
      'Dr Biel has worked in leading dental clinics in both the United Kingdom and Spain, combining advanced clinical practice with academic teaching, research, and scientific publications. During her medical degree, she achieved several academic distinctions (Honours) and was awarded the Best Master\'s Thesis Prize during her Master\'s Degree in Oral Surgery and Implantology. Her research focused on the role of Vitamin D in dental implant healing, investigating the biological factors influencing osseointegration and long-term implant success.',
      'Her philosophy is centred on providing safe, minimally invasive, and personalised care, using the latest evidence-based techniques to restore oral health, function, confidence, and facial aesthetics — ensuring every patient feels informed, comfortable, and supported throughout their treatment journey.',
    ],
    qualifications: [
      'Medical Degree — academic distinctions (Honours)',
      'BDS — Primary dental qualification',
      'Master\'s Degree in Oral Surgery and Implantology — Best Master\'s Thesis Prize',
      'GDC registered clinician',
      'Research published in dental implantology and osseointegration',
    ],
    treatments: [
      { label: 'Facial Aesthetics', href: '/facial-aesthetics' },
      { label: 'Aligners',          href: '/treatments/invisalign' },
      { label: 'Dental Implants',   href: '/treatments/dental-implants' },
      { label: 'General Dentistry',  href: '/treatments/general-dentistry' },
    ],
    bookingService: 'implants',
    ctaHeading: 'Book a consultation with Dr Biel',
    ctaBody: 'Dr Biel offers a comprehensive assessment covering your oral surgery and facial aesthetics needs, with a personalised treatment plan — at no cost.',
    prescriptionNotice: true,
    hasPage: true,
    metaTitle: 'Dr Ana Biel — Oral Surgery & Facial Aesthetics | Octavia Dental Godalming',
    metaDesc: 'Dr Ana Biel is a dual-qualified Dentist and Medical Doctor at Octavia Dental, Godalming. Specialising in oral surgery, dental implants, bone preservation, and facial aesthetics.',
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
