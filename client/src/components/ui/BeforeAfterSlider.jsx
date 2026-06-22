import { useState, useRef, useCallback } from 'react'

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before treatment',
  afterAlt  = 'After treatment',
  lazy      = true,
}) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseDown  = (e) => { setDragging(true); updatePosition(e.clientX) }
  const onMouseMove  = (e) => { if (dragging) updatePosition(e.clientX) }
  const onMouseUp    = ()  => setDragging(false)
  const onTouchStart = (e) => { setDragging(true); updatePosition(e.touches[0].clientX) }
  const onTouchMove  = (e) => { if (dragging) updatePosition(e.touches[0].clientX) }
  const onTouchEnd   = ()  => setDragging(false)

  const safePos = Math.max(1, Math.min(position, 99))

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-sm aspect-[4/3] select-none cursor-col-resize"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="img"
        aria-label={`Before and after comparison: ${beforeAlt} / ${afterAlt}`}
      >
        {/* After image — full width underneath */}
        <img
          src={afterSrc}
          alt={afterAlt}
          loading={lazy ? 'lazy' : 'eager'}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image — clipped to left of handle, no artificial filter */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${safePos}%` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            loading={lazy ? 'lazy' : 'eager'}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${10000 / safePos}%`, maxWidth: 'none' }}
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
          style={{ left: `${safePos}%` }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-none z-10"
          style={{ left: `${safePos}%` }}
        >
          <svg className="w-4 h-4 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l-6-6 6-6" />
            <path d="M15 6l6 6-6 6" />
          </svg>
        </div>

        {/* Labels */}
        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs font-sans px-2 py-0.5 rounded-full pointer-events-none">
          Before
        </span>
        <span className="absolute top-2 right-2 bg-brand-green/80 text-white text-xs font-sans px-2 py-0.5 rounded-full pointer-events-none">
          After
        </span>
      </div>

      <p className="text-center text-xs font-sans text-brand-subtle italic">
        Results may vary. Images published with written patient consent.
      </p>
    </div>
  )
}
