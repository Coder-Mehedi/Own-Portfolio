import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

export function useCustomCursor(
  dotRef: RefObject<HTMLDivElement | null>,
  badgeRef: RefObject<HTMLDivElement | null>
) {
  const trailRefs = useRef<HTMLDivElement[]>([])
  const mousePos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const trailIndex = useRef(0)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return

    const dot = dotRef.current
    const badge = badgeRef.current
    if (!dot || !badge) return

    const trailCount = 8
    const container = document.body

    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.opacity = String(1 - i / trailCount)
      container.appendChild(trail)
      trailRefs.current.push(trail)
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnterHoverable = () => {
      badge.classList.add('active')
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }

    const onLeaveHoverable = () => {
      badge.classList.remove('active')
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    const update = () => {
      const { x, y } = mousePos.current

      gsap.set(dot, { x, y })
      gsap.set(badge, { x, y })

      const trail = trailRefs.current[trailIndex.current]
      if (trail) {
        gsap.set(trail, { x, y })
        gsap.fromTo(
          trail,
          { opacity: 0.7, scale: 1 },
          { opacity: 0, scale: 0.4, duration: 0.55, ease: 'power2.out' }
        )
      }
      trailIndex.current = (trailIndex.current + 1) % trailCount

      rafId.current = requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const hoverables = document.querySelectorAll('[data-cursor-hover]')
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onEnterHoverable)
      el.addEventListener('mouseleave', onLeaveHoverable)
    })

    rafId.current = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterHoverable)
        el.removeEventListener('mouseleave', onLeaveHoverable)
      })
      if (rafId.current) cancelAnimationFrame(rafId.current)
      trailRefs.current.forEach((el) => el.remove())
      trailRefs.current = []
    }
  }, [dotRef, badgeRef])
}
