import { useState, useCallback, useRef, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function TextScramble({ text, className = '', as: Tag = 'span' }) {
  const [display, setDisplay] = useState(text)
  const intervalRef = useRef(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    frameRef.current = 0
    const duration = text.length * 2.5
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / duration
      const revealed = Math.floor(progress * text.length)

      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < revealed) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )

      if (frameRef.current >= duration) {
        clearInterval(intervalRef.current)
        setDisplay(text)
      }
    }, 28)
  }, [text])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return (
    <Tag className={className} onMouseEnter={scramble}>
      {display}
    </Tag>
  )
}
