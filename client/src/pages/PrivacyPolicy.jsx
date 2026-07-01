import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../utils/seo'

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Octavia Dental & Facial Aesthetics</title>
        <meta name="description" content="Privacy Policy for Octavia Dental & Facial Aesthetics. How we collect, use and protect your personal data in accordance with UK GDPR." />
        <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
      </Helmet>

      <div className="pt-16 bg-brand-cream min-h-screen">
        <div className="container-wide max-w-3xl py-16 lg:py-24">
          <h1 className="font-serif text-4xl text-brand-dark font-medium mb-2">Privacy Policy</h1>
          <p className="font-sans text-sm text-brand-subtle mb-10">Last updated: June 2026</p>

          <div className="prose prose-headings:font-serif prose-headings:text-brand-dark prose-headings:font-medium prose-p:font-sans prose-p:text-brand-muted prose-p:leading-relaxed prose-li:font-sans prose-li:text-brand-muted max-w-none space-y-8">

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">1. Who we are</h2>
              <p className="font-sans text-brand-muted leading-relaxed">Octavia Dental & Facial Aesthetics ("we", "us", "our") is a private dental and facial aesthetics practice located at Seymour House, Lower South Street, Godalming, Surrey, GU7 1BZ. We are registered with the Care Quality Commission (CQC) and all our clinicians are registered with the General Dental Council (GDC).</p>
              <p className="font-sans text-brand-muted leading-relaxed mt-3">For data protection purposes, we are the Data Controller for personal information collected through this website and during your treatment with us. Contact us at <a href="mailto:info@octavia-dental.co.uk" className="text-brand-green hover:underline">info@octavia-dental.co.uk</a> or <a href="tel:01483958205" className="text-brand-green hover:underline">01483 958205</a>.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">2. What data we collect</h2>
              <p className="font-sans text-brand-muted leading-relaxed">We may collect the following categories of personal data:</p>
              <ul className="mt-3 space-y-1 list-disc pl-6 font-sans text-brand-muted">
                <li>Name, email address, phone number (provided through enquiry and booking forms)</li>
                <li>Enquiry details and treatment preferences</li>
                <li>Medical and dental history (if you become a patient)</li>
                <li>GDPR consent records</li>
                <li>Website usage data (anonymised, via analytics cookies with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">3. How we use your data</h2>
              <p className="font-sans text-brand-muted leading-relaxed">We use your personal data to:</p>
              <ul className="mt-3 space-y-1 list-disc pl-6 font-sans text-brand-muted">
                <li>Respond to your enquiries and arrange appointments</li>
                <li>Provide dental and aesthetic treatment and maintain clinical records</li>
                <li>Send appointment reminders and follow-up communications</li>
                <li>Comply with our legal and regulatory obligations as a dental practice</li>
                <li>Improve our website and services (analytics, with consent only)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">4. Legal basis</h2>
              <p className="font-sans text-brand-muted leading-relaxed">We process your personal data on the following lawful bases under UK GDPR:</p>
              <ul className="mt-3 space-y-1 list-disc pl-6 font-sans text-brand-muted">
                <li><strong>Consent</strong> — for enquiry forms, marketing communications, and analytics cookies</li>
                <li><strong>Contract</strong> — to deliver treatment services you have agreed to</li>
                <li><strong>Legal obligation</strong> — to comply with GDC, CQC and health record retention requirements</li>
                <li><strong>Legitimate interests</strong> — to manage our business and respond to enquiries</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">5. Data sharing</h2>
              <p className="font-sans text-brand-muted leading-relaxed">We do not sell your personal data. We may share it with:</p>
              <ul className="mt-3 space-y-1 list-disc pl-6 font-sans text-brand-muted">
                <li>Clinical staff involved in your care</li>
                <li>Dental laboratories (where necessary for your treatment)</li>
                <li>Our software and email service providers (under data processing agreements)</li>
                <li>Regulatory bodies where required by law (GDC, CQC, NHS)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">6. Retention</h2>
              <p className="font-sans text-brand-muted leading-relaxed">Clinical records are retained for a minimum of 10 years from your last treatment date in accordance with GDC requirements. Enquiry data from non-patients is held for up to 12 months and then deleted. You may request earlier deletion of non-clinical data (see Section 7).</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">7. Your rights</h2>
              <p className="font-sans text-brand-muted leading-relaxed">Under UK GDPR, you have the right to:</p>
              <ul className="mt-3 space-y-1 list-disc pl-6 font-sans text-brand-muted">
                <li>Access the personal data we hold about you</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure (subject to legal retention obligations)</li>
                <li>Object to processing or withdraw consent</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with the ICO (ico.org.uk)</li>
              </ul>
              <p className="font-sans text-brand-muted leading-relaxed mt-3">To exercise any of these rights, contact us at <a href="mailto:info@octavia-dental.co.uk" className="text-brand-green hover:underline">info@octavia-dental.co.uk</a>.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">8. Cookies</h2>
              <p className="font-sans text-brand-muted leading-relaxed">We use cookies to improve your experience on our website. For full details, see our <a href="/cookie-policy" className="text-brand-green hover:underline">Cookie Policy</a>.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">9. Complaints</h2>
              <p className="font-sans text-brand-muted leading-relaxed">If you have a complaint about how we handle your personal data, please contact us first at <a href="mailto:info@octavia-dental.co.uk" className="text-brand-green hover:underline">info@octavia-dental.co.uk</a>. If you remain dissatisfied, you have the right to complain to the Information Commissioner's Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">ico.org.uk</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
