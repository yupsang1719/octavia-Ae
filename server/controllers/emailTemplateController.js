import EmailTemplate from '../models/EmailTemplate.js'

const DEFAULT_REVIEW_TEMPLATE = {
  name: 'Review Request',
  subject: 'A small favour, {{firstName}} — Octavia Dental',
  bodyHtml: `<p>It was so lovely having you with us — thank you for trusting us with your care. The whole team always enjoys seeing familiar faces, and we hope you left feeling well looked after.</p>

<p>If you have just a minute, it would mean the world to us if you could share a quick review on Google. We're a small independent practice in Godalming, and every kind word genuinely helps other local families find a dentist they can feel at ease with.</p>

<p>If anything about your visit wasn't quite right, please just reply to this email or give us a call on <strong>01483 860020</strong> — we'd always rather know, and we'll do everything we can to make it right.</p>

<p>Warm wishes from all of us at Octavia Dental.</p>`,
  type: 'review_request',
  isDefault: true,
}

export async function listTemplates(_req, res) {
  try {
    let templates = await EmailTemplate.find().sort({ isDefault: -1, createdAt: 1 })
    if (!templates.length) {
      const seeded = await EmailTemplate.create(DEFAULT_REVIEW_TEMPLATE)
      templates = [seeded]
    } else {
      // Keep the default template in sync with the code definition
      const existing = templates.find(t => t.isDefault)
      if (existing && existing.subject !== DEFAULT_REVIEW_TEMPLATE.subject) {
        await EmailTemplate.findByIdAndUpdate(existing._id, {
          subject: DEFAULT_REVIEW_TEMPLATE.subject,
          bodyHtml: DEFAULT_REVIEW_TEMPLATE.bodyHtml,
        })
        templates = await EmailTemplate.find().sort({ isDefault: -1, createdAt: 1 })
      }
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
