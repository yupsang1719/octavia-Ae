import axios from 'axios'
import EmailTemplate from '../models/EmailTemplate.js'
import { sendTemplateEmail } from '../utils/email.js'

const BASE        = process.env.DENTALLY_BASE_URL || 'https://api.dentally.co/v1'
const authHeaders = () => ({
  Authorization: `Token token=${process.env.DENTALLY_API_KEY}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
})

// Fetch ALL patients with marketing consent from Dentally (handles pagination)
async function fetchMarketingPatients() {
  let page = 1
  let all = []

  while (true) {
    let response
    try {
      response = await axios.get(`${BASE}/patients`, {
        headers: authHeaders(),
        params: { per_page: 100, page },
        timeout: 15000,
      })
    } catch (err) {
      const status     = err.response?.status || 'network error'
      const dentallyMsg = err.response?.data?.message || err.response?.data?.error || err.message
      console.error('[Dentally] Error:', status, dentallyMsg, err.response?.data)
      throw new Error(`Dentally responded ${status}: ${dentallyMsg}`)
    }

    const data = response.data
    // Dentally wraps results in { patients: [...] } or { data: [...] }
    const patients = data.patients || data.data || (Array.isArray(data) ? data : [])
    all = all.concat(patients)

    const meta = data.meta || {}
    const totalPages = meta.total_pages || meta.last_page || 1
    if (page >= totalPages || !patients.length) break
    page++
  }

  // Normalise field names, keep all patients that have an email
  return all
    .map(p => ({
      id:              p.id,
      firstName:       p.first_name  || p.firstName  || '',
      lastName:        p.last_name   || p.lastName   || '',
      name:            `${p.first_name || p.firstName || ''} ${p.last_name || p.lastName || ''}`.trim(),
      email:           p.email_address || p.email || '',
      phone:           p.mobile_phone  || p.phone || '',
      marketingConsent: !!(p.marketing_consent || p.marketingConsent),
    }))
    .filter(p => p.email)
}

export async function getSlots(req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.json({ slots: [], message: 'Dentally not configured' })
  }
  try {
    const { data } = await axios.get(`${BASE}/availability`, {
      headers: authHeaders(),
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
      headers: authHeaders(),
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
    res.status(502).json({ error: err.message })
  }
}

// Debug — returns the raw first page from Dentally so you can inspect the response shape
export async function debugDentally(_req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.status(503).json({ error: 'DENTALLY_API_KEY not set' })
  }
  try {
    const { data } = await axios.get(`${BASE}/patients`, {
      headers: authHeaders(),
      params:  { per_page: 5, page: 1 },
      timeout: 15000,
    })
    res.json({ base: BASE, raw: data })
  } catch (err) {
    const detail = err.response?.data || err.message
    res.status(502).json({ base: BASE, error: err.message, detail })
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
