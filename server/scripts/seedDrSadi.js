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
    { slug: 'dr-sadikchha-gurung' },
    {
      name:     'Dr Sadikchha Gurung',
      slug:     'dr-sadikchha-gurung',
      role:     'Dentist',
      eyebrow:  'Dentist',
      category: 'dentist',
      initials: 'SG',
      gdcNumber: '267626',
      image:    '/uploads/team/dr-sadikchha-gurung.jpg',

      specialisms: [
        'Endodontics',
        'Periodontics',
        'Cosmetic Dentistry',
      ],

      bio: 'Dr Sadi qualified in 2014 with various awards and has been working with us since April 2017.',

      bioExtended: [
        'She has a special interest in Endodontics, Periodontics and Cosmetic Dentistry. She is motivated to continuously improve her skills and knowledge and has been taking various postdoctoral training courses to enhance her skills further.',
        'With her wealth of knowledge and gentle, caring attitude, she is an asset to the practice — putting patients at ease and delivering thorough, considered care at every appointment.',
        'In her spare time she enjoys travelling, hiking, running and swimming.',
      ],

      qualifications: [
        'BDS — Kathmandu University (2014, with awards)',
        'Postdoctoral training in Endodontics',
        'Postdoctoral training in Periodontics',
        'Postdoctoral training in Cosmetic Dentistry',
        'GDC No. 267626',
      ],

      treatments: [
        { label: 'Root Canal Treatment',  href: '/treatments/dental-implants' },
        { label: 'Composite Bonding',     href: '/treatments/composite-bonding' },
        { label: 'Teeth Whitening',       href: '/treatments/teeth-whitening' },
        { label: 'Air Flow Hygiene',      href: '/treatments/air-flow-hygiene' },
        { label: 'Porcelain Veneers',     href: '/treatments/veneers' },
      ],

      bookingService: 'general',
      ctaHeading: 'Book an appointment with Dr Sadi',
      ctaBody:    'Dr Sadi\'s gentle, caring approach makes her particularly popular with nervous patients. Book a consultation to discuss your dental needs.',
      prescriptionNotice: false,
      hasPage:    true,

      metaTitle: 'Dr Sadikchha Gurung — Dentist | Octavia Dental Godalming',
      metaDesc:  'Dr Sadikchha Gurung is a dentist at Octavia Dental, Godalming. GDC No. 267626. Special interest in endodontics, periodontics and cosmetic dentistry. Gentle, caring approach.',

      published: true,
      order: 5,
    },
    { upsert: true, new: true }
  )
  console.log('Upserted: Dr Sadikchha Gurung')

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
