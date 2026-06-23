import EmailTemplate from '../models/EmailTemplate.js'

const DEFAULT_REVIEW_TEMPLATE = {
  name: 'Review Request',
  subject: 'Thank you for visiting us, {{firstName}} — Octavia Dental',
  bodyHtml: `<p>Thank you so much for coming in to see us — it was genuinely lovely to look after you. We hope you're feeling great and already noticing the difference.</p>

<p>As a small independent practice, every review genuinely helps other patients in Surrey and Hampshire find the care they need. If you have just one minute, we'd be so grateful if you could share your experience on Google.</p>

<p>If anything about your visit could have been better, please reply to this email or call us on <strong>01483 860020</strong> — we always want to know, and we'll make it right.</p>

<p>We look forward to seeing you again soon.</p>`,
  type: 'review_request',
  isDefault: true,
}

export async function listTemplates(_req, res) {
  try {
    let templates = await EmailTemplate.find().sort({ isDefault: -1, createdAt: 1 })
    if (!templates.length) {
      const seeded = await EmailTemplate.create(DEFAULT_REVIEW_TEMPLATE)
      templates = [seeded]
    }
    res.json(templates)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getTemplate(req, res) {
  try {
    const t = await EmailTemplate.findById(req.params.id)
    if (!t) return res.status(404).json({ error: 'Template not found' })
    res.json(t)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createTemplate(req, res) {
  try {
    const { name, subject, bodyHtml, type } = req.body
    if (!name || !subject || !bodyHtml) return res.status(400).json({ error: 'name, subject and bodyHtml are required' })
    const t = await EmailTemplate.create({ name, subject, bodyHtml, type: type || 'marketing' })
    res.status(201).json(t)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateTemplate(req, res) {
  try {
    const { name, subject, bodyHtml, type } = req.body
    const t = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      { name, subject, bodyHtml, type },
      { new: true, runValidators: true }
    )
    if (!t) return res.status(404).json({ error: 'Template not found' })
    res.json(t)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteTemplate(req, res) {
  try {
    const t = await EmailTemplate.findById(req.params.id)
    if (!t) return res.status(404).json({ error: 'Template not found' })
    if (t.isDefault) return res.status(400).json({ error: 'Default templates cannot be deleted' })
    await t.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
