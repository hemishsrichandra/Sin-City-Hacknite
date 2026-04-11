import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ParticleField from '../ui/ParticleField'

interface StreamingResponseProps {
  output: string
  isStreaming: boolean
  onCancel: () => void
}

const PROGRESS_PHASES = [
  { label: 'Contacting the underground...', icon: '🕵️' },
  { label: 'Scanning VIP guest lists...', icon: '📋' },
  { label: 'Mapping the secret routes...', icon: '🗺️' },
  { label: 'Bribing the doormen...', icon: '💵' },
  { label: 'Checking the danger zones...', icon: '⚠️' },
  { label: 'Securing your reservations...', icon: '🔒' },
  { label: 'The Consigliere is ready...', icon: '🎬' },
]

export default function StreamingResponse({ output, isStreaming, onCancel }: StreamingResponseProps) {
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [bgHue, setBgHue] = useState(260)

  // Progress + phase cycling
  useEffect(() => {
    if (!isStreaming) return
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 0.5, 95))
    }, 200)
    return () => clearInterval(interval)
  }, [isStreaming])

  useEffect(() => {
    if (!isStreaming) { setProgress(100); return }
    const interval = setInterval(() => {
      setPhaseIndex(prev => (prev + 1) % PROGRESS_PHASES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isStreaming])

  useEffect(() => {
    if (!isStreaming) return
    const interval = setInterval(() => {
      setBgHue(prev => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [isStreaming])

  const lines = output.split('\n').filter(Boolean)
  const phase = PROGRESS_PHASES[phaseIndex]

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
        {/* Phase indicator */}
        {isStreaming && (
          <motion.div
            key={phaseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-6"
          >
            <span className="text-3xl mb-2 block">{phase.icon}</span>
            <span className="font-mono text-sm text-neon-gold tracking-wider">{phase.label}</span>
          </motion.div>
        )}

        {/* Terminal */}
        <div className="rounded-xl overflow-hidden border border-white/10">
          {/* Progress bar */}
          <div className="h-1.5 bg-bg-deep relative overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #E60039, #FFD700, #BF00FF)',
              }}
              transition={{ duration: 0.3 }}
            />
            {isStreaming && (
              <motion.div
                className="absolute top-0 h-full w-20 opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }}
                animate={{ left: ['-80px', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A14] border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)] ml-2">
              the-consigliere — crafting your playbook
            </span>
            {isStreaming && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-auto w-2 h-2 rounded-full bg-neon-crimson"
              />
            )}
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
                      : line.includes('DAY')
                      ? 'text-neon-gold font-bold text-sm mt-3'
                      : line.startsWith('💀')
                      ? 'text-neon-crimson italic'
                      : line.startsWith('⚡')
                      ? 'text-yellow-400'
                      : line.startsWith('🔚')
                      ? 'text-[var(--text-muted)] italic mt-2'
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
            className="mt-4 block mx-auto font-mono text-xs text-[var(--text-muted)] hover:text-neon-crimson transition-colors uppercase tracking-wider"
          >
            ✕ ABORT MISSION
          </button>
        )}
      </div>
    </div>
  )
}
