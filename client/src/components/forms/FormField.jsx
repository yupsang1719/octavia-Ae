export default function FormField({ label, error, required, children }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-sans font-medium text-brand-dark mb-1">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
