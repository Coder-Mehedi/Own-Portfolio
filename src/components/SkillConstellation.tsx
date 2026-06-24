import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '../lib/hooks/useGSAP'

interface Node {
  id: string
  label: string
  x: number
  y: number
}

interface Edge {
  from: string
  to: string
}

interface Cluster {
  id: string
  label: string
  color: string
}

const clusters: Cluster[] = [
  { id: 'frontend', label: '// frontend core', color: '#00E5CC' },
  { id: 'devops', label: '// devops & infra', color: '#00E5CC' },
  { id: 'ai', label: '// ai & tooling', color: '#00E5CC' },
]

const nodes: Node[] = [
  // frontend core (left cluster)
  { id: 'react', label: 'React', x: 140, y: 200 },
  { id: 'next', label: 'Next.js', x: 280, y: 135 },
  { id: 'ts', label: 'TypeScript', x: 150, y: 330 },
  { id: 'tailwind', label: 'Tailwind', x: 290, y: 270 },
  { id: 'aurelia', label: 'Aurelia.js', x: 400, y: 215 },
  // devops & infra (top-right cluster)
  { id: 'docker', label: 'Docker', x: 580, y: 185 },
  { id: 'nginx', label: 'Nginx', x: 770, y: 120 },
  { id: 'openshift', label: 'OpenShift', x: 880, y: 175 },
  { id: 'linux', label: 'Linux', x: 790, y: 210 },
  { id: 'git', label: 'Git', x: 640, y: 105 },
  // ai & tooling (bottom-right cluster)
  { id: 'rag', label: 'RAG', x: 575, y: 430 },
  { id: 'pgvector', label: 'pgvector', x: 790, y: 450 },
  { id: 'openrouter', label: 'OpenRouter', x: 790, y: 360 },
  { id: 'langchain', label: 'LangChain', x: 640, y: 355 },
  { id: 'fastapi', label: 'FastAPI', x: 650, y: 490 },
]

const edges: Edge[] = [
  // frontend
  { from: 'react', to: 'next' },
  { from: 'react', to: 'ts' },
  { from: 'react', to: 'tailwind' },
  { from: 'next', to: 'ts' },
  { from: 'ts', to: 'aurelia' },
  { from: 'react', to: 'aurelia' },
  // devops
  { from: 'docker', to: 'nginx' },
  { from: 'docker', to: 'openshift' },
  { from: 'docker', to: 'linux' },
  { from: 'git', to: 'docker' },
  { from: 'nginx', to: 'linux' },
  // ai
  { from: 'rag', to: 'pgvector' },
  { from: 'rag', to: 'langchain' },
  { from: 'rag', to: 'openrouter' },
  { from: 'langchain', to: 'fastapi' },
  { from: 'pgvector', to: 'fastapi' },
  // cross-cluster bridges
  { from: 'next', to: 'docker' },
  { from: 'ts', to: 'langchain' },
]

const nodeById = (id: string) => nodes.find((n) => n.id === id)!

export function SkillConstellation() {
  const svgRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const svg = svgRef.current
    if (!svg) return

    const lines = svg.querySelectorAll<SVGLineElement>('.constellation-line')
    const nodeGroups = svg.querySelectorAll<SVGGElement>('.constellation-node')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // nodes/lines visible by default

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 75%',
      },
    })

    tl.fromTo(
      lines,
      { opacity: 0 },
      { opacity: 0.4, duration: 0.6, ease: 'power2.out' }
    ).fromTo(
      nodeGroups,
      { scale: 0, transformOrigin: 'center' },
      { scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.05 },
      '-=0.3'
    )
  }, [])

  const handleNodeHover = (id: string) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const svg = svgRef.current
    if (!svg) return
    const connectedIds = new Set<string>([id])
    edges.forEach((e) => {
      if (e.from === id) connectedIds.add(e.to)
      if (e.to === id) connectedIds.add(e.from)
    })

    svg.querySelectorAll<SVGLineElement>('.constellation-line').forEach((line) => {
      const from = line.dataset.from
      const to = line.dataset.to
      const isConnected = from === id || to === id
      gsap.to(line, { opacity: isConnected ? 1 : 0.08, duration: 0.3 })
    })

    svg.querySelectorAll<SVGGElement>('.constellation-node').forEach((g) => {
      const connected = connectedIds.has(g.dataset.id!)
      gsap.to(g, { opacity: connected ? 1 : 0.25, duration: 0.3 })
    })
  }

  const handleNodeLeave = () => {
    const svg = svgRef.current
    if (!svg) return
    gsap.to(svg.querySelectorAll('.constellation-line'), { opacity: 0.35, duration: 0.3 })
    gsap.to(svg.querySelectorAll('.constellation-node'), { opacity: 1, duration: 0.3 })
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 940 520"
      className="w-full h-auto max-w-6xl mx-auto"
      aria-label="Skills constellation graph"
      role="img"
      onMouseLeave={handleNodeLeave}
    >
      {edges.map((edge, i) => {
        const a = nodeById(edge.from)
        const b = nodeById(edge.to)
        return (
          <line
            key={`edge-${i}`}
            className="constellation-line transition-[filter] duration-300"
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#00E5CC"
            strokeWidth={1.5}
            data-from={edge.from}
            data-to={edge.to}
            opacity={0}
          />
        )
      })}

      {nodes.map((node) => (
        <g
          key={node.id}
          className="constellation-node cursor-pointer"
          data-id={node.id}
          transform={`translate(${node.x}, ${node.y})`}
          onMouseEnter={() => handleNodeHover(node.id)}
          onFocus={() => handleNodeHover(node.id)}
          onBlur={handleNodeLeave}
          tabIndex={0}
          role="button"
          aria-label={node.label}
        >
          <circle
            r={8}
            fill="#06080b"
            stroke="#00E5CC"
            strokeWidth={2}
            className="transition-[filter] duration-300 hover:drop-shadow-[0_0_10px_#00E5CC]"
          />
          <text
            y={-18}
            textAnchor="middle"
            className="font-mono"
            fontSize={15}
            fill="#E8E4DC"
          >
            {node.label}
          </text>
        </g>
      ))}

      {clusters.map((c) => {
        const pos =
          c.id === 'frontend'
            ? { x: 255, y: 78 }
            : c.id === 'devops'
              ? { x: 720, y: 45 }
              : { x: 715, y: 300 }
        return (
          <text
            key={c.id}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            className="font-mono"
            fontSize={13}
            fill="#5A6478"
            opacity={0.8}
          >
            {c.label}
          </text>
        )
      })}
    </svg>
  )
}
