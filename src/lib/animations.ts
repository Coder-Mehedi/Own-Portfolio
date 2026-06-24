import { gsap } from 'gsap'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Robust scroll reveal: default visible, animates from hidden -> visible. */
export function revealUp(
  el: gsap.TweenTarget,
  options: Partial<gsap.TweenVars> = {}
) {
  if (prefersReducedMotion()) return null
  return gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el as unknown as HTMLElement,
        start: 'top 85%',
      },
      ...options,
    }
  )
}

/** Staggered scroll reveal for a group of elements. */
export function revealStagger(
  els: gsap.TweenTarget,
  options: Partial<gsap.TweenVars> = {}
) {
  if (prefersReducedMotion()) return null
  return gsap.fromTo(
    els,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: els as unknown as HTMLElement,
        start: 'top 85%',
      },
      ...options,
    }
  )
}

/** Draw a vertical line via scaleY. */
export function drawLine(el: gsap.TweenTarget) {
  if (prefersReducedMotion()) return null
  return gsap.fromTo(
    el,
    { scaleY: 0, transformOrigin: 'top' },
    {
      scaleY: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el as unknown as HTMLElement,
        start: 'top 80%',
      },
    }
  )
}

/** Animate a number from 0 to target. */
export function counterAnim(
  setter: (val: number) => void,
  target: number,
  options: Partial<gsap.TweenVars> = {}
) {
  if (prefersReducedMotion()) {
    setter(target)
    return null
  }
  const obj = { value: 0 }
  return gsap.to(obj, {
    value: target,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => setter(Math.round(obj.value)),
    ...options,
  })
}
