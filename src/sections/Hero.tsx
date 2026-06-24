import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'
import { useHeroScene } from '../lib/hooks/useHeroScene'
import { Ticker } from '../components/Ticker'

const ROLES = [
  'Building interfaces that think.',
  'Shipping AI-powered products.',
  'Crafting accessible design systems.',
  'Exploring RAG & agents.',
]

interface HeroProps {
  entered: boolean
}

export function Hero({ entered }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const masksRef = useRef<HTMLSpanElement[]>([])
  const roleRef = useRef<HTMLSpanElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const scrollDotRef = useRef<HTMLSpanElement>(null)
  const [clock, setClock] = useState('')

  useHeroScene(canvasRef)

  // Live clock
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setClock(fmt())
    const id = setInterval(() => setClock(fmt()), 10000)
    return () => clearInterval(id)
  }, [])

  // Magnetic glow follows cursor
  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let raf = 0
    const move = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      glow.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Entrance + rotating role
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!entered || reduced) {
      if (glowRef.current && entered) glowRef.current.classList.add('active')
      return
    }
    if (glowRef.current) glowRef.current.classList.add('active')

    const tl = gsap.timeline()
    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo(
        masksRef.current,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 },
        '-=0.2'
      )
      .fromTo(
        [roleRef.current, metaRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
        '-=0.6'
      )

    // Rotating role line
    if (roleRef.current) {
      gsap
        .timeline({ repeat: -1, delay: 2 })
        .to({}, { duration: 2.2 })
        .to(roleRef.current, { opacity: 0, y: 10, duration: 0.35, ease: 'power2.in' })
        .call(() => {
          if (!roleRef.current) return
          const next = ROLES[Math.floor(Math.random() * ROLES.length)]
          roleRef.current.textContent = next
        })
        .to(roleRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
        .to({}, { duration: 2.4 })
    }
  }, [entered])

  // Scroll indicator loop
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !scrollDotRef.current) return
    gsap.to(scrollDotRef.current, {
      y: 24,
      duration: 1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden" aria-label="Hero">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />

      {/* Top status bar */}
      <div
        className="absolute top-0 inset-x-0 section-pad flex justify-between items-center py-6"
        style={{ zIndex: 20 }}
      >
        <span className="font-display font-bold text-[var(--text-primary)] text-lg tracking-tight">
          MH<span className="text-[var(--accent)]">.</span>
        </span>
        <div ref={metaRef} className="flex items-center gap-5">
          <span className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            <span className="status-dot" aria-hidden="true" />
            Available for work
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] tabular-nums">
            Rajshahi · {clock}
          </span>
        </div>
      </div>

      {/* Foreground */}
      <div
        className="relative h-full flex flex-col justify-center section-pad"
        style={{ zIndex: 10 }}
      >
        <span ref={eyebrowRef} className="eyebrow mb-6 self-start">
          Frontend Engineer
        </span>

        <h1
          className="font-display font-extrabold leading-[0.85] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 12rem)' }}
          aria-label="Mehedi Hasan"
        >
          <span className="hero-mask">
            <span
              ref={(el) => {
                if (el) masksRef.current[0] = el
              }}
              className="hero-mask-inner text-[var(--text-primary)]"
            >
              Mehedi
            </span>
          </span>
          <span className="hero-mask">
            <span
              ref={(el) => {
                if (el) masksRef.current[1] = el
              }}
              className="hero-mask-inner text-gradient"
            >
              Hasan
            </span>
          </span>
        </h1>

        <div className="mt-7 flex items-center gap-3 max-w-xl" style={{ opacity: entered ? 1 : 0 }}>
          <span className="text-[var(--accent)] font-mono">—</span>
          <span ref={roleRef} className="font-display font-medium text-[var(--text-secondary)]" style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.9rem)' }}>
            {ROLES[0]}
          </span>
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-14 left-0 right-0" style={{ zIndex: 10 }}>
        <Ticker />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-[clamp(1.5rem,7vw,7rem)] flex flex-col items-center gap-3"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <span className="font-mono text-xs text-[var(--muted)] [writing-mode:vertical-rl] rotate-180 tracking-widest">
          SCROLL
        </span>
        <div className="relative w-px h-14 bg-[rgba(255,255,255,0.12)] overflow-hidden">
          <span
            ref={scrollDotRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
          />
        </div>
      </div>
    </section>
  )
}
