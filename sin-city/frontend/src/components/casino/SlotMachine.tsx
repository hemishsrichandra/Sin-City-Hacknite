import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const SYMBOLS = ['🍒', '💎', '7️⃣', '⭐', '🃏', '🔔']
const REEL_SIZE = 20 // symbols per reel strip
const SYMBOL_HEIGHT = 80

function generateStrip() {
  return Array.from({ length: REEL_SIZE }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
}

export default function SlotMachine() {
  const [reels, setReels] = useState<string[][]>([generateStrip(), generateStrip(), generateStrip()])
  const [spinning, setSpinning] = useState(false)
  const [results, setResults] = useState<string[]>(['🍒', '💎', '7️⃣'])
  const [jackpot, setJackpot] = useState(false)
  const [offsets, setOffsets] = useState([0, 0, 0])

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    setJackpot(false)

    // Generate new reels
    const newReels = [generateStrip(), generateStrip(), generateStrip()]
    setReels(newReels)

    // Pick final results
    const newResults = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ]

    // 10% chance of jackpot for demo wow factor
    if (Math.random() < 0.1) {
      const jackpotSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      newResults[0] = jackpotSymbol
      newResults[1] = jackpotSymbol
      newResults[2] = jackpotSymbol
    }

    // Animate each reel with staggered stops
    const stopTimes = [1500, 1800, 2100]

    stopTimes.forEach((time, i) => {
      // Start spinning offset animation
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < time) {
          setOffsets(prev => {
            const next = [...prev]
            next[i] = (elapsed * 0.5) % (REEL_SIZE * SYMBOL_HEIGHT)
            return next
          })
          requestAnimationFrame(animate)
        } else {
          setOffsets(prev => {
            const next = [...prev]
            next[i] = 0
            return next
          })
          setResults(prev => {
            const next = [...prev]
            next[i] = newResults[i]
            return next
          })

          // Check for jackpot when last reel stops
          if (i === 2) {
            setSpinning(false)
            if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
              setJackpot(true)
              // Fire confetti!
              confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#FF006E', '#00F5FF', '#FFD700', '#BF00FF', '#00FF88'],
              })
            }
          }
        }
      }
      requestAnimationFrame(animate)
    })
  }, [spinning])

  return (
    <div className="flex flex-col items-center">
      {/* Machine body */}
      <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-neon-gold/20">
        {/* Top label */}
        <div className="text-center mb-4">
          <span className="font-display text-3xl neon-gold">★ LUCKY SLOTS ★</span>
        </div>

        {/* Reels container */}
        <div className="flex gap-2 md:gap-3 bg-black/50 rounded-xl p-4 border border-white/10">
          {[0, 1, 2].map((reelIndex) => (
            <div
              key={reelIndex}
              className="relative overflow-hidden rounded-lg bg-[#0A0A14] border border-white/5"
              style={{ width: 90, height: SYMBOL_HEIGHT }}
            >
              {spinning ? (
                <div
                  className="absolute w-full"
                  style={{
                    transform: `translateY(-${offsets[reelIndex]}px)`,
                  }}
                >
                  {reels[reelIndex].map((symbol, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-center"
                      style={{ height: SYMBOL_HEIGHT }}
                    >
                      <span className="text-4xl">{symbol}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-4xl">{results[reelIndex]}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Win line indicator */}
        <div className="absolute left-2 right-2 top-1/2 pointer-events-none z-10" style={{ transform: 'translateY(10px)' }}>
          <div className="h-[2px] bg-neon-gold/30" />
        </div>

        {/* Pull lever */}
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={spin}
            disabled={spinning}
            className="px-10 py-3 rounded-full font-display text-xl tracking-wider bg-gradient-to-b from-red-600 to-red-800 text-white border-2 border-red-400/50 disabled:opacity-50"
            style={{ boxShadow: '0 4px 15px rgba(255,0,0,0.3)' }}
          >
            {spinning ? '⟳ SPINNING' : '🎰 PULL LEVER'}
          </motion.button>
        </div>
      </div>

      {/* Jackpot announcement */}
      <AnimatePresence>
        {jackpot && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="mt-8 text-center"
          >
            <motion.span
              className="font-display text-6xl md:text-8xl neon-gold block"
              animate={{ scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              JACKPOT!
            </motion.span>
            <p className="font-mono text-sm text-neon-gold/80 mt-2">🎉 All three match! 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
