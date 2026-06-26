import { Resend } from 'resend'
import { LOGO_BASE64 } from './logoBase64.js'

function getClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function safeSubject(str) {
  return String(str ?? '').replace(/[\r\n\t]/g, ' ').trim()
}

const FROM = 'Octavia Dental & Facial Aesthetics <info@octavia-dental.co.uk>'
const TO   = process.env.EMAIL_TO || 'info@octavia-dental.co.uk'

export async function sendEnquiryNotification(enquiry) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping notification')
    return
  }

  const { error } = await getClient().emails.send({
    from:    FROM,
    to:      TO,
    subject: safeSubject(`New enquiry: ${enquiry.name} — ${enquiry.service || 'General'}`),
    html: `
      <h2>New Enquiry — Octavia Dental</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.name)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.email)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.phone) || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Service</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.service) || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Preferred time</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.preferredTime) || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.message) || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Source page</td><td style="padding:8px;border:1px solid #ddd">${esc(enquiry.source) || '—'}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;font-size:13px">Submitted: ${new Date(enquiry.createdAt).toLocaleString('en-GB')}</p>
    `,
  })

  if (error) throw new Error(error.message)
}

export async function sendEnquiryConfirmation(enquiry) {
  if (!process.env.RESEND_API_KEY) return

  const { error } = await getClient().emails.send({
    from:    FROM,
    to:      enquiry.email,
    subject: "We've received your enquiry — Octavia Dental",
    html: `
      <p>Dear ${esc(enquiry.name)},</p>
      <p>Thank you for contacting Octavia Dental & Facial Aesthetics. We've received your enquiry and a member of our team will be in touch within 2 hours during opening hours.</p>
      <p>If your query is urgent, please call us on <strong><a href="tel:01483860020">01483 860020</a></strong>.</p>
      <p>Best regards,<br/>The Octavia Dental team</p>
      <hr/>
      <p style="font-size:12px;color:#999">Octavia Dental & Facial Aesthetics · Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ</p>
    `,
  })

  if (error) throw new Error(error.message)
}

