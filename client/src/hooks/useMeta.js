import { useEffect } from 'react'

export function useMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) metaDesc.setAttribute('content', description)
  }, [title, description])
}
