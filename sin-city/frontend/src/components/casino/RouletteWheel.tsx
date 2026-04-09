import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const SEGMENTS = 37
const COLORS = Array.from({ length: SEGMENTS }, (_, i) => {
  if (i === 0) return '#00AA44'
  return i % 2 === 0 ? '#CC0000' : '#1A1A1A'
})

export default function RouletteWheel() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const winningNumber = Math.floor(Math.random() * 37)
    const extraRotations = 5 + Math.floor(Math.random() * 5) // 5-10 full rotations
    const segmentAngle = 360 / SEGMENTS
    const targetAngle = extraRotations * 360 + (360 - winningNumber * segmentAngle)

    const newRotation = rotation + targetAngle
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setResult(winningNumber)
      // Celebrate with confetti on green 0
      if (winningNumber === 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#00AA44', '#FFD700', '#00F5FF'],
        })
      }
    }, 4000)
  }, [spinning, rotation])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        {/* Ball marker (fixed at top - outside the rotating group) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[2%] z-10"
          style={{ width: 14, height: 14 }}
        >
          <div className="w-full h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>

        <svg viewBox="-150 -150 300 300" className="w-full h-full">
          {/* Outer ring */}
          <circle cx={0} cy={0} r={145} fill="none" stroke="#2A2A3A" strokeWidth={4} />

          {/* Spinning wheel group - uses CSS transform-origin for proper center rotation */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: '0px 0px',
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.8, 0.2, 1)' : 'none',
            }}
          >
            {Array.from({ length: SEGMENTS }, (_, i) => {
              const angle = (i * 360) / SEGMENTS
              const nextAngle = ((i + 1) * 360) / SEGMENTS
              const startRad = (angle * Math.PI) / 180
              const endRad = (nextAngle * Math.PI) / 180
              const r = 130

              const x1 = Math.cos(startRad) * r
              const y1 = Math.sin(startRad) * r
              const x2 = Math.cos(endRad) * r
              const y2 = Math.sin(endRad) * r

              const midRad = ((angle + nextAngle) / 2) * (Math.PI / 180)
              const textR = 110
              const tx = Math.cos(midRad) * textR
              const ty = Math.sin(midRad) * textR

              return (
                <g key={i}>
                  <path
                    d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={COLORS[i]}
                    stroke="#030308"
                    strokeWidth={0.5}
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="white"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${(angle + nextAngle) / 2 + 90}, ${tx}, ${ty})`}
                  >
                    {i}
                  </text>
                </g>
              )
            })}
            {/* Center hub */}
            <circle cx={0} cy={0} r={20} fill="#1A1A2E" stroke="#FFD700" strokeWidth={2} />
            <circle cx={0} cy={0} r={8} fill="#FFD700" />
          </g>
        </svg>
      </div>

      {/* Result display */}
      {result !== null && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 text-center"
        >
          <span className="font-display text-5xl neon-gold">{result}</span>
          <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
            {result === 0 ? 'GREEN' : result % 2 === 0 ? 'RED' : 'BLACK'}
          </p>
        </motion.div>
      )}

      {/* Spin button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spin}
        disabled={spinning}
        className="mt-6 px-10 py-3 rounded-lg font-display text-2xl tracking-wider bg-neon-gold text-black disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 20px #FFD70044' }}
      >
        {spinning ? 'SPINNING...' : 'SPIN'}
      </motion.button>
    </div>
  )
}
