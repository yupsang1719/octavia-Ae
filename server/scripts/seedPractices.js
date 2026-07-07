import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Practice from '../models/Practice.js'

const practices = [
  {
    slug:    'octavia-aesthetic',
    name:    'Octavia Dental & Facial Aesthetics',
    domains: ['octavia-dental.co.uk', 'www.octavia-dental.co.uk'],
    address: 'Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ',
    phone:   '01483 958205',
    email:   'info@octavia-dental.co.uk',
    whatsapp: '447584965468',
    type:    'private',
    tagline: 'Private dental care & facial aesthetics in Godalming, Surrey.',
    instagram: 'https://instagram.com/octaviadental',
    googleMapsUrl: 'https://maps.google.com/?q=Octavia+Dental+Godalming',
    metaTitle: 'Octavia Dental & Facial Aesthetics | Godalming, Surrey',
    metaDesc:  'Private dental care and facial aesthetics in Godalming, Surrey. Dental implants, Invisalign, cosmetic dentistry and anti-wrinkle treatments.',
    hours: [
      { day: 'Monday',    hours: '8:30 am – 6:00 pm', closed: false },
      { day: 'Tuesday',   hours: '8:30 am – 6:00 pm', closed: false },
      { day: 'Wednesday', hours: '8:30 am – 6:00 pm', closed: false },
      { day: 'Thursday',  hours: '8:30 am – 6:00 pm', closed: false },
      { day: 'Friday',    hours: '8:30 am – 5:00 pm', closed: false },
      { day: 'Saturday',  hours: '9:00 am – 2:00 pm', closed: false },
      { day: 'Sunday',    hours: '',                   closed: true  },
    ],
  },
  {
    slug:    'octavia-house',
    name:    'Octavia House Dental Practice',
    domains: ['octaviahousedentalpractice.co.uk', 'www.octaviahousedentalpractice.co.uk'],
    address: 'Crown Court, High Street, Godalming, Surrey GU7 1DY',
    phone:   '01483 860020',
    email:   'octaviahousedentalpractice@btconnect.com',
    whatsapp: '',
    type:    'mixed',
    tagline: 'NHS and private dental care in Godalming, Surrey.',
    instagram: '',
    googleMapsUrl: 'https://maps.google.com/?q=Octavia+House+Dental+Practice+Godalming',
    metaTitle: 'Octavia House Dental Practice | NHS & Private Dentist Godalming',
    metaDesc:  'NHS and private dental care in Godalming, Surrey. General dentistry, implants, cosmetic treatments and orthodontics.',
    hours: [
      { day: 'Monday',    hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Tuesday',   hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Wednesday', hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Thursday',  hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Friday',    hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Saturday',  hours: '',                   closed: true  },
      { day: 'Sunday',    hours: '',                   closed: true  },
    ],
  },
  {
    slug:    'new-octavia',
    name:    'New Octavia Dental Surgery',
    domains: ['newoctaviadentalsurgery.com', 'www.newoctaviadentalsurgery.com'],
    address: 'Parsons Lane, Beacon Hill, Hindhead, Surrey GU26 6NP',
    phone:   '01428 604445',
    email:   'newoctaviadentalsurgery@btconnect.com',
    whatsapp: '',
    type:    'private',
    tagline: 'Quality private dental care in Hindhead, Surrey.',
    instagram: '',
    googleMapsUrl: 'https://maps.google.com/?q=New+Octavia+Dental+Surgery+Hindhead',
    metaTitle: 'New Octavia Dental Surgery | Private Dentist Hindhead',
    metaDesc:  'Private dental care in Hindhead, Surrey. General dentistry, implants, cosmetic treatments and orthodontics.',
    hours: [
      { day: 'Monday',    hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Tuesday',   hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Wednesday', hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Thursday',  hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Friday',    hours: '9:00 am – 5:00 pm', closed: false },
      { day: 'Saturday',  hours: '',                   closed: true  },
      { day: 'Sunday',    hours: '',                   closed: true  },
    ],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
  for (const p of practices) {
    await Practice.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true })
    console.log(`  Seeded: ${p.name}`)
  }
  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
