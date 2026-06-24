import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'
import { SkillConstellation } from '../components/SkillConstellation'

const skillGroups = [
  {
    label: '// frontend core',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Aurelia.js'],
  },
  {
    label: '// devops & infra',
    items: ['Docker', 'Nginx', 'OpenShift', 'Linux', 'Git'],
  },
  {
    label: '// ai & tooling',
    items: ['RAG', 'pgvector', 'OpenRouter', 'LangChain', 'FastAPI'],
  },
]

export function Skills() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !headingRef.current) return
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
    })
  }, [])

  return (
    <section
      className="section section-pad flex-col items-center"
      id="skills"
      aria-label="Skills & Tools"
    >
      <div className="container-x flex flex-col items-center">
        <div className="section-head text-center flex flex-col items-center">
          <span className="eyebrow inline-flex">Skills &amp; Tools</span>
          <h2
            ref={headingRef}
            className="font-display font-bold text-[var(--text-primary)] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            The <span className="text-gradient">Stack</span>
          </h2>
        </div>

        {/* Desktop: constellation */}
        <div className="hidden md:block w-full">
          <SkillConstellation />
        </div>

        {/* Mobile: simplified list */}
        <div className="md:hidden space-y-8">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
                {group.label}
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="pill">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
