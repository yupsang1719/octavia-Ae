import { useEffect, useRef } from 'react'

export function useScrollReveal({ threshold = 0.15, ...rest } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold, ...rest }
    )

    observer.observe(el)
    return () => observer.disconnect()
  // rest is excluded intentionally — it's caller-controlled static config
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold])

  return ref
}
