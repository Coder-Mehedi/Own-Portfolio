import { useEffect } from 'react'
import { gsap } from 'gsap'

export function useGSAP(fn: (ctx: gsap.Context) => void, deps: unknown[] = []) {
  useEffect(() => {
    const ctx = gsap.context(fn)
    return () => {
      ctx.revert()
    }
  }, deps)
}
