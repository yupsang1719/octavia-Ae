import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { dismiss } from '../../utils/noticeDismiss'

export default function NoticeBanners({ notices }) {
  const [visible, setVisible] = useState(notices)
  const ref = useRef(null)

  useEffect(() => { setVisible(notices) }, [notices])

  useEffect(() => {
    const height = visible.length ? ref.current?.offsetHeight || 0 : 0
    document.documentElement.style.setProperty('--notice-banner-height', `${height}px`)
    return () => document.documentElement.style.setProperty('--notice-banner-height', '0px')
  }, [visible])

  if (!visible.length) return null

  function close(notice) {
    dismiss(notice)
    setVisible(v => v.filter(n => n._id !== notice._id))
  }

  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 z-50">
      {visible.map(notice => (
        <div
          key={notice._id}
          className="relative bg-brand-dark text-white text-sm font-sans px-10 py-2.5 flex items-center justify-center gap-3 text-center border-b border-white/10"
        >
          <span>
            <strong className="font-medium">{notice.title}</strong>
            {notice.message && <span className="ml-1.5 text-white/80">{notice.message}</span>}
            {notice.linkUrl && (
              notice.linkUrl.startsWith('/') ? (
                <Link to={notice.linkUrl} className="ml-2 underline text-brand-gold hover:text-white">
                  {notice.linkText || 'Find out more'}
                </Link>
              ) : (
                <a href={notice.linkUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-brand-gold hover:text-white">
                  {notice.linkText || 'Find out more'}
                </a>
              )
            )}
          </span>
          <button
            onClick={() => close(notice)}
            aria-label="Dismiss notice"
            className="absolute right-3 text-white/60 hover:text-white shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
