import Enquiry from '../models/Enquiry.js'
import { sendEnquiryNotification, sendEnquiryConfirmation } from '../utils/email.js'

export async function createEnquiry(req, res) {
  try {
    const { name, email, phone, service, preferredTime, location, message, source, gdprConsent } = req.body

    if (!gdprConsent) {
      return res.status(422).json({ error: 'GDPR consent is required' })
    }

    const enquiry = await Enquiry.create({
      name, email, phone, service, location, message, source, gdprConsent,
    })

    // Fire email notifications — don't block the response
    Promise.all([
      sendEnquiryNotification({ ...enquiry.toObject(), preferredTime }),
      sendEnquiryConfirmation(enquiry),
    ]).catch(err => console.error('Email error:', err.message))

    res.status(201).json({ success: true, id: enquiry._id })
  } catch (err) {
    console.error('Enquiry error:', err)
    res.status(500).json({ error: 'Failed to submit enquiry' })
  }
}

export async function getEnquiries(req, res) {
  try {
    const VALID_STATUSES = ['new', 'contacted', 'booked', 'closed']
    const rawStatus = req.query.status
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
    const filter = rawStatus && VALID_STATUSES.includes(rawStatus) ? { status: rawStatus } : {}

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Enquiry.countDocuments(filter),
    ])

    res.json({ enquiries, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
}

export async function updateEnquiryStatus(req, res) {
  try {
    const { status } = req.body
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
    res.json(enquiry)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry' })
  }
}
