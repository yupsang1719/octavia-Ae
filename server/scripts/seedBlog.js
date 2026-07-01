import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import BlogPost from '../models/BlogPost.js'

const posts = [
  {
    slug: 'composite-bonding-vs-veneers',
    title: 'Composite Bonding vs Porcelain Veneers: Which Is Right for You?',
    excerpt: 'Both can transform your smile — but they work very differently. Our cosmetic dentist Dr Ana explains the key differences in cost, longevity, and suitability.',
    category: 'dental',
    author: 'Dr Ana',
    publishedAt: new Date('2026-05-20'),
    featuredImg: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Composite Bonding vs Porcelain Veneers | Octavia Dental Godalming',
    seoDesc: 'Dr Ana explains the key differences between composite bonding and porcelain veneers — cost, longevity, pain, and which is best for you.',
    published: true,
    body: `## Two treatments. One goal: a smile you love.

Composite bonding and porcelain veneers are both popular cosmetic dental treatments that can dramatically improve the appearance of your smile. Both correct similar issues — chips, gaps, discolouration, and uneven shapes. But they work quite differently, last for different lengths of time, and cost very different amounts.

Here's what you need to know before deciding.

## What is composite bonding?

Composite bonding involves applying a tooth-coloured resin material directly to your tooth, sculpted and polished in a single appointment by Dr Ana. It requires no drilling in most cases, no anaesthetic, and the entire procedure is typically completed in one to three hours.

**Cost:** From £250 per tooth at Octavia Dental.

**Longevity:** 5–7 years with good care. Avoiding very hard foods and wearing a night guard if you grind your teeth will extend its lifespan significantly.

**The process:** One appointment. Dr Ana etches the tooth surface gently, applies the resin in layers, sculpts it to the desired shape, and polishes it to a lifelike finish. You walk out with a new smile the same day.

**Best for:** Patients wanting a conservative, reversible treatment with immediate results at a lower cost. Ideal for minor chips, small gaps, or mild discolouration across a few teeth.

## What are porcelain veneers?

Porcelain veneers are thin ceramic shells, custom-made in a dental laboratory, that bond permanently to the front of your teeth. They offer greater durability, a more stain-resistant surface, and can be designed to greater precision than composite.

**Cost:** From £800 per tooth at Octavia Dental.

**Longevity:** 10–15 years or more. Because porcelain is glass-based, it doesn't absorb staining the same way composite resin can.

**The process:** Two appointments. At the first, Dr Ana prepares the teeth by removing a thin layer of enamel (making veneers irreversible) and takes precise impressions. Temporaries are fitted while your veneers are crafted in the lab. At the second appointment, the final veneers are bonded to your teeth.

**Best for:** Patients seeking the most durable, natural-looking, and stain-resistant result. Ideal for more significant reshaping, multiple teeth, or patients who want a long-term solution and don't mind a more involved process.

## The key differences at a glance

| | Composite Bonding | Porcelain Veneers |
|---|---|---|
| Cost | From £250/tooth | From £800/tooth |
| Appointments | 1 | 2 |
| Reversible? | Yes | No |
| Longevity | 5–7 years | 10–15 years |
| Stain resistance | Moderate | High |
| Same-day results | Yes | No |

## Which should you choose?

If you want to correct a small chip or close a minor gap quickly and affordably, composite bonding is the obvious choice. It's gentle on your teeth, reversible, and the results can be stunning in the right hands.

If you're looking for a longer-lasting, more transformative result — particularly for a full smile makeover across multiple teeth — porcelain veneers offer superior longevity and aesthetics.

Many patients find that composite bonding is the right starting point, particularly if they're unsure whether they want to commit to the permanence of veneers.

Dr Ana offers free consultations for both treatments at our Godalming clinic. She'll assess your teeth, discuss your goals honestly, and recommend the option that genuinely suits you best — not the most expensive one.

*Prices quoted at consultation may vary based on individual assessment.*`,
  },
  {
    slug: 'dental-implants-godalming-guide',
    title: 'The Complete Guide to Dental Implants in Godalming',
    excerpt: 'Thinking about dental implants? Dr Ali walks through candidacy, the procedure, costs, and what to expect at every stage of treatment.',
    category: 'dental',
    author: 'Dr Ali',
    publishedAt: new Date('2026-05-08'),
    featuredImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Dental Implants Godalming — Complete Guide | Octavia Dental',
    seoDesc: 'Dr Ali explains everything about dental implants: who they suit, what the procedure involves, how long they last, and why patients travel from across Surrey.',
    published: true,
    body: `## Everything you need to know about dental implants

A dental implant is one of the most significant investments you can make in your long-term dental health. Done well, it's a tooth that functions like a natural one — permanent, stable, and indistinguishable from the real thing. Done poorly, or in the wrong hands, it can become a source of long-term problems.

At Octavia Dental, all implant treatment is led by Dr Ali, our implant specialist with extensive postgraduate training in implantology. Here's everything you need to know.

## What exactly is a dental implant?

A dental implant is a small titanium post that is placed surgically into the jawbone to act as an artificial tooth root. Once the bone has fused around it — a process called osseointegration — a custom-made crown is attached on top.

The result looks, feels and functions like a natural tooth. You brush it normally. You eat normally. And unlike dentures, you never take it out.

## Who is a good candidate?

Most adults in good general health are suitable candidates for dental implants. The key requirements are:

- Sufficient bone volume and density to support the implant
- Healthy gums (active gum disease must be treated first)
- Good general health (some systemic conditions require careful assessment)
- Non-smoking or willingness to stop (smoking significantly increases failure risk)

Even if you've been told elsewhere that you have insufficient bone, there are often options. Bone grafting can restore volume in many cases. Dr Ali will assess your X-rays and a CBCT cone beam scan at your free consultation and give you an honest answer about your options.

## The procedure, step by step

**Consultation (free):** Dr Ali examines your mouth, reviews your scan, and explains your treatment plan in full. You'll receive a detailed quote.

**Implant placement:** Under local anaesthetic, a small incision is made in the gum and the titanium post is placed precisely into the jawbone. Most patients report far less discomfort than expected. The procedure is straightforward in experienced hands.

**Healing period:** Over 8–12 weeks, the implant integrates with the bone. You'll wear a temporary restoration during this time so you're never without a tooth.

**Crown fitting:** Once integration is confirmed, a custom porcelain crown is attached to the implant — matched precisely to the colour and shape of your surrounding teeth.

**Review and maintenance:** A follow-up at 6–8 weeks, then annual hygiene visits and check-ups like any natural tooth.

## How long do dental implants last?

With proper care and maintenance, dental implants can last a lifetime. The crown on top may need replacing after 15–20 years, but the implant itself — once fully integrated — can last decades.

The main factors that affect longevity: oral hygiene, smoking, and whether you grind your teeth. Dr Ali will discuss all of this at your consultation.

## Cost and payment options

A single dental implant at Octavia Dental starts from £2,500. This includes all stages of treatment — consultation, placement, healing support, and the final crown.

Flexible payment plans are available for patients who want to spread the cost. Speak to us at your free consultation.

## Why Godalming patients choose Dr Ali

Patients travel to us from Guildford, Farnham, Haslemere, Hampshire and beyond. The reason is consistent: they want a specialist implant dentist — not a general dentist who occasionally places implants.

Dr Ali's postgraduate training and extensive clinical experience with complex cases means patients get predictable, long-lasting results. If you've been quoted elsewhere, a second opinion from Dr Ali costs nothing and could save you from a wrong decision.

*Book a free consultation at our Godalming clinic — 01483 958205.*`,
  },
  {
    slug: 'why-dentist-botox-safer',
    title: 'Why Having Botox at a Dental Practice Is Safer Than a Beauty Salon',
    excerpt: 'Dentists have the deepest understanding of facial anatomy. Dr Ana explains why the expertise matters and what to look for when choosing a provider.',
    category: 'aesthetics',
    author: 'Dr Ana',
    publishedAt: new Date('2026-04-22'),
    featuredImg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Botox at a Dental Practice vs Beauty Salon | Dr Ana, Godalming',
    seoDesc: 'Dr Ana explains why dentist-led Botox is safer than beauty salon treatments, and what to look for when choosing a facial aesthetics provider.',
    published: true,
    body: `## The question I'm asked most often: "Why see a dentist for Botox?"

It's a fair question. Botox clinics are everywhere — beauty salons, pop-up clinics, even shopping centres. So why drive to a dental practice for anti-wrinkle injections?

The answer comes down to one thing: **anatomy**.

## What dentists know that most aesthetics practitioners don't

Dentistry requires one of the most rigorous anatomy educations of any healthcare profession. Dentists spend years learning the precise location of every muscle, nerve, blood vessel and bone in the head and neck — because getting it wrong has immediate, serious consequences.

When I qualified as a dentist, I could tell you the exact depth and trajectory of the inferior alveolar nerve, the location of the facial artery, the attachments of the orbicularis oris. Most beauticians who deliver Botox have completed a weekend course.

I don't say that to be unkind. I say it because it matters enormously when you're injecting close to the orbicularis oculi (the muscle around the eye), the frontalis (the forehead), or the zygomaticus (around the cheek). A poorly placed injection can cause drooping, asymmetry, difficulty blinking, or worse.

## The regulatory picture

In the UK, Botox (botulinum toxin) is a prescription-only medicine. This means it can only be prescribed by a qualified prescriber — a doctor, dentist, nurse prescriber or pharmacist prescriber — following a face-to-face assessment.

Dentists are trained prescribers. We assess patients clinically before every treatment. We document the assessment. We know the contraindications. We carry appropriate indemnity insurance for medical procedures.

Many beauty therapists who advertise Botox are operating in a grey area — using prescriptions obtained by telephone or online without a proper face-to-face assessment, or working under prescribers who have never seen the patient.

This is changing — the UK government has introduced stricter regulations — but the reality today is that not all practitioners are equal.

## What I look for when treating patients

Every patient I see for anti-wrinkle treatment undergoes a full facial assessment before I pick up a needle. I look at:

- Facial symmetry and muscle movement
- Skin quality and existing wrinkle patterns
- Medical history (certain medications and conditions are contraindications)
- What the patient actually wants to achieve — because "less is more" is almost always right

I aim for results that refresh the face without freezing it. Natural, not overdone. A good aesthetics treatment shouldn't be obvious.

## What to look for when choosing a provider

If you're considering anti-wrinkle treatment anywhere, ask these questions:

1. Are you a registered healthcare professional? (Doctor, dentist, nurse prescriber?)
2. Will you carry out a face-to-face consultation before prescribing?
3. Do you hold appropriate clinical indemnity insurance?
4. What is your follow-up procedure if I experience a complication?

If the answers are vague or evasive, look elsewhere.

At Octavia Dental, I offer free facial aesthetics consultations at our Godalming clinic. Anti-wrinkle treatments are prescription-only medicines and I carry out a full clinical assessment for every patient.

*Anti-wrinkle treatments at Octavia Dental start from £200 per area. Book a free consultation — 01483 958205.*`,
  },
  {
    slug: 'invisalign-adults-godalming',
    title: 'Invisalign for Adults in Godalming — Everything You Need to Know',
    excerpt: 'Is Invisalign suitable for adults? What does it actually feel like? How long does it take? Dr Ana answers the questions she hears most.',
    category: 'dental',
    author: 'Dr Ana',
    publishedAt: new Date('2026-04-10'),
    featuredImg: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Invisalign for Adults in Godalming | Dr Ana | Octavia Dental',
    seoDesc: 'Dr Ana answers the most common Invisalign questions from adults considering clear aligner treatment at our Godalming dental practice.',
    published: true,
    body: `## Thinking about Invisalign as an adult? You're not alone.

The majority of Invisalign patients I treat at Octavia Dental are adults — many of them in their 30s, 40s, even 50s. Some had braces as teenagers and their teeth have shifted. Some never had treatment and have always been self-conscious about their smile. Some are preparing for a wedding, a milestone birthday, or simply deciding that now is the right time.

Whatever the reason, adult Invisalign is one of the most rewarding treatments I offer. Here are the answers to the questions I'm asked most often.

## Can adults use Invisalign?

Yes — and it's actually particularly well-suited to adults. Unlike fixed metal braces, Invisalign aligners are virtually invisible, removable, and don't require any changes to what you eat. For adults in professional environments, this matters.

There's no upper age limit. As long as your teeth and gums are healthy, you're likely a good candidate.

## How long does it take?

It depends on how much movement is needed. Mild corrections can be completed in as little as 3 months. Most adult cases take 9–18 months. Complex cases can take up to 24 months, though this is less common.

At your free consultation, I'll take a digital scan of your teeth and we can look at a simulation of your likely result and timeline.

## Does it hurt?

Invisalign is much more comfortable than traditional braces. You'll feel some pressure when you first wear a new aligner — your teeth are moving, so this is expected — but it's usually mild and settles within a day or two.

There are no brackets to catch on the inside of your cheeks, no wires to irritate your gums. Most patients adjust within a week.

## How much does it cost?

Invisalign pricing varies depending on complexity. At Octavia Dental, we price following your free consultation and digital scan, when we can give you an accurate assessment of your case.

Comprehensive cases typically range from £2,800 to £5,000. Payment plans are available. We don't add hidden charges — the quote you receive covers the entire course of treatment including all aligners, retainers, and check-up appointments.

## Will people notice I'm wearing aligners?

Almost certainly not. The aligners are made from clear SmartTrack material and fit snugly against your teeth. In normal conversation, at work, on a video call — they are genuinely invisible unless someone is looking very closely in bright light.

I've had patients complete full Invisalign treatment without their partners noticing.

## What happens at the end?

When your teeth have reached their final position, I'll take a final scan to confirm the result. You'll then be fitted with retainers — which you'll need to wear at night long-term to keep your teeth in their new position. This is non-negotiable: teeth naturally want to drift back, and retainers are what prevent it.

Most patients are delighted with their results. The discipline of wearing the aligners for 22 hours a day is the main challenge — but the outcome makes it worth it.

---

*Free Invisalign consultations at our Godalming clinic, serving patients from Guildford, Farnham, Haslemere and Hampshire. Book online or call 01483 958205.*`,
  },
  {
    slug: 'nhs-dental-crisis-surrey',
    title: 'The NHS Dental Crisis in Surrey — and What You Can Do About It',
    excerpt: '82% of new Surrey patients cannot register with an NHS dentist. We explain what this means for your dental health and what your options are.',
    category: 'local',
    author: 'Dr Ali',
    publishedAt: new Date('2026-03-28'),
    featuredImg: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'NHS Dental Crisis Surrey — Your Options | Octavia Dental Godalming',
    seoDesc: 'The NHS dental crisis in Surrey is leaving thousands without care. We explain why it happened and what private dental alternatives are available.',
    published: true,
    body: `## The NHS dental crisis in Surrey is real — and it's getting worse

If you've tried to register with an NHS dentist in Surrey recently, you already know this. Practices that are taking new patients are rare. Waiting lists — where they exist — can stretch to 18 months or more. And for many treatments, NHS dentistry simply isn't available at all.

According to NHS data, **82% of patients trying to register with an NHS dentist in Surrey are unable to do so**. This isn't a temporary blip. It's a structural failure that has been building for years.

## Why has this happened?

Several factors have combined to create the current situation.

**Underfunded NHS contracts.** Many dental practices have found NHS work financially unviable. The NHS contract system pays dentists a fixed fee per "unit of dental activity" (UDA) — a system so disconnected from the actual cost of care that practices regularly lose money treating NHS patients. Many have handed back their NHS contracts entirely.

**Post-pandemic backlash.** The suspension of routine dental care during COVID-19 created a vast backlog that NHS dentistry has never recovered from.

**Geographic inequality.** Rural and commuter areas like Surrey and Hampshire have been disproportionately affected. NHS dental resources have concentrated in major cities.

**Population growth.** Surrey's population has grown significantly, without a corresponding increase in NHS dental capacity.

## What does this mean for your health?

Untreated dental problems don't stay stable. They progress. A small cavity becomes a large one. A large cavity becomes an infection. An infection becomes an extraction. Problems that would have cost a few hundred pounds to treat early become complex, expensive, and sometimes painful emergencies.

The public health implications are serious. Poor dental health is linked to cardiovascular disease, diabetes complications, and — particularly in older patients — aspiration pneumonia. Looking after your teeth isn't vanity; it's health.

## What are your options?

**Option 1: Keep trying for NHS.** You can check NHS.uk for practices taking new patients in your area. Realistically, in Surrey and Hampshire, this is a difficult route — but it's free if you're eligible.

**Option 2: Private dental care.** Private dental care gives you immediate access, no waiting list, and a wider range of treatment options. The cost is higher than NHS Band charges, but for many people the peace of mind and quality of care is worth it — particularly for preventive care that stops problems from escalating.

**Option 3: Hybrid approach.** Some practices offer private membership plans — a monthly direct debit that covers check-ups, hygiene appointments, and X-rays, with discounts on treatment. This can make private care more affordable and predictable.

## Where does Octavia Dental fit in?

We're a private practice based in Godalming — and we accept new patients from across Surrey and Hampshire immediately. There is no waiting list and no referral required.

We know that private care is not the right choice for everyone, and we'd never pretend otherwise. But if you're struggling to access dental care and want to understand your options honestly, we offer free initial consultations.

The most expensive dental decision you can make is to do nothing. If your teeth need attention, getting it sorted sooner — whatever the route — is almost always better than waiting.

*01483 958205 · Seymour House, Lower South Street, Godalming, GU7 1BZ*`,
  },
  {
    slug: 'teeth-whitening-what-to-expect',
    title: 'Professional Teeth Whitening: What to Expect at Octavia Dental',
    excerpt: 'From your first consultation to your final shade check — a step-by-step guide to professional teeth whitening at our Godalming practice.',
    category: 'dental',
    author: 'Dr Ana',
    publishedAt: new Date('2026-03-15'),
    featuredImg: 'https://images.unsplash.com/photo-1559599076-9b6f425d1b07?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Professional Teeth Whitening Godalming — What to Expect | Octavia Dental',
    seoDesc: 'A step-by-step guide to professional teeth whitening at Octavia Dental in Godalming. What happens at each stage, and what results to expect.',
    published: true,
    body: `## What actually happens when you get your teeth professionally whitened?

Teeth whitening is one of the most popular treatments at Octavia Dental — and one of the most misunderstood. Patients often arrive expecting something like what they've seen advertised in shops, and leave surprised at how different — and how much more effective — the professional version is.

Here's exactly what to expect.

## Before you start: the consultation

Before any whitening treatment, Dr Ana will examine your teeth and gums. This matters. Whitening gel can aggravate untreated decay or gum inflammation, and it doesn't work on crowns, veneers, or composite bonding. If you have existing restorations on visible teeth, we need to discuss whether they'll need replacing afterwards to match your new shade.

We'll also record your starting shade using a clinical shade guide. This gives you an objective measure of your results — rather than relying on the imprecise memory of what your teeth looked like before.

## Custom tray impressions

This is what separates professional whitening from anything available in shops or online.

Dr Ana takes precise impressions of your upper and lower teeth, which are used to manufacture custom-fitted whitening trays. These fit your teeth exactly — meaning the whitening gel stays in contact with your tooth surfaces rather than leaching around your gums, which is both more effective and less irritating.

Generic trays (the boil-and-bite type, or the ones in postal kits) don't fit precisely. The gel migrates. The results are uneven and the sensitivity worse. Custom trays are a significant part of why professional whitening works so well.

## The whitening process (home whitening)

Most of our patients use our home whitening system — which, counterintuitively, often delivers better results than in-chair systems because your teeth are exposed to the gel for longer.

You wear your custom trays for 30–60 minutes per day (or overnight, if you prefer) over 2 weeks. The trays are comfortable and many patients forget they're wearing them.

You'll notice results within 3–5 days. By day 14, most patients have achieved their full result.

## In-chair whitening

For patients who want faster results — for a wedding, a holiday, or simply because they prefer not to do home treatment — we also offer in-chair whitening. A professional-strength gel is applied to your teeth and activated, with the full session taking approximately 90 minutes.

In-chair whitening typically achieves a noticeable result in a single visit, though we often recommend a short home whitening course afterwards to maximise and stabilise the result.

## What to expect: sensitivity

Some temporary sensitivity is common during whitening treatment — particularly to cold drinks and air. This is normal and usually resolves within 24–48 hours of finishing treatment.

Dr Ana uses whitening formulas with added potassium nitrate to minimise sensitivity. If you have particularly sensitive teeth, we'll discuss the right protocol for you.

## How long do results last?

Professional whitening results typically last 12–18 months, depending on your diet (tea, coffee, red wine, and smoking all cause staining), your oral hygiene, and your natural enamel characteristics.

We provide top-up gel that you can use with your custom trays when you notice your shade starting to fade — usually just 2–3 nights of treatment to restore your result.

## Results: what's realistic?

Most patients achieve 4–8 shades of whitening. The exact outcome depends on your starting shade and the type of staining. Yellowish staining responds best; greyish or brown staining (often associated with tetracycline antibiotic use in childhood) is more difficult.

Dr Ana will give you a realistic expectation at your consultation — not an overblown promise.

---

*Teeth whitening at Octavia Dental from £299. Free consultations available — 01483 958205.*

*Prices quoted at consultation may vary based on individual assessment.*`,
  },
]

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  let created = 0
  let skipped = 0

  for (const post of posts) {
    const exists = await BlogPost.findOne({ slug: post.slug })
    if (exists) {
      console.log(`  skip  ${post.slug}`)
      skipped++
    } else {
      await BlogPost.create(post)
      console.log(`  ✓     ${post.slug}`)
      created++
    }
  }

  console.log(`\nDone — ${created} created, ${skipped} already existed`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