export async function sendReviewRequest({ name, email, note, treatment, visitDate, clinician }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping review request')
    return
  }

  const reviewUrl = process.env.GOOGLE_REVIEW_URL || 'https://g.page/r/CT5vLpOPjfCQEBM/review'
  const firstName = esc(name.split(' ')[0])
  const eTreatment = esc(treatment)
  const eVisitDate = esc(visitDate)
  const eClinician = esc(clinician)
  const eNote      = esc(note)

  const starSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  const starGold = `<svg width="32" height="32" viewBox="0 0 24 24" fill="#C8A96E" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`

  const treatmentPill = (eTreatment || eVisitDate)
    ? `<div style="display:inline-block;background:#edf7e3;color:#2D5A1E;font-size:12px;font-weight:600;padding:5px 14px;border-radius:100px;margin-bottom:22px;border:1px solid #c3e6a0;font-family:Arial,sans-serif">${[eTreatment, eVisitDate].filter(Boolean).join(' · ')}</div>`
    : ''

  const noteHtml = eNote
    ? `<p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 16px;font-style:italic;border-left:3px solid #6AAF30;padding-left:14px;font-family:Arial,sans-serif">${eNote}</p>`
    : ''

  const hasRecap = eTreatment || eVisitDate || eClinician
  const recapHtml = hasRecap ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf4;border:1px solid #d4eabd;border-left:4px solid #6AAF30;border-radius:10px;margin:22px 0">
      <tr>
        <td style="padding:18px 20px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${eTreatment ? `<td style="width:50%;padding-bottom:12px;vertical-align:top">
                <div style="font-size:10px;font-weight:700;color:#6AAF30;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif">Treatment</div>
                <div style="font-size:14px;font-weight:600;color:#1a3a10;margin-top:2px;font-family:Arial,sans-serif">${eTreatment}</div>
              </td>` : '<td style="width:50%"></td>'}
              ${eVisitDate ? `<td style="width:50%;padding-bottom:12px;vertical-align:top">
                <div style="font-size:10px;font-weight:700;color:#6AAF30;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif">Date</div>
                <div style="font-size:14px;font-weight:600;color:#1a3a10;margin-top:2px;font-family:Arial,sans-serif">${eVisitDate}</div>
              </td>` : '<td style="width:50%"></td>'}
            </tr>
            <tr>
              ${eClinician ? `<td style="width:50%;vertical-align:top">
                <div style="font-size:10px;font-weight:700;color:#6AAF30;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif">Clinician</div>
                <div style="font-size:14px;font-weight:600;color:#1a3a10;margin-top:2px;font-family:Arial,sans-serif">${eClinician}</div>
              </td>` : '<td style="width:50%"></td>'}
              <td style="width:50%;vertical-align:top">
                <div style="font-size:10px;font-weight:700;color:#6AAF30;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif">Location</div>
                <div style="font-size:14px;font-weight:600;color:#1a3a10;margin-top:2px;font-family:Arial,sans-serif">Godalming, Surrey</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>` : ''

  const sigName = eClinician ? `${eClinician} &amp; the Octavia Dental team` : 'The Octavia Dental team'
  const treatmentRef = eTreatment ? ` after your <strong style="color:#2D5A1E">${eTreatment}</strong>` : ''

  const siteUrl = process.env.SITE_URL || 'https://octavia-dental.co.uk'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:40px 16px;background:#f0f2f0;font-family:Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">

  <!-- HEADER -->
  <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:20px 36px;border-bottom:1px solid #eef2eb">
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:middle;padding-right:10px">
          <img src="${LOGO_BASE64}" alt="" width="36" height="36" style="display:block;width:36px;height:36px;border-radius:8px"/>
        </td>
        <td style="vertical-align:middle">
          <div style="font-size:14px;font-weight:700;color:#2D5A1E;line-height:1.2;font-family:Arial,sans-serif">Octavia Dental &amp; Facial Aesthetics</div>
          <div style="font-size:11px;color:#888;margin-top:2px;font-family:Arial,sans-serif">Godalming, Surrey</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:40px 36px 32px">

    <div style="font-size:22px;font-weight:700;color:#2D5A1E;margin-bottom:6px;letter-spacing:-0.3px">Hi ${firstName},</div>
    ${treatmentPill}

    <p style="font-size:15px;color:#2a2a2a;line-height:1.75;margin:0 0 16px">
      Thank you so much for coming in to see us — it was genuinely lovely to look after you.
      We hope you're feeling great and that you're already noticing the difference${treatmentRef}.
    </p>

    ${recapHtml}

    ${noteHtml}

    <p style="font-size:15px;color:#2a2a2a;line-height:1.75;margin:0 0 28px">
      As a small independent practice, every review genuinely helps other patients in
      Surrey and Hampshire find the care they need. If you have just one minute, we'd be
      so grateful if you could share your experience on Google.
    </p>

    <!-- REVIEW CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
      <tr><td style="text-align:center">
        <div style="font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:14px">Leave us a Google review</div>
        <div style="margin-bottom:18px">${starGold}${starGold}${starGold}${starGold}${starGold}</div>
        <a href="${reviewUrl}" style="background:#2D5A1E;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:10px;display:inline-block;letter-spacing:0.1px">
          Leave a Google review ★
        </a>
        <div style="margin-top:10px;font-size:12px;color:#999">Takes less than a minute · Opens Google directly</div>
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #eef2eb;margin:0 0 24px"/>

    <p style="font-size:14px;color:#444;line-height:1.75;margin:0 0 16px">
      If anything about your visit could have been better, please reply to this email or call
      us on <strong style="color:#2D5A1E">01483 860020</strong> — we always want to know,
      and we'll make it right.
    </p>
    <p style="font-size:14px;color:#444;line-height:1.75;margin:0 0 24px">
      We look forward to seeing you again soon.
    </p>

    <!-- SIGNATURE -->
    <table cellpadding="0" cellspacing="0" style="background:#f7faf4;border:1px solid #e0efd3;border-radius:10px;width:100%">
      <tr>
        <td style="padding:18px 20px">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;padding-right:14px">
                <div style="width:46px;height:46px;background:#2D5A1E;border-radius:50%;text-align:center;line-height:46px;font-size:16px;font-weight:700;color:#ffffff">OD</div>
              </td>
              <td style="vertical-align:middle">
                <div style="font-size:14px;font-weight:700;color:#2D5A1E">${sigName}</div>
                <div style="font-size:12px;color:#666;margin-top:2px">Octavia Dental &amp; Facial Aesthetics · 01483 860020</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#2D5A1E;border-radius:0 0 14px 14px;padding:22px 36px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:2;font-family:Arial,sans-serif">
            <a href="tel:01483860020" style="color:rgba(255,255,255,0.75);text-decoration:none">01483 860020</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@octavia-dental.co.uk" style="color:rgba(255,255,255,0.75);text-decoration:none">info@octavia-dental.co.uk</a>
            &nbsp;·&nbsp;
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.75);text-decoration:none">octavia-dental.co.uk</a>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;font-family:Arial,sans-serif">
            Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</body>
