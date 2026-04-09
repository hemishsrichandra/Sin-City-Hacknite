import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'
import GlowCard from '../components/ui/GlowCard'

const venues = [
  { name: 'NEON PULSE', genre: 'Techno', vibe: 8, cover: '$40', tags: ['TECHNO'] },
  { name: 'VELVET UNDERGROUND', genre: 'Hip-Hop', vibe: 7, cover: '$30', tags: ['HIP-HOP'] },
  { name: 'THE MIRAGE LOUNGE', genre: 'Live Band', vibe: 9, cover: '$50', tags: ['LIVE BAND'] },
  { name: 'ELECTRIC CHAPEL', genre: 'Techno', vibe: 6, cover: '$35', tags: ['TECHNO'] },
  { name: 'GOLD ROOM', genre: 'Hip-Hop', vibe: 8, cover: '$45', tags: ['HIP-HOP'] },
  { name: 'CRIMSON STAGE', genre: 'Live Band', vibe: 10, cover: '$60', tags: ['LIVE BAND'] },
]

const vibeOptions = ['TECHNO', 'HIP-HOP', 'LIVE BAND']

export default function NightlifeDistrict() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const filteredVenues = selectedVibe
    ? venues.filter(v => v.tags.includes(selectedVibe))
    : venues

  // Bass visualizer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 80
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const barCount = 32
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = canvas.width / barCount - 2

      for (let i = 0; i < barCount; i++) {
        const height = 15 + Math.abs(Math.sin((i * 0.3) + time * 2)) * 55
        const x = i * (barWidth + 2)
        const hue = 320 + (i / barCount) * 40 // pink to purple gradient

        ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
        ctx.shadowBlur = 10
        ctx.fillRect(x, canvas.height - height, barWidth, height)
      }
      time += 0.016
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 bg-bg-void relative"
    >
      {/* Ambient lights */}
      <FlickerLight color="#FF006E" intensity="high" className="top-20 left-10" size={350} />
      <FlickerLight color="#BF00FF" intensity="medium" className="top-40 right-20" size={300} />
      <FlickerLight color="#FF006E" intensity="low" className="bottom-40 left-1/3" size={250} />

      {/* Hero */}
      <section className="relative py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl md:text-[96px] neon-pink leading-none mb-4"
        >
          NEON NIGHTLIFE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-base text-[var(--text-secondary)]"
        >
          The night never ends.
        </motion.p>
      </section>

      {/* What's Your Vibe? */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl text-[var(--text-primary)] mb-8">WHAT'S YOUR VIBE?</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {vibeOptions.map((vibe) => (
              <motion.button
                key={vibe}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                className={`px-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  selectedVibe === vibe
                    ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_20px_#FF006E44]'
                    : 'bg-transparent border-white/20 text-[var(--text-secondary)] hover:border-white/40'
                } border`}
              >
                {vibe}
              </motion.button>
            ))}
          </div>

          {/* Venue cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVibe || 'all'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredVenues.map((venue, i) => (
                <GlowCard key={venue.name} accentColor="#FF006E" className="p-6 text-left">
                  <h3 className="font-display text-2xl text-[var(--text-primary)] mb-2">{venue.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-pink/10 text-neon-pink border border-neon-pink/20">
                      {venue.genre}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">Cover: {venue.cover}</span>
                  </div>
                  {/* Vibe rating bar */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-[var(--text-muted)]">Vibe:</span>
                    <div className="flex gap-[2px]">
                      {Array.from({ length: 10 }, (_, j) => (
                        <div
                          key={j}
                          className={`w-3 h-2 rounded-sm ${j < venue.vibe ? 'bg-neon-pink' : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-neon-pink">{venue.vibe}/10</span>
                  </div>
                  <button className="font-body font-semibold text-xs uppercase tracking-wider text-neon-pink hover:text-neon-pink/80 transition-colors">
                    Get on the list →
                  </button>
                </GlowCard>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Bass visualizer */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none z-20">
        <canvas ref={canvasRef} className="w-full" style={{ height: 80 }} />
      </div>
    </motion.div>
  )
}
