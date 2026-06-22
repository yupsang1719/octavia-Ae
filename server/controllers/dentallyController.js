import axios from 'axios'

const BASE = process.env.DENTALLY_BASE_URL || 'https://api.dentally.co/v1'

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
