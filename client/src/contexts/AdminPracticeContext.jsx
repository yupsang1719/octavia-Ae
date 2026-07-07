import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const STORAGE_KEY = 'admin_practice'

const AdminPracticeContext = createContext(null)

export function AdminPracticeProvider({ children }) {
  const [practices, setPractices]       = useState([])
  const [selectedSlug, setSelectedSlug] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'octavia-aesthetic'
  )

  useEffect(() => {
    axios.get('/api/practice/all')
      .then(({ data }) => setPractices(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedSlug)
    axios.defaults.headers.common['X-Admin-Practice'] = selectedSlug
  }, [selectedSlug])

  const selected = practices.find(p => p.slug === selectedSlug) ?? { slug: selectedSlug, name: selectedSlug }

  return (
    <AdminPracticeContext.Provider value={{ practices, selected, selectedSlug, setSelectedSlug }}>
      {children}
    </AdminPracticeContext.Provider>
  )
}

export function useAdminPractice() {
  return useContext(AdminPracticeContext)
}
