import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ParticleField from '../ui/ParticleField'

interface StreamingResponseProps {
  output: string
  isStreaming: boolean
  onCancel: () => void
}

export default function StreamingResponse({ output, isStreaming, onCancel }: StreamingResponseProps) {
  const [progress, setProgress] = useState(0)
  const [bgHue, setBgHue] = useState(260)

  // Fake progress bar
  useEffect(() => {
    if (!isStreaming) return
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 0.5, 95))
    }, 200)
    return () => clearInterval(interval)
  }, [isStreaming])

  useEffect(() => {
    if (!isStreaming) setProgress(100)
  }, [isStreaming])

  // Background hue shift
  useEffect(() => {
    if (!isStreaming) return
    const interval = setInterval(() => {
      setBgHue(prev => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [isStreaming])

  const lines = output.split('\n').filter(Boolean)

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6">
      {/* Background with shifting color */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${bgHue}, 30%, 5%) 0%, var(--bg-void) 70%)`,
        }}
      />
      <ParticleField count={80} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Terminal */}
        <div className="rounded-xl overflow-hidden border border-white/10">
          {/* Progress bar */}
          <div className="h-1 bg-bg-deep">
            <motion.div
              className="h-full bg-neon-pink"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A14] border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)] ml-2">
              sin-city-concierge — generating itinerary
            </span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#06060E] p-5 min-h-[350px] max-h-[60vh] overflow-y-auto relative">
            {/* Scanline */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)',
              }}
            />

            <div className="relative z-10">
              {lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={`font-mono text-xs leading-6 ${
                    line.startsWith('>') || line.startsWith('INIT') || line.startsWith('ANALYSING') || line.startsWith('MATCH') || line.startsWith('BUILD')
                      ? 'text-neon-green'
                      : line.startsWith('DAY')
                      ? 'text-neon-gold font-bold text-sm mt-3'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {line}
                </motion.p>
              ))}
              {isStreaming && (
                <span className="inline-block w-2 h-3 bg-neon-green animate-pulse ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Cancel */}
        {isStreaming && (
          <button
            onClick={onCancel}
            className="mt-4 block mx-auto font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            CANCEL
          </button>
        )}
      </div>
    </div>
  )
}
