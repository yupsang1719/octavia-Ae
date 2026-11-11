// Inline list of tags separated by small gold diamonds — replaces pill chips.
// Every item carries a leading diamond in a left gutter; the gutter is clipped,
// so the diamond at the start of each wrapped line is hidden.
export default function TagList({ items = [], className = '' }) {
  if (!items.length) return null
  return (
    <div className={`overflow-hidden ${className}`}>
      <ul className="-ml-6 flex flex-wrap gap-y-1.5">
        {items.map(item => (
          <li key={item} className="relative pl-6">
            <span aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 bg-brand-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
