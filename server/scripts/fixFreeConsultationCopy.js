import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Treatment from '../models/Treatment.js'
import BlogPost from '../models/BlogPost.js'

const APPLY = process.argv.includes('--apply')

// A replacement string in a [pattern, string] rule is used verbatim — only
// use that form when `pattern` is case-sensitive (no /i flag), so the match
// text's case is already known. Case-insensitive rules use a function
// instead, so "At your FREE consultation" and "at your free consultation"
// don't both collapse to the same lowercase output.
function preserveCase(matched, replacement) {
  if (matched[0] === matched[0].toUpperCase() && matched[0] !== matched[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

// Ordered: exact phrasings found by manually reading every "free"/
// "complimentary"/"no cost" mention in the live content first, then a
// mechanical fallback last for anything not already caught above.
const RULES = [
  // exact phrasings found in the live DB content (server/scripts/fixFreeConsultationCopy.js audit)
  [/Consultation \(free\):/g, 'Consultation:'],
  [/free facial aesthetics consultations/g, 'facial aesthetics consultations'],
  [/Free Invisalign consultations/g, 'Invisalign consultations'],
  [/Free consultations available/g, 'Book an appointment'],
  [/Free consultation available\./g, 'Book an appointment.'],
  [/Free consultations\./g, 'Book an appointment.'],
  [/Free consultation\./g, 'Book an appointment.'],
  [/Book free consultation\./g, 'Book an appointment.'],
  [/,\s*free consultations? and\s+/gi, ' and '],                 // "transparent pricing, free consultations and X" -> "transparent pricing and X"
  [/,\s*complimentary initial consultation/gi, ', a thorough initial consultation'],
  [/a complimentary initial consultation/gi, 'a thorough initial consultation'],
  [/is complimentary — no commitment required/gi, 'is thorough and unhurried — no commitment required'],
  [/\.\s*You receive a personalised treatment plan and transparent quote at no cost\./gi, '. You receive a personalised treatment plan and transparent quote.'],

  // mechanical fallback, case-insensitive with case-preserving replacement
  [/a free initial consultation/gi, (m) => preserveCase(m, 'an initial consultation')],
  [/free initial consultation/gi, (m) => preserveCase(m, 'initial consultation')],
  [/a free implant consultation/gi, (m) => preserveCase(m, 'an implant consultation')],
  [/free implant consultation/gi, (m) => preserveCase(m, 'implant consultation')],
  [/at your free consultation/gi, (m) => preserveCase(m, 'at your consultation')],
  [/at free consultation/gi, (m) => preserveCase(m, 'at consultation')],
  [/free consultation/gi, (m) => preserveCase(m, 'consultation')],
]

function fix(text) {
  if (typeof text !== 'string' || !text) return text
  let out = text
  for (const [pattern, replacement] of RULES) out = out.replace(pattern, replacement)
  return out
}

// Short label fields (priceFrom, process step titles) are whole-value
// matches, not sentences — they need their own replacement text rather than
// the generic fix() above, mirroring what was done in client/src/data/*.js.
function fixPriceFrom(text) {
  if (text === 'Free consultation') return 'Price on consultation'
  return fix(text)
}
function fixStepTitle(text) {
  if (text === 'Free consultation') return 'Consultation'
  return fix(text)
}

function fixArray(arr) {
  if (!Array.isArray(arr)) return arr
  return arr.map(v => typeof v === 'string' ? fix(v) : v)
}

// For long text (blog bodies), print just the sentence around each spot that
// changed, found by re-scanning the ORIGINAL text for anything the RULES
// would touch, rather than diffing old/new char-by-char.
const TOUCH_PATTERN = /free|complimentary|no cost/gi
function changedContexts(oldText) {
  const out = []
  let m
  TOUCH_PATTERN.lastIndex = 0
  while ((m = TOUCH_PATTERN.exec(oldText))) {
    const start = Math.max(0, m.index - 50)
    out.push(oldText.slice(start, m.index + 60).replace(/\n/g, ' '))
  }
  return out
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log(`Connected. Mode: ${APPLY ? 'APPLY (writing changes)' : 'DRY RUN (no writes)'}\n`)

  let changedDocs = 0

  const treatments = await Treatment.find()
  for (const t of treatments) {
    const before = t.toObject()
    const changes = []

    const newPriceFrom = fixPriceFrom(t.priceFrom)
    if (newPriceFrom !== t.priceFrom) { changes.push(['priceFrom', t.priceFrom, newPriceFrom]); t.priceFrom = newPriceFrom }

    const newPriceNote = fix(t.priceNote)
    if (newPriceNote !== t.priceNote) { changes.push(['priceNote', t.priceNote, newPriceNote]); t.priceNote = newPriceNote }

    const newMetaDesc = fix(t.metaDesc)
    if (newMetaDesc !== t.metaDesc) { changes.push(['metaDesc', t.metaDesc, newMetaDesc]); t.metaDesc = newMetaDesc }

    const newWhatIsIt = fixArray(t.whatIsIt)
    if (JSON.stringify(newWhatIsIt) !== JSON.stringify(before.whatIsIt)) { changes.push(['whatIsIt', before.whatIsIt, newWhatIsIt]); t.whatIsIt = newWhatIsIt }

    const newBenefits = fixArray(t.benefits)
    if (JSON.stringify(newBenefits) !== JSON.stringify(before.benefits)) { changes.push(['benefits', before.benefits, newBenefits]); t.benefits = newBenefits }

    if (Array.isArray(t.process)) {
      t.process.forEach((step, i) => {
        const newTitle = fixStepTitle(step.title)
        const newBody = fix(step.body)
        if (newTitle !== step.title) { changes.push([`process[${i}].title`, step.title, newTitle]); step.title = newTitle }
        if (newBody !== step.body) { changes.push([`process[${i}].body`, step.body, newBody]); step.body = newBody }
      })
    }

    if (Array.isArray(t.faq)) {
      t.faq.forEach((entry, i) => {
        const newA = fix(entry.a)
        if (newA !== entry.a) { changes.push([`faq[${i}].a`, entry.a, newA]); entry.a = newA }
      })
    }

    if (changes.length) {
      changedDocs++
      console.log(`\n=== Treatment ${t.practice}/${t.slug} ===`)
      for (const [field, oldV, newV] of changes) {
        console.log(`  [${field}]`)
        console.log(`  - ${JSON.stringify(oldV)}`)
        console.log(`  + ${JSON.stringify(newV)}`)
      }
      if (APPLY) await t.save()
    }
  }

  const posts = await BlogPost.find()
  for (const p of posts) {
    const changes = []

    const newExcerpt = fix(p.excerpt)
    if (newExcerpt !== p.excerpt) { changes.push(['excerpt', p.excerpt, newExcerpt]); p.excerpt = newExcerpt }

    const newBody = fix(p.body)
    if (newBody !== p.body) {
      const contexts = changedContexts(p.body).map(c => `...${c}...`).join('\n  ')
      changes.push(['body (context around each flagged word)', '', contexts])
      p.body = newBody
    }

    const newSeoDesc = fix(p.seoDesc)
    if (newSeoDesc !== p.seoDesc) { changes.push(['seoDesc', p.seoDesc, newSeoDesc]); p.seoDesc = newSeoDesc }

    if (changes.length) {
      changedDocs++
      console.log(`\n=== BlogPost ${p.slug} ===`)
      for (const [field, oldV, newV] of changes) {
        console.log(`  [${field}]`)
        if (oldV) console.log(`  - ${JSON.stringify(oldV)}`)
        console.log(`  + ${newV}`)
      }
      if (APPLY) await p.save()
    }
  }

  console.log(`\n${changedDocs} document(s) ${APPLY ? 'updated' : 'would be updated'}.`)
  if (!APPLY) console.log('Dry run only — re-run with --apply to write these changes.')

  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
