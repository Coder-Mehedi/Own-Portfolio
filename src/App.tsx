import { useEffect, useRef, useState, useCallback } from 'react'
import { CustomCursor } from './components/CustomCursor'
import { Preloader } from './sections/Preloader'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Work } from './sections/Work'
import { Skills } from './sections/Skills'
import { Experience } from './sections/Experience'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9997] bg-transparent" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const handleEntered = useCallback(() => setEntered(true), [])

  return (
    <>
      <Preloader onDone={handleEntered} />
      <CustomCursor />
      <ScrollProgress />
      <main id="top">
        <Hero entered={entered} />
        <About />
        <Work />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
