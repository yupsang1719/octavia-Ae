import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../utils/seo'

export default function CookiePolicy() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Octavia Dental & Facial Aesthetics</title>
        <meta name="description" content="Cookie Policy for octavia-dental.co.uk. How and why we use cookies on our website." />
        <link rel="canonical" href={`${SITE_URL}/cookie-policy`} />
      </Helmet>

      <div className="pt-16 bg-brand-cream min-h-screen">
        <div className="container-wide max-w-3xl py-16 lg:py-24">
          <h1 className="font-serif text-4xl text-brand-dark font-medium mb-2">Cookie Policy</h1>
          <p className="font-sans text-sm text-brand-subtle mb-10">Last updated: June 2026</p>

          <div className="space-y-8">
            {[
              { title:'What are cookies?', body:'Cookies are small text files placed on your device when you visit a website. They help websites function correctly and allow owners to understand how visitors use their site.' },
              { title:'How we use cookies', body:'We use cookies to: remember your cookie consent preferences; understand how visitors navigate our website (analytics); and ensure the website functions correctly (essential cookies).' },
              { title:'Types of cookies we use', body:null, list:['Essential cookies — required for the website to function. These cannot be disabled.','Analytics cookies — help us understand how visitors use the site (e.g. Google Analytics). These are only set with your consent.','Preference cookies — remember your settings (e.g. cookie consent). These are set after you interact with our consent banner.'] },
              { title:'Managing cookies', body:'You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website. You can also update your consent preferences by clicking "Essential only" on our cookie banner.' },
              { title:'Third-party cookies', body:'We may use third-party services such as Google Analytics and Google Maps that set their own cookies. These are subject to their respective privacy policies. We use Google Maps solely to display our practice location.' },
              { title:'Contact', body:null, link:{ text:'If you have questions about our use of cookies, contact us at info@octavia-dental.co.uk', href:'mailto:info@octavia-dental.co.uk' } },
            ].map(section => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl text-brand-dark font-medium mb-3">{section.title}</h2>
                {section.body && <p className="font-sans text-brand-muted leading-relaxed">{section.body}</p>}
                {section.list && (
                  <ul className="mt-3 space-y-1 list-disc pl-6">
                    {section.list.map((item,i) => <li key={i} className="font-sans text-brand-muted">{item}</li>)}
                  </ul>
                )}
                {section.link && <p className="font-sans text-brand-muted leading-relaxed"><a href={section.link.href} className="text-brand-green hover:underline">{section.link.text}</a></p>}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
