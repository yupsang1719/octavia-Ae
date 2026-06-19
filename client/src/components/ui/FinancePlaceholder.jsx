export default function FinancePlaceholder() {
  return (
    <div
      data-integration="finance"
      className="finance-placeholder border border-brand-gold/30 bg-brand-gold-lt/30 rounded-sm px-6 py-5 flex items-start gap-4"
    >
      <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-brand-gold-dk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      </div>
      <div>
        <p className="font-sans font-medium text-sm text-brand-dark mb-0.5">Flexible payment plans available</p>
        <p className="font-sans text-sm text-brand-muted">
          {/* TODO: Integrate Tabeo or Payl8r finance widget */}
          Spread the cost of your treatment over monthly instalments. Ask at your consultation for details.
        </p>
      </div>
    </div>
  )
}
