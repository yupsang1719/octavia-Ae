import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltEffect({
  children,
  tiltFactor = 7,
  perspective = 1200,
}) {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const spring = { damping: 28, stiffness: 380, mass: 0.4 }
  const xSpring = useSpring(x, spring)
  const ySpring = useSpring(y, spring)

  const rotateX = useTransform(ySpring, [-size.height / 2, size.height / 2], [tiltFactor, -tiltFactor])
  const rotateY = useTransform(xSpring, [-size.width / 2, size.width / 2], [-tiltFactor, tiltFactor])

  useEffect(() => {
    const update = () => {
      if (ref.current) setSize({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const onMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - size.width / 2)
    y.set(e.clientY - rect.top - size.height / 2)
  }

  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ perspective, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </motion.div>
  )
}
