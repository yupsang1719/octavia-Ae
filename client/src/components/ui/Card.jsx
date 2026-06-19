export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white border border-brand-border rounded-sm ${
        hover ? 'transition-shadow duration-300 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
