import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, ChevronRight } from 'lucide-react'
import axios from 'axios'
import FormField from '../forms/FormField'

const schema = z.object({
  name:         z.string().min(2, 'Please enter your name'),
  phone:        z.string().min(7, 'Please enter a valid phone number'),
  email:        z.string().email('Please enter a valid email'),
  service:      z.string().min(1, 'Please select a treatment'),
  preferredTime:z.string().optional(),
  message:      z.string().optional(),
  gdprConsent:  z.literal(true, { errorMap: () => ({ message: 'You must consent to proceed' }) }),
})

const SERVICE_OPTIONS = [
  { value: '',               label: 'Select a treatment…' },
  { value: 'implants',       label: 'Dental Implants' },
  { value: 'invisalign',     label: 'Invisalign' },
  { value: 'bonding',        label: 'Composite Bonding' },
  { value: 'veneers',        label: 'Porcelain Veneers' },
  { value: 'whitening',      label: 'Teeth Whitening' },
  { value: 'sixmonthsmile',  label: '6 Month Smile' },
  { value: 'airflow',        label: 'Air Flow Hygiene' },
  { value: 'botox',          label: 'Botox & Anti-Wrinkle' },
  { value: 'general',        label: 'General Enquiry' },
  { value: 'other',          label: 'Other' },
]

export default function BookingModal({ isOpen, onClose, defaultService = '' }) {
  const [step, setStep]         = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError]   = useState('')

  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue,
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (defaultService) setValue('service', defaultService)
  }, [defaultService, setValue])

  const resetModal = useCallback(() => {
    reset()
    setStep(1)
    setSubmitted(false)
    setApiError('')
  }, [reset])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) resetModal()
    return () => { document.body.style.overflow = '' }
  }, [isOpen, resetModal])

  async function onSubmit(data) {
    setApiError('')
    try {
      await axios.post('/api/enquiries', {
        ...data,
        source: window.location.pathname,
      })
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please call us on 01483 860020.')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-sm shadow-2xl overflow-hidden"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="bg-brand-green px-6 py-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-white font-medium">Book Your Free Consultation</h2>
              <p className="text-brand-green-bg text-sm mt-0.5 font-sans">We'll call you to confirm within 2 hours</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-brand-dark mb-2">Thank you!</h3>
                <p className="font-sans text-brand-muted mb-1">We've received your enquiry.</p>
                <p className="font-sans text-brand-muted text-sm">A member of the team will call you within 2 hours during opening hours.</p>
                <button onClick={onClose} className="mt-6 btn-primary text-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Step 1: Treatment */}
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-sans font-medium text-brand-dark mb-1">
                      Which treatment are you interested in?
                    </label>
                    <select
                      {...register('service')}
                      className="w-full border border-brand-border rounded-sm px-3 py-2.5 text-sm font-sans text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      {SERVICE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-primary w-full mt-4 justify-between"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Step 2: Contact details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <FormField label="Full name" error={errors.name?.message} required>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Smith"
                        className="form-input w-full border border-brand-border rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                        {...register('name')}
                      />
                    </FormField>

                    <FormField label="Phone number" error={errors.phone?.message} required>
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="07700 900000"
                        className="form-input w-full border border-brand-border rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                        {...register('phone')}
                      />
                    </FormField>

                    <FormField label="Email address" error={errors.email?.message} required>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="jane@example.com"
                        className="form-input w-full border border-brand-border rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                        {...register('email')}
                      />
                    </FormField>

                    <FormField label="Preferred time to call" error={errors.preferredTime?.message}>
                      <select
                        className="w-full border border-brand-border rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                        {...register('preferredTime')}
                      >
                        <option value="">No preference</option>
                        <option value="morning">Morning (9am–12pm)</option>
                        <option value="afternoon">Afternoon (12pm–5pm)</option>
                        <option value="evening">Late (5pm–7pm)</option>
                      </select>
                    </FormField>

                    {/* GDPR consent */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 accent-brand-green flex-shrink-0"
                          {...register('gdprConsent')}
                        />
                        <span className="text-xs font-sans text-brand-muted leading-relaxed">
                          I consent to Octavia Dental & Facial Aesthetics storing my details and contacting me about this enquiry. We will never share your data with third parties.{' '}
                          <a href="/privacy-policy" className="underline hover:text-brand-green" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                        </span>
                      </label>
                      {errors.gdprConsent && <p className="text-red-500 text-xs mt-1">{errors.gdprConsent.message}</p>}
                    </div>

                    {apiError && (
                      <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-sm px-3 py-2">{apiError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-secondary flex-1 text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex-1 text-sm disabled:opacity-60"
                      >
                        {isSubmitting ? 'Sending…' : 'Send enquiry'}
                      </button>
                    </div>

                    <p className="text-center text-xs text-brand-subtle">
                      Or call us now:{' '}
                      <a href="tel:01483860020" className="font-medium text-brand-green hover:underline">
                        01483 860020
                      </a>
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
