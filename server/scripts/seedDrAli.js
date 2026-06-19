import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await TeamMember.findOneAndUpdate(
    { slug: 'dr-ali' },
    {
      name:      'Dr Ali Al-Aushi',
      slug:      'dr-ali',
      role:      'Implant & Restorative Dentist',
      eyebrow:   'Implant & Restorative Dentist',
      category:  'dentist',
      initials:  'AA',
      gdcNumber: '128669',
      image:     '/uploads/team/dr-ali.jpg',

      specialisms: [
        'Dental Implants',
        'Endodontics (Root Canal)',
        'Crowns & Bridges',
        'Prosthodontics',
        'Cosmetic Dentistry',
      ],

      bio: 'Dr Ali Al-Aushi graduated from the University of Leeds in 2007 and has since built 18 years of clinical experience — the last 13 spent exclusively in private dentistry. His relaxed, easy-going nature allows even the most nervous patients to feel completely at ease in the chair.',

      bioExtended: [
        'After completing his vocational training in East Yorkshire, Dr Ali broadened his clinical horizons working in Australia and Singapore before returning to the UK. This international experience, combined with deep specialist training in endodontics and prosthodontics, gives him a well-rounded perspective that benefits every patient he treats.',
        'Dr Ali holds a special interest in saving teeth wherever possible — through advanced root canal treatment and complex restorative work — before considering extraction. Where a tooth cannot be saved, he places dental implants to the same exacting standard, ensuring patients leave with a result they can trust for life.',
        'He speaks both English and Arabic, and welcomes patients from across Surrey and Hampshire who are looking for a clinician they can genuinely put their trust in.',
      ],

      qualifications: [
        'BChD — University of Leeds (2007)',
        'Vocational Training — East Yorkshire',
        'Postgraduate training in Endodontics',
        'Postgraduate training in Prosthodontics',
        'Postgraduate training in Dental Implantology',
        'GDC No. 128669',
      ],

      treatments: [
        { label: 'Dental Implants',       href: '/treatments/dental-implants' },
        { label: 'Root Canal Treatment',  href: '/treatments/dental-implants' },
        { label: 'Crowns & Bridges',      href: '/treatments/dental-implants' },
        { label: 'Composite Bonding',     href: '/treatments/composite-bonding' },
        { label: 'Teeth Whitening',       href: '/treatments/teeth-whitening' },
        { label: 'Porcelain Veneers',     href: '/treatments/veneers' },
      ],

      bookingService: 'implants',
      ctaHeading: 'Book a consultation with Dr Ali',
      ctaBody:    'Dr Ali offers a relaxed, thorough consultation to discuss your options — whether you need a single implant, complex restorative work, or root canal treatment.',
      prescriptionNotice: false,
      hasPage:    true,

      metaTitle: 'Dr Ali Al-Aushi — Implant & Restorative Dentist | Octavia Dental Godalming',
      metaDesc:  'Dr Ali Al-Aushi is an implant and restorative dentist at Octavia Dental, Godalming. GDC No. 128669. 18 years experience. Special interest in dental implants, endodontics and prosthodontics.',

      published: true,
      order: 3,
    },
    { upsert: true, new: true }
  )
  console.log('Upserted: Dr Ali Al-Aushi')

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
