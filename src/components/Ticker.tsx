export function Ticker() {
  const items = [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Docker',
    'AI/ML',
    'Aurelia.js',
    'Node.js',
  ]

  return (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <div className="ticker-track flex items-center gap-10">
        {Array.from({ length: 2 }).map((_, dup) => (
          <div key={dup} className="flex items-center gap-10" aria-hidden="true">
            {items.map((item, i) => (
              <span key={`${item}-${i}-${dup}`} className="flex items-center gap-10">
                <span className="font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)] whitespace-nowrap">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
