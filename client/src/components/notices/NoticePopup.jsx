import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { dismiss } from '../../utils/noticeDismiss'

// Popups are shown one at a time, in order — closing one reveals the next.
export default function NoticePopup({ notices }) {
  const [queue, setQueue] = useState(notices)

  useEffect(() => { setQueue(notices) }, [notices])

  const notice = queue[0]

  function close() {
    if (!notice) return
    dismiss(notice)
    setQueue(q => q.slice(1))
  }

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          key={notice._id}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1.5 text-brand-dark hover:bg-white shadow-sm"
            >
              <X size={16} />
            </button>

            {notice.image && (
              <img src={notice.image} alt="" className="w-full h-48 object-cover" />
            )}

            <div className="p-6">
              <h3 className="font-serif text-xl text-brand-dark mb-2">{notice.title}</h3>
              <p className="font-sans text-sm text-brand-muted leading-relaxed whitespace-pre-line">{notice.message}</p>

              {notice.linkUrl && (
                notice.linkUrl.startsWith('/') ? (
                  <Link
                    to={notice.linkUrl}
                    onClick={close}
                    className="inline-block mt-4 bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brand-dark/90"
                  >
                    {notice.linkText || 'Find out more'}
                  </Link>
                ) : (
                  <a
                    href={notice.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brand-dark/90"
                  >
                    {notice.linkText || 'Find out more'}
                  </a>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
