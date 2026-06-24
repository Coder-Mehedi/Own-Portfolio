import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'
import { revealUp } from '../lib/animations'

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.23-3.17-.12-.3-.53-1.51.12-3.15 0 0 1-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.28-1.53 3.29-1.21 3.29-1.21.65 1.64.24 2.85.12 3.15.77.83 1.23 1.88 1.23 3.17 0 4.54-2.81 5.53-5.49 5.83.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .31.21.68.83.56A12.04 12.04 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Connected-dot canvas (lightweight, no Three.js)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = window.devicePixelRatio || 1
    let w = 0
    let h = 0
    let raf = 0
    type Dot = { x: number; y: number; vx: number; vy: number }
    let dots: Dot[] = []

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(46, Math.floor((w * h) / 26000))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    const render = () => {
      raf = requestAnimationFrame(render)
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > w) d.vx *= -1
        if (d.y < 0 || d.y > h) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 229, 204, 0.55)'
        ctx.fill()
        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j]
          const dx = d.x - e.x
          const dy = d.y - e.y
          const dist = Math.hypot(dx, dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(d.x, d.y)
            ctx.lineTo(e.x, e.y)
            ctx.strokeStyle = `rgba(0, 229, 204, ${0.18 * (1 - dist / 130)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    resize()
    if (!reduced) render()
    else render()
    const onResize = () => resize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Magnetic glow
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
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      glow.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move, { passive: true })
    glow.classList.add('active')
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    revealUp(headingRef.current)
    revealUp(ctaRef.current, { delay: 0.15 })
  }, [])

  return (
    <section
      id="contact"
      className="section section-pad flex-col items-center overflow-hidden"
      aria-label="Contact"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      <div ref={glowRef} className="hero-glow" aria-hidden="true" />

      <div className="container-x relative flex flex-col items-center text-center" style={{ zIndex: 2 }}>
        <span className="eyebrow inline-flex">Contact</span>
        <h2
          ref={headingRef}
          className="mt-8 font-display font-extrabold leading-[0.92] tracking-tight max-w-4xl"
          style={{ fontSize: 'clamp(2.5rem, 7.5vw, 6rem)' }}
        >
          Let's build something <span className="text-gradient">remarkable</span>.
        </h2>

        <div ref={ctaRef} className="mt-12 flex flex-col items-center gap-10">
          <a
            href="mailto:hello@mehedi.dev"
            className="contact-email glass group relative inline-flex items-center gap-3 rounded-full pl-7 pr-8 py-4 font-display font-bold text-[var(--text-primary)] transition-all duration-300 hover:border-[rgba(0,229,204,0.45)] hover:shadow-[0_0_40px_-8px_var(--accent-glow)]"
            style={{ fontSize: 'clamp(1rem, 2.6vw, 1.6rem)' }}
            data-cursor-hover
          >
            <span className="status-dot" aria-hidden="true" />
            hello@mehedi.dev
            <span aria-hidden="true" className="text-[var(--accent)]">→</span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOCIALS.map((s) => (
              <SocialPill key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialPill({
  label,
  href,
  icon,
}: {
  label: string
  href: string
  icon: ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const enter = () => gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)' })
    el.addEventListener('mouseenter', enter)
    return () => el.removeEventListener('mouseenter', enter)
  }, [])
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor-hover
      className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[rgba(0,229,204,0.4)] transition-colors"
    >
      {icon}
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
    </a>
  )
}
