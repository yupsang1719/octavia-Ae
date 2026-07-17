export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function readTime(text) {
  const words = text?.split(/\s+/).length || 0
  const mins = Math.ceil(words / 200)
  return `${mins} min read`
}

export function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB')
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount || 0)
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
