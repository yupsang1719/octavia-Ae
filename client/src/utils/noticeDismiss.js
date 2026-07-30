const DISMISSED_KEY = 'octavia_dismissed_notices'

// A notice is "versioned" by its updatedAt, so editing content in the CMS
// re-surfaces it even to visitors who dismissed the earlier version.
function noticeVersion(notice) {
  return `${notice._id}:${notice.updatedAt}`
}

export function isDismissed(notice) {
  try {
    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]')
    return dismissed.includes(noticeVersion(notice))
  } catch {
    return false
  }
}

export function dismiss(notice) {
  try {
    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]')
    dismissed.push(noticeVersion(notice))
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed.slice(-50)))
  } catch {
    // localStorage unavailable (private browsing etc.) — nothing to persist
  }
}
