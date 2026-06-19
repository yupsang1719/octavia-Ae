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
    { slug: 'dr-rachayita-pant' },
    {
      name:     'Dr Rachayita Pant',
      slug:     'dr-rachayita-pant',
      role:     'Principal Dentist',
      eyebrow:  'Principal Dentist',
      category: 'dentist',
      initials: 'RP',
      gdcNumber: '157860',
      image:    '/uploads/team/dr-rachayita-pant.jpg',

      specialisms: [
        'Cosmetic Dentistry',
        'Periodontics',
        'General Dentistry',
        'Oral & Maxillofacial Surgery',
      ],

      bio: 'Rach graduated in 2002 and worked in Russells Hall Hospital as senior house officer in oral & maxillofacial surgery, in various general dental practices before joining us as a principal dentist in May 2012.',

      bioExtended: [
        'She enjoys all fields of dentistry but has developed a special interest in cosmetic dentistry and periodontics, bringing a keen eye for aesthetics and long-term gum health to every patient she sees.',
        'She has undertaken various postdoctoral training courses in the UK and abroad to further enhance her skills in cosmetic dentistry — ensuring her patients benefit from the latest techniques and materials.',
        'Outside of dentistry, her hobbies include travelling, reading, swimming and painting.',
      ],

      qualifications: [
        'BDS — Manipal (2002)',
        'MFDS RCS Edinburgh',
        'Postdoctoral training in cosmetic dentistry (UK & international)',
        'GDC No. 157860',
      ],

      treatments: [
        { label: 'Composite Bonding',   href: '/treatments/composite-bonding' },
        { label: 'Teeth Whitening',     href: '/treatments/teeth-whitening' },
        { label: 'Porcelain Veneers',   href: '/treatments/veneers' },
        { label: 'Invisalign',          href: '/treatments/invisalign' },
        { label: 'Air Flow Hygiene',    href: '/treatments/air-flow-hygiene' },
        { label: 'Six Month Smiles',    href: '/treatments/six-month-smile' },
      ],

      bookingService: 'general',
      ctaHeading: 'Book an appointment with Dr Rachayita',
      ctaBody:    'Whether you\'re looking to refresh your smile or maintain your dental health, Dr Rachayita Pant offers a warm, thorough approach to all aspects of dentistry.',
      prescriptionNotice: false,
      hasPage:    true,

      metaTitle: 'Dr Rachayita Pant — Principal Dentist | Octavia Dental Godalming',
      metaDesc:  'Dr Rachayita Pant is a principal dentist at Octavia Dental, Godalming. GDC No. 157860. Special interest in cosmetic dentistry and periodontics. MFDS RCS Edinburgh.',

      published: true,
      order: 2,
    },
    { upsert: true, new: true }
  )
  console.log('Upserted: Dr Rachayita Pant')

  // Push existing dentists down
  await TeamMember.findOneAndUpdate({ slug: 'dr-ali' }, { order: 3 })
  console.log('Updated order: Dr Ali → 3')
  await TeamMember.findOneAndUpdate({ slug: 'dr-ana' }, { order: 4 })
  console.log('Updated order: Dr Ana → 4')

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
