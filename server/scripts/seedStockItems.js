import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Item from '../models/Item.js'

// name | category | supplier | unit | packSize | costPerUnit | reorderLevel | reorderQty | countTier
const ITEMS = [
  ['Lidocaine 2% w/ adrenaline cartridges', 'Anaesthetics', 'Hague Dental Supplies', 'Box of 50', 50, 32.00, 4, 8, 'weekly'],
  ['Articaine 4% w/ adrenaline cartridges', 'Anaesthetics', 'Hague Dental Supplies', 'Box of 50', 50, 38.00, 4, 8, 'weekly'],
  ['Topical anaesthetic gel', 'Anaesthetics', 'Hague Dental Supplies', 'Jar', 1, 9.50, 3, 6, 'monthly'],
  ['Dental needles 30G short', 'Anaesthetics', 'Hague Dental Supplies', 'Box of 100', 100, 11.00, 3, 6, 'weekly'],
  ['Dental needles 27G long', 'Anaesthetics', 'Hague Dental Supplies', 'Box of 100', 100, 11.00, 2, 4, 'monthly'],
  ['Composite A2 syringe', 'Restorative', 'Henry Schein Dental', 'Syringe 4g', 1, 24.00, 6, 12, 'weekly'],
  ['Composite A3 syringe', 'Restorative', 'Henry Schein Dental', 'Syringe 4g', 1, 24.00, 6, 12, 'weekly'],
  ['Composite B1 syringe', 'Restorative', 'Henry Schein Dental', 'Syringe 4g', 1, 24.00, 3, 6, 'monthly'],
  ['Universal bonding adhesive', 'Restorative', 'Henry Schein Dental', 'Bottle 5ml', 1, 58.00, 2, 4, 'monthly'],
  ['Etch gel 37% phosphoric acid', 'Restorative', 'Hague Dental Supplies', 'Syringe kit', 1, 14.00, 3, 6, 'monthly'],
  ['Glass ionomer cement', 'Restorative', 'Hague Dental Supplies', 'Pack', 1, 29.00, 2, 4, 'monthly'],
  ['Matrix bands (assorted)', 'Restorative', 'Hague Dental Supplies', 'Box of 100', 100, 16.00, 2, 4, 'monthly'],
  ['Interdental wedges (assorted)', 'Restorative', 'Hague Dental Supplies', 'Box of 100', 100, 9.00, 2, 4, 'monthly'],
  ['Polishing discs (assorted)', 'Restorative', 'Henry Schein Dental', 'Box of 50', 50, 21.00, 2, 4, 'monthly'],
  ['Alginate impression material', 'Impressions', 'Hague Dental Supplies', 'Bag 500g', 1, 8.50, 4, 8, 'monthly'],
  ['Light body silicone', 'Impressions', 'Henry Schein Dental', 'Cartridge pack', 1, 34.00, 3, 6, 'monthly'],
  ['Heavy body / putty silicone', 'Impressions', 'Henry Schein Dental', 'Pack', 1, 36.00, 3, 6, 'monthly'],
  ['Impression trays (assorted)', 'Impressions', 'Hague Dental Supplies', 'Bag of 25', 25, 12.00, 2, 4, 'monthly'],
  ['Bite registration material', 'Impressions', 'Henry Schein Dental', 'Cartridge pack', 1, 28.00, 2, 4, 'monthly'],
  ['Endodontic files (assorted)', 'Endodontics', 'Henry Schein Dental', 'Pack of 6', 6, 26.00, 3, 6, 'monthly'],
  ['Gutta percha points (assorted)', 'Endodontics', 'Henry Schein Dental', 'Box of 120', 120, 14.00, 2, 4, 'monthly'],
  ['Paper points (assorted)', 'Endodontics', 'Henry Schein Dental', 'Box of 200', 200, 10.00, 2, 4, 'monthly'],
  ['Sodium hypochlorite solution', 'Endodontics', 'Hague Dental Supplies', 'Bottle 1L', 1, 7.50, 3, 6, 'monthly'],
  ['Prophy paste', 'Hygiene & Prevention', 'Hague Dental Supplies', 'Tub', 1, 8.00, 4, 8, 'weekly'],
  ['Air Flow powder (classic)', 'Hygiene & Prevention', 'Henry Schein Dental', 'Bottle 300g', 1, 19.00, 4, 8, 'weekly'],
  ['Fluoride varnish', 'Hygiene & Prevention', 'Hague Dental Supplies', 'Box of 50 doses', 50, 42.00, 2, 4, 'monthly'],
  ['Interdental brushes (patient packs)', 'Hygiene & Prevention', 'Hague Dental Supplies', 'Box of 25', 25, 15.00, 2, 4, 'monthly'],
  ['Examination gloves — Small', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 100', 100, 6.50, 10, 20, 'weekly'],
  ['Examination gloves — Medium', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 100', 100, 6.50, 12, 24, 'weekly'],
  ['Examination gloves — Large', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 100', 100, 6.50, 8, 16, 'weekly'],
  ['Face masks Type IIR', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 50', 50, 5.50, 10, 20, 'weekly'],
  ['Disposable aprons', 'Infection Control & PPE', 'Hague Dental Supplies', 'Roll of 200', 200, 9.00, 4, 8, 'weekly'],
  ['Surface disinfectant wipes', 'Infection Control & PPE', 'Hague Dental Supplies', 'Tub of 200', 200, 7.50, 8, 16, 'weekly'],
  ['Autoclave pouches — small', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 200', 200, 11.00, 4, 8, 'weekly'],
  ['Autoclave pouches — large', 'Infection Control & PPE', 'Hague Dental Supplies', 'Box of 200', 200, 15.00, 3, 6, 'monthly'],
  ['Sharps container 5L', 'Infection Control & PPE', 'Hague Dental Supplies', 'Each', 1, 4.50, 4, 8, 'monthly'],
  ['Gauze swabs', 'Surgical & Sundries', 'Hague Dental Supplies', 'Pack of 100', 100, 4.00, 6, 12, 'monthly'],
  ['Cotton wool rolls', 'Surgical & Sundries', 'Hague Dental Supplies', 'Pack of 500', 500, 7.00, 6, 12, 'weekly'],
  ['Saliva ejectors', 'Surgical & Sundries', 'Hague Dental Supplies', 'Bag of 100', 100, 4.50, 8, 16, 'weekly'],
  ['3-in-1 syringe tips', 'Surgical & Sundries', 'Hague Dental Supplies', 'Bag of 250', 250, 13.00, 4, 8, 'monthly'],
  ['Micro applicator brushes', 'Surgical & Sundries', 'Hague Dental Supplies', 'Box of 400', 400, 8.00, 3, 6, 'monthly'],
  ['Patient bibs', 'Surgical & Sundries', 'Hague Dental Supplies', 'Roll of 125', 125, 10.00, 6, 12, 'weekly'],
  ['Sutures 3-0 (resorbable)', 'Surgical & Implants', 'Henry Schein Dental', 'Box of 12', 12, 38.00, 2, 4, 'monthly'],
  ['Sterile saline pouches', 'Surgical & Implants', 'Hague Dental Supplies', 'Box of 25', 25, 17.00, 2, 4, 'monthly'],
  ['Implant healing abutment (stock)', 'Surgical & Implants', 'Henry Schein Dental', 'Each', 1, 45.00, 2, 4, 'weekly'],
  ['Whitening gel 16% carbamide peroxide', 'Whitening & Aesthetics', 'Henry Schein Dental', 'Box of 4 syringes', 4, 26.00, 4, 8, 'weekly'],
  ['Whitening tray sheets (thermoform)', 'Whitening & Aesthetics', 'Henry Schein Dental', 'Box of 25', 25, 22.00, 2, 4, 'monthly'],
  ['Botulinum toxin 100U vial', 'Facial Aesthetics', 'Other', 'Vial', 1, 110.00, 2, 4, 'weekly'],
  ['Insulin syringes 30G (for toxin)', 'Facial Aesthetics', 'Other', 'Box of 100', 100, 14.00, 2, 4, 'monthly'],
  ['Emla / numbing cream', 'Facial Aesthetics', 'Other', 'Tube', 1, 8.00, 2, 4, 'monthly'],
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (let i = 0; i < ITEMS.length; i++) {
    const [name, category, supplier, unit, packSize, costPerUnit, reorderLevel, reorderQty, countTier] = ITEMS[i]
    const sku = `OCT-${String(i + 1).padStart(3, '0')}`
    await Item.findOneAndUpdate(
      { name },
      { sku, name, category, supplier, unit, packSize, costPerUnit, reorderLevel, reorderQty, countTier, active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log(`  Seeded: ${sku} ${name}`)
  }

  console.log(`Done — ${ITEMS.length} items seeded`)
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
