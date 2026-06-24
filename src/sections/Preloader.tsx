import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'

interface PreloaderProps {
  onDone: () => void
}

export function Preloader({ onDone }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('visited')) {
      setDone(true)
      onDone()
    }
  }, [onDone])

  useGSAP(() => {
    if (done) return
    const text = textRef.current
    const overlay = overlayRef.current
    if (!text || !overlay) return

    sessionStorage.setItem('visited', '1')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      gsap.set(overlay, { display: 'none' })
      setDone(true)
      onDone()
      return
    }

    const tl = gsap.timeline()
    tl.to(text, {
      text: { value: '> initializing mehedi.dev...' },
      duration: 1.5,
      ease: 'none',
      delay: 0.2,
    })
      .to({}, { duration: 0.3 })
      .to(overlay, {
        y: '-100%',
        duration: 0.7,
        ease: 'power3.inOut',
        onStart: onDone,
        onComplete: () => setDone(true),
      })
  }, [done, onDone])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] bg-[var(--bg)] flex items-center justify-center"
      aria-hidden="true"
    >
      <span
        ref={textRef}
        className="cursor-blink font-mono text-[var(--accent)] text-base sm:text-lg"
      />
    </div>
  )
}
