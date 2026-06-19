import CookieConsent from 'react-cookie-consent'
import { Link } from 'react-router-dom'

export default function ConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept all cookies"
      declineButtonText="Essential only"
      enableDeclineButton
      cookieName="octavia_cookie_consent"
      style={{ background: '#1A1A1A', fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif' }}
      buttonStyle={{
        background: '#2D5A1E',
        color: '#fff',
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '2px',
        padding: '8px 16px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '1px solid #999',
        color: '#ccc',
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '2px',
        padding: '8px 16px',
      }}
    >
      We use cookies to improve your experience and analyse site traffic.{' '}
      <Link to="/cookie-policy" className="underline text-brand-gold-lt hover:text-white">
        Cookie Policy
      </Link>
      .
    </CookieConsent>
  )
}
