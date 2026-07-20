import { describe, it, expect } from 'vitest'
import { computeDueSoon } from '../facilitiesCalc.js'

const NOW = new Date('2026-07-20T00:00:00Z')

describe('computeDueSoon', () => {
  it('flags a past due date as OVERDUE', () => {
    const [row] = computeDueSoon([
      { practice: 'octavia-house', visitType: 'fire_alarm_test', date: '2026-01-01', nextDueDate: '2026-07-01' },
    ], NOW)
    expect(row.flag).toBe('OVERDUE')
    expect(row.daysUntilDue).toBeLessThan(0)
  })

  it('flags a date within 30 days as DUE_SOON', () => {
    const [row] = computeDueSoon([
      { practice: 'octavia-house', visitType: 'pat_testing', date: '2026-01-01', nextDueDate: '2026-08-10' },
    ], NOW)
    expect(row.flag).toBe('DUE_SOON')
  })

  it('flags a date well in the future as OK', () => {
    const [row] = computeDueSoon([
      { practice: 'octavia-house', visitType: 'pat_testing', date: '2026-01-01', nextDueDate: '2027-01-01' },
    ], NOW)
    expect(row.flag).toBe('OK')
  })

  it('skips visits with no nextDueDate', () => {
    const rows = computeDueSoon([
      { practice: 'octavia-house', visitType: 'other', date: '2026-01-01', nextDueDate: null },
    ], NOW)
    expect(rows).toHaveLength(0)
  })

  it('groups by practice + visitType + equipment, keeping the most recently dated estimate', () => {
    const rows = computeDueSoon([
      { practice: 'octavia-house', visitType: 'servicing', equipmentId: 'eq-1', date: '2026-01-01', nextDueDate: '2026-07-01' },
      { practice: 'octavia-house', visitType: 'servicing', equipmentId: 'eq-1', date: '2026-06-01', nextDueDate: '2026-12-01' },
    ], NOW)
    expect(rows).toHaveLength(1)
    expect(rows[0].nextDueDate).toBe('2026-12-01')
  })

  it('does not let a later note-only visit hide an earlier valid due-date estimate', () => {
    const rows = computeDueSoon([
      { practice: 'octavia-house', visitType: 'fire_alarm_test', date: '2026-01-01', nextDueDate: '2026-08-01' },
      { practice: 'octavia-house', visitType: 'fire_alarm_test', date: '2026-06-01', nextDueDate: null },
    ], NOW)
    expect(rows).toHaveLength(1)
    expect(rows[0].nextDueDate).toBe('2026-08-01')
  })

  it('treats different equipment under the same visitType as separate groups', () => {
    const rows = computeDueSoon([
      { practice: 'octavia-house', visitType: 'servicing', equipmentId: 'eq-1', date: '2026-01-01', nextDueDate: '2026-08-01' },
      { practice: 'octavia-house', visitType: 'servicing', equipmentId: 'eq-2', date: '2026-01-01', nextDueDate: '2026-09-01' },
    ], NOW)
    expect(rows).toHaveLength(2)
  })

  it('sorts soonest due date first', () => {
    const rows = computeDueSoon([
      { practice: 'octavia-house', visitType: 'pat_testing', date: '2026-01-01', nextDueDate: '2027-01-01' },
      { practice: 'octavia-house', visitType: 'fire_alarm_test', date: '2026-01-01', nextDueDate: '2026-07-01' },
    ], NOW)
    expect(rows[0].visitType).toBe('fire_alarm_test')
    expect(rows[1].visitType).toBe('pat_testing')
  })
})
