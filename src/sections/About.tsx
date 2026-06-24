import { useRef } from 'react'
import { useGSAP } from '../lib/hooks/useGSAP'
import { revealUp, revealStagger, counterAnim } from '../lib/animations'

const stats = [
  { target: 5, suffix: '+', label: 'Years building for the web' },
  { target: 10, suffix: '+', label: 'Products shipped' },
  { target: 3, suffix: '', label: 'Companies & teams' },
]

export function About() {
  const leftRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statRefs = useRef<HTMLSpanElement[]>([])

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      statRefs.current.forEach((el, i) => {
        if (el) el.textContent = `${stats[i].target}${stats[i].suffix}`
      })
      return
    }

    revealUp(leftRef.current)
    revealStagger(cardsRef.current?.children ?? [], { stagger: 0.12 })

    statRefs.current.forEach((el, i) => {
      if (!el) return
      counterAnim(
        (val) => {
          el.textContent = `${val}${stats[i].suffix}`
        },
        stats[i].target,
        { scrollTrigger: { trigger: el, start: 'top 90%' } }
      )
    })
  }, [])

  return (
    <section id="about" className="section section-pad dot-grid" aria-label="About Mehedi Hasan">
      <div className="container-x grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
        <div ref={leftRef}>
          <span className="eyebrow inline-flex">About</span>
          <h2
            className="mt-6 font-display font-extrabold text-[var(--text-primary)] leading-[0.98] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            I build interfaces that <span className="text-gradient">feel alive</span>.
          </h2>
          <p className="mt-7 font-body text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl">
            I'm a frontend engineer based in{' '}
            <span className="text-[var(--text-primary)] font-medium">Rajshahi, Bangladesh</span>. I
            build fast, accessible, and visually precise interfaces — currently crafting AI-powered
            video production tools at Vivasoft. Lately I've been pushing into AI/ML, RAG systems,
            and the architecture that makes intelligent products feel effortless.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 glass rounded-full pl-3 pr-5 py-2.5">
            <span className="status-dot" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Currently · AI Producer @ Vivasoft
            </span>
          </div>
        </div>

        <div ref={cardsRef} className="flex flex-col gap-5">
          {stats.map((stat, i) => (
            <div key={stat.label} className="glass card-sheen rounded-2xl p-7 flex items-center gap-6">
              <span
                ref={(el) => {
                  if (el) statRefs.current[i] = el
                }}
                className="text-accent-gradient font-display font-extrabold leading-none tabular-nums"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
              >
                0{stat.suffix}
              </span>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[var(--muted)] leading-relaxed">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
