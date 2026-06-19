import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Dr Ravi Pant — Principal Dentist
  await TeamMember.findOneAndUpdate(
    { slug: 'dr-ravi-pant' },
    {
      name:     'Dr Ravi Pant',
      slug:     'dr-ravi-pant',
      role:     'Principal Dentist',
      eyebrow:  'Principal Dentist',
      category: 'dentist',
      initials: 'RP',
      gdcNumber: '116967',
      image:    '/uploads/team/dr-ravi-pant.jpg',

      specialisms: [
        'Comprehensive Dentistry',
        'Six Month Smiles',
        'Orthodontics',
        'Oral & Maxillofacial Surgery',
        'Restorative Dentistry',
      ],

      bio: 'Rav graduated in 2000 with gold medal and various awards in Oral pathology, Prosthetic dentistry, Orthodontics etc. After working in various hospitals as senior house officer in Oral & Maxillofacial surgery and in various general dental practices, he joined the practice as a principal dentist in May 2012.',

      bioExtended: [
        'He enjoys all forms of dentistry and is a registered six month smiles provider, incorporating comprehensive and short term orthodontic treatments into his daily practice.',
        'To further his knowledge and expertise he completed a Certificate in Orthodontics at Warwick University — building on his MSc in Prosthetic Dentistry from Guy\'s Hospital London.',
        'Outside of dentistry he loves keeping fit, reading, gardening, cycling with his son Rish and walking his dog Sheru.',
      ],

      qualifications: [
        'BDS — Manipal (Gold Medal, 2000)',
        'MSc Prosthetic Dentistry — Guy\'s Hospital, London',
        'MFDS RCS England',
        'Certificate in Orthodontics — Warwick University',
        'Registered Six Month Smiles provider',
        'GDC No. 116967',
      ],

      treatments: [
        { label: 'Six Month Smiles',    href: '/treatments/six-month-smile' },
        { label: 'Dental Implants',     href: '/treatments/dental-implants' },
        { label: 'Composite Bonding',   href: '/treatments/composite-bonding' },
        { label: 'Invisalign',          href: '/treatments/invisalign' },
        { label: 'Teeth Whitening',     href: '/treatments/teeth-whitening' },
        { label: 'Air Flow Hygiene',    href: '/treatments/air-flow-hygiene' },
      ],

      bookingService: 'general',
      ctaHeading: 'Book an appointment with Dr Ravi',
      ctaBody:    'As principal dentist, Dr Ravi Pant sees patients for a full range of treatments — from routine care to advanced restorative and orthodontic cases.',
      prescriptionNotice: false,
      hasPage:    true,

      metaTitle: 'Dr Ravi Pant — Principal Dentist | Octavia Dental Godalming',
      metaDesc:  'Dr Ravi Pant is principal dentist at Octavia Dental, Godalming. GDC No. 116967. MSc Prosthetic Dentistry, Six Month Smiles provider, orthodontics and comprehensive dental care.',

      published: true,
      order: 1,
    },
    { upsert: true, new: true }
  )
  console.log('Upserted: Dr Ravi Pant')

  // Push Dr Ali and Dr Ana down in order
  await TeamMember.findOneAndUpdate({ slug: 'dr-ali' }, { order: 2 })
  console.log('Updated order: Dr Ali → 2')
  await TeamMember.findOneAndUpdate({ slug: 'dr-ana' }, { order: 3 })
  console.log('Updated order: Dr Ana → 3')

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