</html>`

  const { error } = await getClient().emails.send({
    from:    FROM,
    to:      email,
    subject: safeSubject(`Thank you for visiting us, ${name.split(' ')[0]} — Octavia Dental`),
    html,
  })

  if (error) throw new Error(error.message)
}

// ── Generic template email ───────────────────────────────────────────────────

function substituteMergeTags(text, vars) {
  return text
    .replace(/\{\{firstName\}\}/g, vars.firstName || '')
    .replace(/\{\{name\}\}/g,      vars.name      || '')
    .replace(/\{\{treatment\}\}/g, vars.treatment  || '')
    .replace(/\{\{clinician\}\}/g, vars.clinician  || '')
    .replace(/\{\{practiceName\}\}/g, 'Octavia Dental &amp; Facial Aesthetics')
    .replace(/\{\{phone\}\}/g, '01483 860020')
}

function buildTemplateHtml({ firstName, bodyHtml, includeReviewCta }) {
  const siteUrl   = process.env.SITE_URL         || 'https://octavia-dental.co.uk'
  const reviewUrl = process.env.GOOGLE_REVIEW_URL || 'https://g.page/r/CT5vLpOPjfCQEBM/review'
  const starGold  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#C8A96E"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`

  const reviewCtaHtml = includeReviewCta ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
      <tr><td style="text-align:center">
        <div style="font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px">Leave us a Google review</div>
        <div style="margin-bottom:16px">${starGold}${starGold}${starGold}${starGold}${starGold}</div>
        <a href="${reviewUrl}" style="background:#2D5A1E;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;display:inline-block">Leave a Google review ★</a>
        <div style="margin-top:8px;font-size:12px;color:#999">Takes less than a minute · Opens Google directly</div>
      </td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #eef2eb;margin:0 0 24px"/>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:40px 16px;background:#f0f2f0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
  <tr><td style="background:#fff;border-radius:14px 14px 0 0;padding:20px 36px;border-bottom:1px solid #eef2eb">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle;padding-right:10px"><img src="${LOGO_BASE64}" alt="" width="36" height="36" style="display:block;border-radius:8px"/></td>
      <td style="vertical-align:middle">
        <div style="font-size:14px;font-weight:700;color:#2D5A1E">Octavia Dental &amp; Facial Aesthetics</div>
        <div style="font-size:11px;color:#888;margin-top:2px">Godalming, Surrey</div>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:36px 36px 32px">
    <div style="font-size:22px;font-weight:700;color:#2D5A1E;margin-bottom:20px">Hi ${firstName},</div>
    <div style="font-size:15px;color:#2a2a2a;line-height:1.75">${bodyHtml}</div>
    ${reviewCtaHtml}
    <table cellpadding="0" cellspacing="0" style="background:#f7faf4;border:1px solid #e0efd3;border-radius:10px;width:100%;margin-top:24px">
      <tr><td style="padding:16px 20px">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:14px"><div style="width:42px;height:42px;background:#2D5A1E;border-radius:50%;text-align:center;line-height:42px;font-size:15px;font-weight:700;color:#fff">OD</div></td>
          <td style="vertical-align:middle">
            <div style="font-size:13px;font-weight:700;color:#2D5A1E">The Octavia Dental team</div>
            <div style="font-size:11px;color:#666;margin-top:2px">Octavia Dental &amp; Facial Aesthetics · 01483 860020</div>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#2D5A1E;border-radius:0 0 14px 14px;padding:20px 36px">
    <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:2">
      <a href="tel:01483860020" style="color:rgba(255,255,255,0.7);text-decoration:none">01483 860020</a> ·
      <a href="mailto:info@octavia-dental.co.uk" style="color:rgba(255,255,255,0.7);text-decoration:none">info@octavia-dental.co.uk</a> ·
      <a href="${siteUrl}" style="color:rgba(255,255,255,0.7);text-decoration:none">octavia-dental.co.uk</a>
    </div>
    <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:4px">Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ</div>
  </td></tr>
</table>
</body>
</html>`
}

export async function sendTemplateEmail({ to, name, subject, bodyHtml, templateType, vars = {} }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping template email')
    return
  }

  const firstName  = (name || '').split(' ')[0]
  const mergeVars  = { firstName, name, ...vars }
  const resolvedSubject  = substituteMergeTags(subject, mergeVars)
  const resolvedBodyHtml = substituteMergeTags(bodyHtml, mergeVars)

  const html = buildTemplateHtml({
    firstName,
    bodyHtml:         resolvedBodyHtml,
    includeReviewCta: templateType === 'review_request',
  })

  const { error: sendError } = await getClient().emails.send({
    from: FROM, to, subject: resolvedSubject, html,
  })

  if (sendError) throw new Error(sendError.message)
}
