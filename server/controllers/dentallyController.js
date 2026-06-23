import axios from 'axios'
import EmailTemplate from '../models/EmailTemplate.js'
import { sendTemplateEmail } from '../utils/email.js'

const BASE = process.env.DENTALLY_BASE_URL || 'https://api.dentally.co/v1'

// Fetch ALL patients with marketing consent from Dentally (handles pagination)
async function fetchMarketingPatients() {
  const headers = { Authorization: `Bearer ${process.env.DENTALLY_API_KEY}` }
  let page = 1
  let all = []

  while (true) {
    const { data } = await axios.get(`${BASE}/patients`, {
      headers,
      params: { per_page: 100, page, marketing_consent: true },
    })

    const patients = data.patients || data.data || []
    all = all.concat(patients)

    const meta = data.meta || {}
    const totalPages = meta.total_pages || meta.last_page || 1
    if (page >= totalPages || !patients.length) break
    page++
  }

  // Normalise field names (Dentally uses snake_case)
  return all
    .filter(p => p.marketing_consent || p.marketingConsent)
    .map(p => ({
      id:        p.id,
      firstName: p.first_name  || p.firstName  || '',
      lastName:  p.last_name   || p.lastName   || '',
      name:      `${p.first_name || p.firstName || ''} ${p.last_name || p.lastName || ''}`.trim(),
      email:     p.email_address || p.email || '',
      phone:     p.mobile_phone  || p.phone || '',
    }))
    .filter(p => p.email)
}

export async function getSlots(req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.json({ slots: [], message: 'Dentally not configured' })
  }
  try {
    const { data } = await axios.get(`${BASE}/availability`, {
      headers: { Authorization: `Bearer ${process.env.DENTALLY_API_KEY}` },
      params: req.query,
    })
    res.json(data)
  } catch {
    res.status(502).json({ error: 'Failed to fetch slots from Dentally' })
  }
}

export async function bookAppointment(req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.status(503).json({ error: 'Dentally not configured' })
  }
  try {
    const { data } = await axios.post(`${BASE}/appointments`, req.body, {
      headers: { Authorization: `Bearer ${process.env.DENTALLY_API_KEY}` },
    })
    res.status(201).json(data)
  } catch {
    res.status(502).json({ error: 'Failed to book appointment via Dentally' })
  }
}

export async function getMarketingPatients(_req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.json({ patients: [], configured: false })
  }
  try {
    const patients = await fetchMarketingPatients()
    res.json({ patients, configured: true })
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch patients from Dentally: ' + err.message })
  }
}

export async function sendCampaign(req, res) {
  const { patients: patientList, templateId, extraVars = {} } = req.body
  if (!templateId || !Array.isArray(patientList) || !patientList.length) {
    return res.status(400).json({ error: 'templateId and patients array are required' })
  }

  const template = await EmailTemplate.findById(templateId)
  if (!template) return res.status(404).json({ error: 'Template not found' })

  const results = { sent: [], failed: [] }

  for (const patient of patientList) {
    try {
      await sendTemplateEmail({
        to:           patient.email,
        name:         patient.name,
        subject:      template.subject,
        bodyHtml:     template.bodyHtml,
        templateType: template.type,
        vars:         { ...extraVars },
      })
      results.sent.push(patient.email)
    } catch (err) {
      results.failed.push({ email: patient.email, error: err.message })
    }
  }

  res.json(results)
}
