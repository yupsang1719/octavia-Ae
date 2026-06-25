import axios from 'axios'
import EmailTemplate from '../models/EmailTemplate.js'
import { sendTemplateEmail } from '../utils/email.js'

const BASE        = process.env.DENTALLY_BASE_URL || 'https://api.dentally.co/v1'
const authHeaders = () => ({
  Authorization: `Bearer ${process.env.DENTALLY_API_KEY}`,
  Accept: 'application/json',
  'User-Agent': 'OctaviaDental/1.0',
})

// Fetch patients who had an appointment in the last N days.
// Fetches patients from /patients endpoint (appointments list requires broader permissions).
// Filters by last_visit_date / last_contacted_at if available on the patient record,
// otherwise returns all patients with an email (capped at 500).
async function fetchRecentPatients(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

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
      const status = err.response?.status || 'network error'
      const msg    = err.response?.data?.message || err.response?.data?.error || err.message
      console.error('[Dentally] Patients error:', status, msg)
      throw new Error(`Dentally responded ${status}: ${msg}`)
    }

    const data     = response.data
    const patients = data.patients || data.data || (Array.isArray(data) ? data : [])

    // Log field names on first page so we can see what date fields exist
    if (page === 1) {
      console.log('[Dentally] Patient fields:', Object.keys(patients[0] || {}))
    }

    all = all.concat(patients)

    const meta       = data.meta || data.pagination || {}
    const totalPages = meta.total_pages || meta.last_page || meta.pageCount || null
    const done = !patients.length
      || (totalPages !== null && page >= totalPages)
      || (totalPages === null && patients.length < 100)
      || page >= 5   // cap at 500 patients
    if (done) break
    page++
  }

  console.log(`[Dentally] Raw patient count: ${all.length}`)

  const normalised = all.map(p => {
    // Grab any last-visit date field Dentally exposes
    const lastVisitRaw = p.last_visit_date || p.last_contacted_at || p.last_appointment_at
      || p.last_appointment_date || p.updated_at || ''

    return {
      id:               String(p.id),
      firstName:        p.first_name  || '',
      lastName:         p.last_name   || '',
      name:             `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      email:            p.email_address || p.email || '',
      phone:            p.mobile_phone  || p.phone || '',
      marketingConsent: !!(p.marketing_consent || p.marketingConsent),
      lastVisit:        lastVisitRaw,
      lastTreatment:    '',
      lastClinician:    '',
    }
  }).filter(p => p.email)

  // If patients have a usable last-visit date, filter to the last N days
  const withDate = normalised.filter(p => p.lastVisit)
  if (withDate.length > 0) {
    const recent = normalised.filter(p => !p.lastVisit || new Date(p.lastVisit) >= since)
    console.log(`[Dentally] Filtered to ${recent.length} patients visited in last ${days} days`)
    return recent
  }

  // No date field available — return all (with email)
  console.log(`[Dentally] No last-visit date field found; returning all ${normalised.length} patients with email`)
  return normalised
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

// Debug — raw first page of patients
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

// Debug — tries four different param combinations so we can see which one Dentally accepts
export async function debugAppointments(_req, res) {
  if (!process.env.DENTALLY_API_KEY) {
    return res.status(503).json({ error: 'DENTALLY_API_KEY not set' })
  }
  const today     = new Date().toISOString().split('T')[0]           // YYYY-MM-DD
  const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const todayISO  = new Date().toISOString()                          // full ISO
  const startISO  = new Date(Date.now() - 30 * 86400000).toISOString()

  const attempts = [
    { label: 'start_date/finish_date (YYYY-MM-DD)',    params: { start_date: startDate, finish_date: today,    per_page: 3 } },
    { label: 'start_time/finish_time (YYYY-MM-DD)',    params: { start_time: startDate, finish_time: today,    per_page: 3 } },
    { label: 'start_time/finish_time (ISO datetime)',  params: { start_time: startISO,  finish_time: todayISO, per_page: 3 } },
    { label: 'no date params',                         params: { per_page: 3, page: 1 } },
  ]

  const results = {}
  for (const { label, params } of attempts) {
    try {
      const { data } = await axios.get(`${BASE}/appointments`, {
        headers: authHeaders(), params, timeout: 10000,
      })
      results[label] = { ok: true, count: (data.appointments || data.data || []).length, data }
    } catch (err) {
      results[label] = { ok: false, status: err.response?.status, error: err.response?.data || err.message }
    }
  }

  res.json({ base: BASE, results })
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
