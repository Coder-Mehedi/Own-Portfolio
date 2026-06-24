import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'
import { ProjectCard } from '../components/ProjectCard'

const projects = [
  {
    number: '01',
    title: 'AI Producer',
    description:
      'Web-based live video broadcast and production platform. Real-time rundown management, iframe preview, and Redux-style state architecture.',
    techStack: ['Aurelia.js', 'Node.js', 'Redux', 'WebSockets'],
  },
  {
    number: '02',
    title: 'Codebase RAG Tool',
    description:
      'Internal AI Q&A assistant over a private codebase. Embeddings via @xenova/transformers, vector search with Supabase pgvector, LLM via OpenRouter.',
    techStack: ['Next.js 14', 'Supabase', 'pgvector', 'OpenRouter'],
  },
  {
    number: '03',
    title: 'Self-Hosted Server Stack',
    description:
      'Containerized home server with Nginx reverse proxy, SSL termination, Docker-hosted services routed via custom domain.',
    techStack: ['Docker', 'Nginx', 'SSL', 'Linux'],
  },
  {
    number: '04',
    title: 'MT5 Gold Trading EA',
    description:
      'Automated Expert Advisor for Gold (XAUUSD) using ICT concepts. MQL5 integration, diagnostic logging, VPS-ready.',
    techStack: ['MQL5', 'MetaTrader 5', 'Algorithmic Trading'],
  },
]

export function Work() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean }
        const wrapper = wrapperRef.current
        const track = trackRef.current
        if (!wrapper || !track) return

        if (isDesktop && !reduced) {
          const getScrollAmount = () => track.scrollWidth - window.innerWidth

          const tween = gsap.to(track, {
            x: () => -getScrollAmount(),
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: () => `+=${getScrollAmount()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          return () => {
            tween.kill()
          }
        }
      }
    )

    if (headingRef.current && !reduced) {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 90%' },
      })
    }
  }, [])

  return (
    <section id="work" className="relative" aria-label="Selected Work">
      <div
        ref={wrapperRef}
        className="w-full flex flex-col py-24 md:py-0 md:h-screen md:min-h-[640px] md:overflow-hidden md:justify-center"
      >
        <div className="section-pad section-head flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow inline-flex">Selected Work</span>
            <h2
              ref={headingRef}
              className="font-display font-bold text-[var(--text-primary)] leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              Things I've <span className="text-gradient">Built</span>
            </h2>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Scroll to explore
            <span aria-hidden="true">→</span>
          </span>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col md:flex-row gap-8 section-pad will-change-transform"
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              index={i}
              number={p.number}
              title={p.title}
              description={p.description}
              techStack={p.techStack}
            />
          ))}
          <div className="hidden md:block md:flex-shrink-0 md:w-[35vw]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
