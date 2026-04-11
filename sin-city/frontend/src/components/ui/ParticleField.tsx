import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  color: string
  drift: number
}

const NEON_COLORS = ['#FF006E', '#00F5FF', '#FFD700', '#BF00FF', '#00FF88']
const SMOKE_COLORS = ['#8B7355', '#6B5B45', '#5A4A3A', '#998877', '#776655']

interface ParticleFieldProps {
  count?: number
  className?: string
  variant?: 'neon' | 'smoke'
}

export default function ParticleField({ count = 150, className = '', variant = 'neon' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = variant === 'smoke' ? SMOKE_COLORS : NEON_COLORS

    // Init particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: variant === 'smoke'
        ? 0.1 + Math.random() * 0.25
        : 0.2 + Math.random() * 0.6,
      size: variant === 'smoke'
        ? 15 + Math.random() * 40
        : 1 + Math.random() * 2,
      opacity: variant === 'smoke'
        ? 0.02 + Math.random() * 0.06
        : 0.3 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 0.3,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        p.y -= p.speed
        p.x += p.drift

        if (p.y < -60) {
          p.y = canvas.height + 60
          p.x = Math.random() * canvas.width
        }
        if (p.x < -60) p.x = canvas.width + 60
        if (p.x > canvas.width + 60) p.x = -60

        if (variant === 'smoke') {
          // Soft, blurry smoke puffs
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          grad.addColorStop(0, p.color)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.globalAlpha = p.opacity
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.opacity
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count, variant])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
