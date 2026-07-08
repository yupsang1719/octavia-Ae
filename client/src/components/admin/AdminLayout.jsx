import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Inbox, FileText, Image, Users, Star, MessageSquare, BarChart2, Stethoscope, Clock, Mail, UserCheck, LogOut, Menu, X, Settings, Activity } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePractice } from '../../contexts/PracticeContext'
import { splitPracticeName } from '../../utils/splitPracticeName'

const NAV = [
  { to: '/admin',                    label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries',          label: 'Enquiries',       icon: Inbox },
  { to: '/admin/blog',               label: 'Blog',            icon: FileText },
  { to: '/admin/gallery',            label: 'Gallery',         icon: Image },
  { to: '/admin/team',               label: 'Team',            icon: Users },
  { to: '/admin/reviews',            label: 'Reviews',         icon: MessageSquare },
  { to: '/admin/trust-bar',          label: 'Trust Bar',       icon: BarChart2 },
  { to: '/admin/opening-hours',      label: 'Opening Hours',   icon: Clock },
  { to: '/admin/review-request',     label: 'Review Requests', icon: Star },
  { to: '/admin/treatments',         label: 'Treatments',      icon: Stethoscope },
  { to: '/admin/nhs-bands',          label: 'NHS Bands',       icon: Activity, onlyFor: 'octavia-house' },
  { to: '/admin/patients',           label: 'Patients',        icon: UserCheck },
  { to: '/admin/email-templates',    label: 'Email Templates', icon: Mail },
  { to: '/admin/practice-settings',  label: 'Practice Settings', icon: Settings },
]

const SITE_COLOURS = {
  'octavia-aesthetic': 'bg-emerald-500',
  'octavia-house':     'bg-blue-500',
  'new-octavia':       'bg-green-600',
}

export default function AdminLayout() {
  const { logout } = useAuth()
  const { name, slug } = usePractice()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [logoTitle, logoSub] = splitPracticeName(name)
  const dot = SITE_COLOURS[slug] ?? 'bg-white/40'

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-brand-dark flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Practice identity */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
            <p className="font-serif text-white text-base leading-tight">{logoTitle}</p>
          </div>
          {logoSub && (
            <p className="text-white/40 text-[10px] font-sans tracking-widest uppercase pl-[18px]">{logoSub}</p>
          )}
          <p className="text-white/25 text-[10px] font-sans mt-2 pl-[18px]">Admin Portal</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV.filter(item => !item.onlyFor || item.onlyFor === slug).map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-sans text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden text-brand-muted hover:text-brand-dark"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <span className="text-xs font-sans text-brand-muted tracking-wide">{name}</span>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
