import { useEffect, useRef } from 'react'

// Matches --accent (#547eef) in src/index.css — the site has no dark-mode
// toggle wired up in practice, so this is a fixed value rather than a
// theme-reactive one.
const ACCENT_RGB = '84, 126, 239'

// Ambient particle-network animation used as the generated-visual stand-in
// for the homepage hero and peptide detail hero. Pure Canvas, no external
// assets, so it ships without depending on any generated image/video pipeline.
export default function MolecularField({ density = 1, cluster = false, maxDistance, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let nodes = []
    let linkDistance = maxDistance
    let rafId = null

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function build() {
      const area = width * height
      const count = Math.max(6, Math.min(80, Math.round((area / 15000) * density)))
      nodes = []
      for (let i = 0; i < count; i++) {
        let x
        let y
        if (cluster) {
          const cx = width * 0.68
          const cy = height * 0.5
          x = cx + (Math.random() - 0.5) * width * 0.6
          y = cy + (Math.random() - 0.5) * height * 0.9
        } else {
          x = Math.random() * width
          y = Math.random() * height
        }
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1.1 + Math.random() * 1.9,
        })
      }
      linkDistance = maxDistance || Math.min(150, Math.max(90, width * 0.12))
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < linkDistance) {
            const alpha = (1 - d / linkDistance) * 0.16
            ctx.strokeStyle = `rgba(${ACCENT_RGB}, ${alpha.toFixed(3)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const p of nodes) {
        ctx.fillStyle = `rgba(${ACCENT_RGB}, 0.6)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function frame() {
      step()
      draw()
      rafId = requestAnimationFrame(frame)
    }

    function start() {
      if (rafId || reduceMotion) return
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    resize()
    build()
    if (reduceMotion) {
      draw()
    } else {
      start()
    }

    const ro = new ResizeObserver(() => {
      resize()
      build()
      if (reduceMotion) draw()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion) start()
        else stop()
      },
      { threshold: 0.02 },
    )
    io.observe(canvas)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [density, cluster, maxDistance])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
