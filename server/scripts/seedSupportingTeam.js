import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

const members = [
  {
    name:     'Helen Gadd',
    slug:     'helen-gadd',
    role:     'Practice Manager & Reception',
    eyebrow:  'Practice Manager',
    category: 'practice-manager',
    initials: 'HG',
    gdcNumber: '',
    image:    '/uploads/team/helen-gadd.jpg',

    specialisms: [
      'Practice Management',
      'Patient Experience',
      'Customer Service',
    ],

    bio: 'Helen brings with her a great wealth of knowledge and experience in customer service and management. She strives to help at all times with a smile.',

    bioExtended: [
      'An avid athlete, she is always engaged in raising money for various charitable causes — bringing the same energy and dedication to the practice as she does to everything she sets her mind to.',
    ],

    qualifications: [],
    treatments: [],

    bookingService: '',
    ctaHeading: 'Get in touch with the practice',
    ctaBody:    'Helen and the team are here to help with appointments, queries and anything else you need. We aim to respond to all enquiries within one working day.',
    prescriptionNotice: false,
    hasPage:    false,

    metaTitle: 'Helen Gadd — Practice Manager | Octavia Dental Godalming',
    metaDesc:  'Helen Gadd is practice manager and reception at Octavia Dental, Godalming. Bringing warmth and expertise to every patient interaction.',

    published: true,
    order: 10,
  },
  {
    name:     'Anjali Limbu',
    slug:     'anjali-limbu',
    role:     'Dental Nurse',
    eyebrow:  'Dental Nurse',
    category: 'nurse',
    initials: 'AL',
    gdcNumber: '298419',
    image:    '/uploads/team/anjali-limbu.jpg',

    specialisms: [],

    bio: 'Anjali has been with us since June 2019. She is very soft spoken, always smiling and tries to do her best.',

    bioExtended: [
      'Her calm and gentle presence makes a real difference to patients in the chair — particularly those who feel anxious about dental treatment. Anjali\'s dedication to patient comfort is evident in everything she does.',
    ],

    qualifications: [
      'GDC No. 298419',
    ],

    treatments: [],

    bookingService: '',
    ctaHeading: 'Book an appointment',
    ctaBody:    'Our nursing team, including Anjali, are here to make every visit as comfortable as possible.',
    prescriptionNotice: false,
    hasPage:    false,

    metaTitle: 'Anjali Limbu — Dental Nurse | Octavia Dental Godalming',
    metaDesc:  'Anjali Limbu is a dental nurse at Octavia Dental, Godalming. GDC No. 298419. Known for her gentle, caring approach and commitment to patient comfort.',

    published: true,
    order: 20,
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const data of members) {
    await TeamMember.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true })
    console.log(`Upserted: ${data.name}`)
  }

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
