import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useHeroScene(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768
    const nodeCount = isMobile ? 40 : 90
    const enableRepulsion = !isMobile
    const linkThreshold = isMobile ? 2.0 : 1.7

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      })
    } catch {
      return // WebGL unavailable — CSS gradient background remains
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6

    // Circular sprite texture for soft glowing dots
    const makeDotTexture = () => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }
    const dotTexture = makeDotTexture()

    // Nodes
    const positions = new Float32Array(nodeCount * 3)
    const origins: THREE.Vector3[] = []
    const velocities: THREE.Vector3[] = []
    const spreadX = 9
    const spreadY = 6
    const spreadZ = 3

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * spreadX * 2
      const y = (Math.random() - 0.5) * spreadY * 2
      const z = (Math.random() - 0.5) * spreadZ * 2
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      origins.push(new THREE.Vector3(x, y, z))
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.002
        )
      )
    }

    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const nodeMat = new THREE.PointsMaterial({
      size: isMobile ? 0.14 : 0.12,
      map: dotTexture,
      color: 0x00e5cc,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(nodeGeo, nodeMat)
    scene.add(points)

    // Connection lines (dynamic)
    const maxSegments = nodeCount * 8
    const linePositions = new Float32Array(maxSegments * 6)
    const lineColors = new Float32Array(maxSegments * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    const mouse = new THREE.Vector2(0, 0)
    const camTarget = new THREE.Vector3(0, 0, 6)

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      camTarget.x = mouse.x * 0.8
      camTarget.y = mouse.y * 0.6
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    if (enableRepulsion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }
    window.addEventListener('resize', onResize, { passive: true })

    let rafId = 0
    const repelOrigin = new THREE.Vector3()
    const tmp = new THREE.Vector3()
    const colorObj = new THREE.Color(0x00e5cc)

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      camera.position.lerp(camTarget, 0.04)
      camera.lookAt(0, 0, 0)

      if (enableRepulsion) {
        repelOrigin.set(mouse.x * spreadX, mouse.y * spreadY, 4)
      }

      const posAttr = nodeGeo.getAttribute('position') as THREE.BufferAttribute
      const posArr = positions

      for (let i = 0; i < nodeCount; i++) {
        const ix = i * 3
        const v = velocities[i]
        posArr[ix] += v.x
        posArr[ix + 1] += v.y
        posArr[ix + 2] += v.z

        // spring back toward origin
        posArr[ix] += (origins[i].x - posArr[ix]) * 0.01
        posArr[ix + 1] += (origins[i].y - posArr[ix + 1]) * 0.01
        posArr[ix + 2] += (origins[i].z - posArr[ix + 2]) * 0.01

        if (enableRepulsion) {
          tmp.set(posArr[ix] - repelOrigin.x, posArr[ix + 1] - repelOrigin.y, posArr[ix + 2] - repelOrigin.z)
          const d = tmp.length()
          if (d < 2.2 && d > 0.001) {
            const f = (2.2 - d) * 0.04
            posArr[ix] += (tmp.x / d) * f
            posArr[ix + 1] += (tmp.y / d) * f
            posArr[ix + 2] += (tmp.z / d) * f
          }
        }
      }
      posAttr.needsUpdate = true

      // rebuild connection lines
      let seg = 0
      const thr2 = linkThreshold * linkThreshold
      for (let i = 0; i < nodeCount; i++) {
        const ix = i * 3
        for (let j = i + 1; j < nodeCount; j++) {
          if (seg >= maxSegments) break
          const jx = j * 3
          const dx = posArr[ix] - posArr[jx]
          const dy = posArr[ix + 1] - posArr[jx + 1]
          const dz = posArr[ix + 2] - posArr[jx + 2]
          const d2 = dx * dx + dy * dy + dz * dz
          if (d2 < thr2) {
            const o = seg * 6
            linePositions[o] = posArr[ix]
            linePositions[o + 1] = posArr[ix + 1]
            linePositions[o + 2] = posArr[ix + 2]
            linePositions[o + 3] = posArr[jx]
            linePositions[o + 4] = posArr[jx + 1]
            linePositions[o + 5] = posArr[jx + 2]

            const brightness = 1 - Math.sqrt(d2) / linkThreshold
            colorObj.setRGB(0, 0.9 * brightness, 0.8 * brightness)
            lineColors[o] = colorObj.r
            lineColors[o + 1] = colorObj.g
            lineColors[o + 2] = colorObj.b
            lineColors[o + 3] = colorObj.r
            lineColors[o + 4] = colorObj.g
            lineColors[o + 5] = colorObj.b
            seg++
          }
        }
      }
      ;(lineGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
      ;(lineGeo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true
      lineGeo.setDrawRange(0, seg * 2)

      renderer.render(scene, camera)
    }

    if (!prefersReducedMotion()) {
      rafId = requestAnimationFrame(animate)
    } else {
      renderer.render(scene, camera)
    }

    return () => {
      cancelAnimationFrame(rafId)
      if (enableRepulsion) window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      nodeGeo.dispose()
      nodeMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      dotTexture.dispose()
      renderer.dispose()
    }
  }, [canvasRef])
}
