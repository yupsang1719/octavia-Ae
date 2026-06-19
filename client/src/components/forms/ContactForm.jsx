import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import axios from 'axios'
import FormField from './FormField'

const schema = z.object({
  name:        z.string().min(2, 'Please enter your name'),
  email:       z.string().email('Please enter a valid email address'),
  phone:       z.string().optional(),
  service:     z.string().optional(),
  message:     z.string().min(10, 'Please enter a message (at least 10 characters)'),
  gdprConsent: z.literal(true, { errorMap: () => ({ message: 'You must consent to proceed' }) }),
})

const SERVICE_OPTIONS = [
  { value: '',              label: 'Not sure yet' },
  { value: 'implants',      label: 'Dental Implants' },
  { value: 'invisalign',    label: 'Invisalign' },
  { value: 'bonding',       label: 'Composite Bonding' },
  { value: 'veneers',       label: 'Porcelain Veneers' },
  { value: 'whitening',     label: 'Teeth Whitening' },
  { value: 'sixmonthsmile', label: '6 Month Smile' },
  { value: 'airflow',       label: 'Air Flow Hygiene' },
  { value: 'botox',         label: 'Botox & Anti-Wrinkle' },
  { value: 'general',       label: 'General Enquiry' },
  { value: 'other',         label: 'Other' },
]

const inputClass = 'w-full border border-brand-border rounded-sm px-4 py-3 text-sm font-sans text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green bg-white'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError]   = useState('')

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    setApiError('')
    try {
      await axios.post('/api/enquiries', {
        ...data,
        source: '/contact',
      })
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please call us on 01483 860020.')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-14 h-14 text-brand-green mx-auto mb-4" />
        <h3 className="font-serif text-2xl text-brand-dark mb-2">Message received</h3>
        <p className="font-sans text-brand-muted">We'll be in touch within 2 hours during opening hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Full name" error={errors.name?.message} required>
          <input type="text" autoComplete="name" placeholder="Jane Smith" className={inputClass} {...register('name')} />
        </FormField>

        <FormField label="Phone number" error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" placeholder="07700 900000" className={inputClass} {...register('phone')} />
        </FormField>
      </div>

      <FormField label="Email address" error={errors.email?.message} required>
        <input type="email" autoComplete="email" placeholder="jane@example.com" className={inputClass} {...register('email')} />
      </FormField>

      <FormField label="Treatment interested in" error={errors.service?.message}>
        <select className={inputClass} {...register('service')}>
          {SERVICE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Message" error={errors.message?.message} required>
        <textarea
          rows={4}
          placeholder="How can we help you?"
          className={`${inputClass} resize-none`}
          {...register('message')}
        />
      </FormField>

      {/* GDPR */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 w-4 h-4 accent-brand-green flex-shrink-0" {...register('gdprConsent')} />
          <span className="text-xs font-sans text-brand-muted leading-relaxed">
            I consent to Octavia Dental & Facial Aesthetics storing my details to respond to this enquiry.{' '}
            <a href="/privacy-policy" className="underline hover:text-brand-green" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </span>
        </label>
        {errors.gdprConsent && <p className="text-red-500 text-xs mt-1">{errors.gdprConsent.message}</p>}
      </div>

      {apiError && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-sm px-3 py-2">{apiError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>

      <p className="text-xs text-brand-subtle text-center">
        Prices quoted at consultation may vary based on individual assessment.
      </p>
    </form>
  )
}
