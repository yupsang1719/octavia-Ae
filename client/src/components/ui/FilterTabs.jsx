import { useEffect, useRef, useState } from 'react'

export default function FilterTabs({ tabs, active, onChange }) {
  const containerRef = useRef(null)
  const activeRef = useRef(null)

  // Re-run clip-path calculation whenever active changes
  useEffect(() => {
    const container = containerRef.current
    const activeEl = activeRef.current
    if (!container || !activeEl) return

    const { offsetLeft, offsetWidth } = activeEl
    const clipLeft  = offsetLeft
    const clipRight = offsetLeft + offsetWidth
    const total     = container.offsetWidth

    container.style.clipPath = `inset(0 ${(100 - (clipRight / total) * 100).toFixed(1)}% 0 ${((clipLeft / total) * 100).toFixed(1)}% round 999px)`
  }, [active])

  return (
    <div className="relative inline-flex items-center bg-brand-cream border border-brand-border/60 rounded-full p-1">
      {/* Animated green overlay layer */}
      <div
        ref={containerRef}
        className="absolute inset-1 overflow-hidden rounded-full pointer-events-none z-10"
        style={{
          clipPath: 'inset(0 100% 0 0% round 999px)',
          transition: 'clip-path 0.28s ease',
        }}
      >
        <div className="flex w-full h-full bg-brand-green rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              className="flex-1 shrink-0 px-5 py-2.5 text-sm font-sans font-medium text-white whitespace-nowrap"
              tabIndex={-1}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Actual clickable buttons */}
      <div className="relative z-20 flex">
        {tabs.map((tab) => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              ref={isActive ? activeRef : null}
              onClick={() => onChange(tab)}
              className="px-5 py-2.5 text-sm font-sans font-medium text-brand-muted cursor-pointer rounded-full transition-colors duration-150 hover:text-brand-dark whitespace-nowrap"
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
