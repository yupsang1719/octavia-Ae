import { useState, useCallback } from 'react'

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultService, setDefaultService] = useState('')

  const open = useCallback((service = '') => {
    setDefaultService(service)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setDefaultService('')
  }, [])

  return { isOpen, defaultService, open, close }
}
