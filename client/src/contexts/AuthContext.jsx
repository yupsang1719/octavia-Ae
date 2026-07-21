/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const TOKEN_KEY = 'octavia_admin_token'

function decodePayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function isTokenValid(token) {
  const payload = token && decodePayload(token)
  return !!payload && payload.exp * 1000 > Date.now()
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!isTokenValid(stored)) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return stored
  })

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/admin/login', { email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const payload = token ? decodePayload(token) : null
  const role = payload?.role || (token ? 'manager' : null)

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, role, email: payload?.email || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
