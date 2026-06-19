export default function Badge({ children, variant = 'green', className = '' }) {
  const styles = {
    green:  'bg-brand-green-bg text-brand-green border border-brand-green/20',
    gold:   'bg-brand-gold-lt text-brand-dark border border-brand-gold/30',
    muted:  'bg-gray-100 text-brand-muted border border-brand-border',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-sans font-medium rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
