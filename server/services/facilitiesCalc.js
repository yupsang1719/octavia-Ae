// visits: plain objects { practice, equipmentId, visitType, date, nextDueDate }
// For each (practice, visitType, equipment) combination, takes the most
// recently dated visit that actually set a nextDueDate — an unrelated later
// visit with no next-due estimate shouldn't hide an earlier valid one.
export function computeDueSoon(visits, now = new Date()) {
  const groups = new Map()

  for (const v of visits) {
    if (!v.nextDueDate) continue
    const key = `${v.practice}|${v.visitType}|${v.equipmentId || ''}`
    const existing = groups.get(key)
    if (!existing || new Date(v.date) > new Date(existing.date)) {
      groups.set(key, v)
    }
  }

  const rows = [...groups.values()].map(v => {
    const daysUntilDue = Math.ceil((new Date(v.nextDueDate) - now) / (1000 * 60 * 60 * 24))
    let flag = 'OK'
    if (daysUntilDue < 0) flag = 'OVERDUE'
    else if (daysUntilDue <= 30) flag = 'DUE_SOON'
    return { ...v, daysUntilDue, flag }
  })

  rows.sort((a, b) => a.daysUntilDue - b.daysUntilDue)
  return rows
}
