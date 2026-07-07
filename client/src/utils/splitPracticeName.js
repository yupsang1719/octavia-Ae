export function splitPracticeName(name) {
  const suffixes = [' Dental Practice', ' Dental Surgery']
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) return [name.slice(0, -suffix.length), suffix.trim()]
  }
  if (name.includes(' & ')) {
    const idx = name.indexOf(' & ')
    return [name.slice(0, idx), '& ' + name.slice(idx + 3)]
  }
  return [name, '']
}
