import { useRef, useState } from 'react'
import { gsap } from 'gsap'

interface ProjectCardProps {
  index: number
  title: string
  description: string
  techStack: string[]
  number: string
}

export function ProjectCard({ title, description, techStack, number }: ProjectCardProps) {
  const arrowRef = useRef<SVGSVGElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out' })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { rotation: -45, duration: 0.3, ease: 'power2.out' })
    }
  }

  return (
    <article
      className="glass card-sheen relative w-full md:w-[420px] md:flex-shrink-0 h-[440px] rounded-3xl p-8 md:p-9 flex flex-col justify-between transition-all duration-300 ease-out"
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 0 0 1px rgba(0,229,204,0.4), 0 30px 60px -15px rgba(0,229,204,0.25), 0 20px 40px rgba(0,0,0,0.5)'
          : '0 20px 50px rgba(0,0,0,0.35)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-hover
      aria-label={`Project ${number}: ${title}`}
    >
      <span
        className="absolute -top-6 right-6 font-display font-extrabold leading-none select-none pointer-events-none"
        style={{
          fontSize: '9rem',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(0,229,204,0.18)',
        }}
        aria-hidden
      >
        {number}
      </span>

      <div className="relative z-10">
        <span className="pill mb-6 inline-block">Project {number}</span>
        <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
          {title}
        </h3>
        <p className="font-body text-[0.95rem] text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-2 max-w-[80%]">
          {techStack.map((tech, i) => (
            <span key={`${tech}-${i}`} className="pill">
              {tech}
            </span>
          ))}
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isHovered ? 'var(--accent)' : 'rgba(0,229,204,0.08)',
            border: '1px solid rgba(0,229,204,0.4)',
          }}
        >
          <svg
            ref={arrowRef}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isHovered ? 'text-[var(--bg)]' : 'text-[var(--accent)]'}
            style={{ transform: 'rotate(-45deg)' }}
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  )
}
