export const VISIT_TYPES = [
  { value: 'servicing',        label: 'Equipment servicing' },
  { value: 'fire_alarm_test',  label: 'Fire alarm test' },
  { value: 'pat_testing',      label: 'PAT testing' },
  { value: 'water_hygiene',    label: 'Water hygiene / legionella' },
  { value: 'pest_control',     label: 'Pest control' },
  { value: 'waste_collection', label: 'Waste collection' },
  { value: 'other',            label: 'Other' },
]

export const VISIT_TYPE_LABELS = Object.fromEntries(VISIT_TYPES.map(t => [t.value, t.label]))

export const DUE_STATUS_STYLES = {
  OVERDUE:  'bg-red-100 text-red-700',
  DUE_SOON: 'bg-amber-100 text-amber-700',
  OK:       'bg-green-100 text-green-700',
}

export const DUE_STATUS_LABELS = {
  OVERDUE:  'Overdue',
  DUE_SOON: 'Due soon',
  OK:       'OK',
}
