import { useRef } from 'react'
import { useCustomCursor } from '../lib/hooks/useCustomCursor'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useCustomCursor(dotRef, badgeRef)

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={badgeRef} className="cursor-badge" aria-hidden="true">
        VIEW →
      </div>
    </>
  )
}
