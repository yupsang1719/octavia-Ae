import { forwardRef } from 'react'

const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  gold:      'btn-gold',
  ghost:     'inline-flex items-center justify-center gap-2 px-6 py-3 text-brand-green font-sans font-medium transition-colors duration-300 hover:text-brand-green/70',
}

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
