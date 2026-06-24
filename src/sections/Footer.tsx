const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--line)] section-pad py-14" aria-label="Site footer">
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <a
              href="#top"
              className="font-display font-extrabold text-[var(--text-primary)] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Mehedi Hasan<span className="text-[var(--accent)]">.</span>
            </a>
            <p className="mt-3 font-body text-[var(--text-secondary)] max-w-sm">
              Frontend engineer building fast, accessible, AI-powered interfaces.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--line)]">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] text-center sm:text-left">
            © 2025 Mehedi Hasan · Built with React, GSAP & Three.js
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            Back to top
            <span className="transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
