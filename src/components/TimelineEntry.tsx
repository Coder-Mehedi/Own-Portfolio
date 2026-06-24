import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'
import { revealUp } from '../lib/animations'

interface TimelineEntryProps {
  company: string
  role: string
  period: string
  description: string
  tags: string[]
  index: number
}

export function TimelineEntry({ company, role, period, description, tags, index }: TimelineEntryProps) {
  const entryRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const badge = company.charAt(0)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    revealUp(entryRef.current, { delay: index * 0.08 })
    if (dotRef.current) {
      gsap.fromTo(
        dotRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: index * 0.08,
          scrollTrigger: { trigger: entryRef.current, start: 'top 88%' },
        }
      )
    }
  }, [index])

  return (
    <article ref={entryRef} className="relative pl-12 sm:pl-16 pb-8 last:pb-0">
      <span
        ref={dotRef}
        className="absolute left-[-6px] top-6 w-3.5 h-3.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)] shadow-[0_0_12px_var(--accent)]"
        aria-hidden="true"
      />
      <div className="glass card-sheen rounded-2xl p-6 sm:p-7 transition-colors duration-300 hover:border-[rgba(0,229,204,0.3)]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg text-[var(--accent)] border border-[rgba(0,229,204,0.25)] bg-[rgba(0,229,204,0.06)]">
            {badge}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {company}
              </h3>
              <span className="pill">{period}</span>
            </div>
            <p className="font-mono text-sm text-accent-gradient mt-1">{role}</p>
            <p className="mt-3 font-body text-[0.95rem] text-[var(--text-secondary)] leading-relaxed">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="font-mono text-[0.7rem] px-2.5 py-1 rounded-md text-[var(--muted)] border border-[var(--line)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
