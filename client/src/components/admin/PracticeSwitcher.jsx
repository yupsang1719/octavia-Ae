import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Building2 } from 'lucide-react'
import { useAdminPractice } from '../../contexts/AdminPracticeContext'
import { splitPracticeName } from '../../utils/splitPracticeName'

const THEME_DOT = {
  'octavia-aesthetic': 'bg-emerald-500',
  'octavia-house':     'bg-blue-500',
  'new-octavia':       'bg-green-600',
}

export default function PracticeSwitcher() {
  const { practices, selected, selectedSlug, setSelectedSlug } = useAdminPractice()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!practices.length) return null

  const [title] = splitPracticeName(selected.name ?? selectedSlug)

  return (
    <div ref={ref} className="relative px-3 pb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/8 hover:bg-white/12 transition-colors text-left group"
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${THEME_DOT[selectedSlug] ?? 'bg-white/40'}`} />
        <span className="flex-1 min-w-0">
          <span className="block text-white text-xs font-sans font-medium truncate leading-tight">{title}</span>
          <span className="block text-white/40 text-[10px] font-sans uppercase tracking-wider mt-0.5">Active practice</span>
        </span>
        <ChevronDown
          size={13}
          className={`text-white/40 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <p className="px-3 pt-3 pb-1.5 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-400">
            Switch practice
          </p>
          {practices.map(p => {
            const [pTitle, pSub] = splitPracticeName(p.name)
            const isActive = p.slug === selectedSlug
            return (
              <button
                key={p.slug}
                onClick={() => { setSelectedSlug(p.slug); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50 ${
                  isActive ? 'bg-gray-50' : ''
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${THEME_DOT[p.slug] ?? 'bg-gray-300'}`} />
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-sans font-medium truncate ${isActive ? 'text-brand-dark' : 'text-gray-700'}`}>
                    {pTitle}
                  </span>
                  {pSub && (
                    <span className="block text-[11px] font-sans text-gray-400 mt-0.5">{pSub}</span>
                  )}
                </span>
                {isActive && <Check size={14} className="text-brand-green flex-shrink-0" />}
              </button>
            )
          })}
          <div className="border-t border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-sans text-gray-400 leading-relaxed">
              All edits apply to the selected practice only.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
