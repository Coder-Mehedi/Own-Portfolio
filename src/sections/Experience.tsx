import { useRef } from 'react'
import { useGSAP } from '../lib/hooks/useGSAP'
import { drawLine, revealUp } from '../lib/animations'
import { TimelineEntry } from '../components/TimelineEntry'

const entries = [
  {
    company: 'Vivasoft Limited',
    role: 'Senior SWE (Frontend L-I)',
    period: 'Jan 2024 — Present',
    description:
      'Leading frontend development on AI Producer, a real-time video broadcast platform with live rundown management.',
    tags: ['Aurelia.js', 'Redux', 'WebSockets'],
  },
  {
    company: 'Vivasoft Limited',
    role: 'Software Engineer (L-II)',
    period: 'May 2022 — Dec 2023',
    description:
      'Built and maintained multiple client-facing React and Next.js applications across diverse industries.',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
  {
    company: 'Lemon Hive',
    role: 'Frontend Developer',
    period: 'Jun 2020 — Apr 2022',
    description:
      'Developed responsive, performant web interfaces for clients across e-commerce and SaaS.',
    tags: ['JavaScript', 'SCSS', 'UI'],
  },
  {
    company: 'E-soft Arena',
    role: 'Frontend Intern',
    period: 'Feb — Apr 2019',
    description: 'Learned the foundations of component-based UI development and modern workflows.',
    tags: ['HTML', 'CSS', 'JS'],
  },
]

export function Experience() {
  const lineRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    drawLine(lineRef.current)
    revealUp(headingRef.current)
  }, [])

  return (
    <section id="experience" className="section section-pad" aria-label="Experience">
      <div className="container-x">
        <div className="section-head">
          <span className="eyebrow inline-flex">Experience</span>
          <h2
            ref={headingRef}
            className="font-display font-bold text-[var(--text-primary)] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            The <span className="text-gradient">Journey</span>
          </h2>
        </div>

        <div className="relative pl-8">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-[var(--accent)] via-[var(--accent-dim)] to-transparent"
            aria-hidden="true"
          />
          {entries.map((entry, i) => (
            <TimelineEntry key={`${entry.company}-${i}`} index={i} {...entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
