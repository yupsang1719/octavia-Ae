import axios from 'axios'
import EmailTemplate from '../models/EmailTemplate.js'
import { sendTemplateEmail } from '../utils/email.js'

const BASE        = process.env.DENTALLY_BASE_URL || 'https://api.dentally.co/v1'
const authHeaders = () => ({
  Authorization: `Bearer ${process.env.DENTALLY_API_KEY}`,
  Accept: 'application/json',
  'User-Agent': 'OctaviaDental/1.0',
})

// Fetch patients who had an appointment in the last N days
async function fetchRecentPatients(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const startDate = since.toISOString().split('T')[0]
  const today     = new Date().toISOString().split('T')[0]

  let page = 1
  const patientMap = new Map()

  while (true) {
    let response
    try {
      response = await axios.get(`${BASE}/appointments`, {
        headers: authHeaders(),
        params: { start_date: startDate, finish_date: today, per_page: 100, page },
        timeout: 15000,
      })
    } catch (err) {
      const status = err.response?.status || 'network error'
      const msg    = err.response?.data?.message || err.response?.data?.error || err.message
      console.error('[Dentally] Appointments error:', status, msg, err.response?.data)
      throw new Error(`Dentally responded ${status}: ${msg}`)
    }

    const data  = response.data
    const appts = data.appointments || data.data || (Array.isArray(data) ? data : [])

    for (const a of appts) {
      const pid = a.patient_id || a.patient?.id
      if (!pid || patientMap.has(String(pid))) continue

      const p = a.patient || {}
      patientMap.set(String(pid), {
        id:               String(pid),
        firstName:        p.first_name  || p.firstName  || '',
        lastName:         p.last_name   || p.lastName   || '',
        name:             `${p.first_name || p.firstName || ''} ${p.last_name || p.lastName || ''}`.trim(),
        email:            p.email_address || p.email || '',
        phone:            p.mobile_phone  || p.phone || '',
        marketingConsent: !!(p.marketing_consent || p.marketingConsent),
        lastVisit:        a.start_time || a.date || a.appointment_date || '',
        lastTreatment:    a.description || a.treatment || a.reason || '',
        lastClinician:    a.practitioner?.name || a.clinician || '',
      })
    }

    const meta       = data.meta || data.pagination || {}
    const totalPages = meta.total_pages || meta.last_page || meta.pageCount || null
    const done = !appts.length
      || (totalPages !== null && page >= totalPages)
      || (totalPages === null && appts.length < 100)
      || page >= 20
    if (done) break
    page++
  }

  // For patients whose email wasn't embedded in the appointment, fetch individually (parallel, cap 50)
  const needsFetch = [...patientMap.values()].filter(p => !p.email).slice(0, 50)
  await Promise.all(needsFetch.map(async patient => {
    try {
      const { data } = await axios.get(`${BASE}/patients/${patient.id}`, {
        headers: authHeaders(), timeout: 10000,
      })
      const p = data.patient || data
      patient.email            = p.email_address || p.email || ''
      patient.phone            = patient.phone || p.mobile_phone || p.phone || ''
      patient.marketingConsent = !!(p.marketing_consent || p.marketingConsent)
      if (!patient.name) {
        patient.firstName = p.first_name || ''
        patient.lastName  = p.last_name  || ''
        patient.name      = `${patient.firstName} ${patient.lastName}`.trim()
      }
    } catch { /* skip patients we can't enrich */ }
  }))

  return [...patientMap.values()].filter(p => p.email)
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
    const patients = await fetchRecentPatients(30)
    console.log(`[Dentally] Fetched ${patients.length} patients from last 30 days`)
    res.json({ patients, configured: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}

export async function getPatientAppointments(req, res) {
  if (!process.env.DENTALLY_API_KEY) return res.status(503).json({ error: 'Dentally not configured' })
  try {
    const { data } = await axios.get(`${BASE}/appointments`, {
      headers: authHeaders(),
      params:  { patient_id: req.params.id, per_page: 50 },
      timeout: 15000,
    })

    const appointments = (data.appointments || data.data || []).map(a => ({
      id:        a.id,
      date:      a.start_time || a.date || a.appointment_date,
      treatment: a.description || a.treatment || a.reason || '',
      clinician: a.practitioner?.name || a.clinician || '',
      status:    a.state || a.status || '',
    }))

    const now  = new Date()
    const past = appointments
      .filter(a => new Date(a.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    const upcoming = appointments
      .filter(a => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json({ past, upcoming })
  } catch (err) {
    const detail = err.response?.data || err.message
    res.status(502).json({ error: err.message, detail })
  }
}

export async function sendSingle(req, res) {
  const { patient, templateId, vars = {} } = req.body
  if (!templateId || !patient) return res.status(400).json({ error: 'templateId and patient required' })

  const template = await EmailTemplate.findById(templateId)
  if (!template) return res.status(404).json({ error: 'Template not found' })

  try {
    await sendTemplateEmail({
      to:           patient.email,
      name:         patient.name,
      subject:      template.subject,
      bodyHtml:     template.bodyHtml,
      templateType: template.type,
      vars,
    })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
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
