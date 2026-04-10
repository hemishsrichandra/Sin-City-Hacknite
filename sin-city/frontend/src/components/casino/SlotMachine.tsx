import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useUserStore } from '../../store/userStore'

const SYMBOLS = ['🍒', '💎', '7️⃣', '⭐', '🃏', '🔔']
const REEL_SIZE = 20
const SYMBOL_HEIGHT = 80

function generateStrip() {
  return Array.from({ length: REEL_SIZE }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
}

// Payout table
function calculatePayout(results: string[], bet: number): { payout: number; label: string } {
  // Three of a kind
  if (results[0] === results[1] && results[1] === results[2]) {
    if (results[0] === '7️⃣') return { payout: bet * 25, label: '🎰 MEGA JACKPOT! 7-7-7!' }
    if (results[0] === '💎') return { payout: bet * 10, label: '💎 DIAMOND JACKPOT!' }
    if (results[0] === '🍒') return { payout: bet * 8, label: '🍒 CHERRY BOMB!' }
    return { payout: bet * 5, label: '✨ THREE OF A KIND!' }
  }
  // Two of a kind
  if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
    return { payout: Math.floor(bet * 1.5), label: 'Two Match — Small Win' }
  }
  return { payout: 0, label: '' }
}

export default function SlotMachine() {
  const { user, coins, addCoins, removeCoins } = useUserStore()
  const [reels, setReels] = useState<string[][]>([generateStrip(), generateStrip(), generateStrip()])
  const [spinning, setSpinning] = useState(false)
  const [results, setResults] = useState<string[]>(['🍒', '💎', '7️⃣'])
  const [jackpot, setJackpot] = useState(false)
  const [offsets, setOffsets] = useState([0, 0, 0])
  const [bet, setBet] = useState(25)
  const [winInfo, setWinInfo] = useState<{ payout: number; label: string } | null>(null)

  const betOptions = [10, 25, 50, 100]

  const spin = useCallback(() => {
    if (spinning || !user) return
    if (coins < bet) {
      setWinInfo({ payout: 0, label: 'Not enough coins!' })
      return
    }

    removeCoins(bet)
    setSpinning(true)
    setJackpot(false)
    setWinInfo(null)

    const newReels = [generateStrip(), generateStrip(), generateStrip()]
    setReels(newReels)

    const newResults = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ]

    // 8% chance of jackpot (three of a kind)
    if (Math.random() < 0.08) {
      const jackpotSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      newResults[0] = jackpotSymbol
      newResults[1] = jackpotSymbol
      newResults[2] = jackpotSymbol
    }

    const stopTimes = [1500, 1800, 2100]

    stopTimes.forEach((time, i) => {
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

          if (i === 2) {
            setSpinning(false)
            const payoutInfo = calculatePayout(newResults, bet)
            setWinInfo(payoutInfo)

            if (newResults[0] === newResults[1] && newResults[1] === newResults[2]) {
              setJackpot(true)
              addCoins(payoutInfo.payout)
              confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#FF006E', '#00F5FF', '#FFD700', '#BF00FF', '#00FF88'],
              })
            } else if (payoutInfo.payout > 0) {
              addCoins(payoutInfo.payout)
              confetti({
                particleCount: 50,
                spread: 40,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#00FF88'],
              })
            }
          }
        }
      }
      requestAnimationFrame(animate)
    })
  }, [spinning, user, coins, bet, removeCoins, addCoins])

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎰</div>
        <p className="font-display text-2xl text-[var(--text-secondary)]">
          LOG IN TO PLAY SLOTS
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
          Check in at the top to receive your chips
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Machine body */}
      <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-neon-gold/20">
        {/* Top label */}
        <div className="text-center mb-4">
          <span className="font-display text-3xl neon-gold">★ LUCKY SLOTS ★</span>
        </div>

        {/* Payout table mini */}
        <div className="mb-4 flex justify-center gap-4 font-mono text-[10px] text-white/40">
          <span>3×7️⃣ = 25x</span>
          <span>3×💎 = 10x</span>
          <span>3×🍒 = 8x</span>
          <span>3× = 5x</span>
          <span>2× = 1.5x</span>
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
                  style={{ transform: `translateY(-${offsets[reelIndex]}px)` }}
                >
                  {reels[reelIndex].map((symbol, j) => (
                    <div key={j} className="flex items-center justify-center" style={{ height: SYMBOL_HEIGHT }}>
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

        {/* Bet selection */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">BET:</span>
          {betOptions.map((b) => (
            <button
              key={b}
              onClick={() => setBet(b)}
              disabled={spinning || coins < b}
              className={`px-3 py-1.5 rounded font-display text-sm transition-all ${
                bet === b
                  ? 'bg-neon-gold text-black shadow-[0_0_10px_#FFD70044]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 disabled:opacity-30'
              }`}
            >
              🪙{b}
            </button>
          ))}
        </div>

        {/* Pull lever */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={spin}
            disabled={spinning}
            className="px-10 py-3 rounded-full font-display text-xl tracking-wider bg-gradient-to-b from-red-600 to-red-800 text-white border-2 border-red-400/50 disabled:opacity-50"
            style={{ boxShadow: '0 4px 15px rgba(255,0,0,0.3)' }}
          >
            {spinning ? '⟳ SPINNING' : `🎰 PULL — 🪙${bet}`}
          </motion.button>
        </div>
      </div>

      {/* Win info */}
      <AnimatePresence>
        {winInfo && winInfo.label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center"
          >
            {jackpot ? (
              <motion.span
                className="font-display text-5xl md:text-6xl neon-gold block"
                animate={{ scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                JACKPOT!
              </motion.span>
            ) : null}
            <p className={`font-display text-xl ${winInfo.payout > 0 ? 'neon-gold' : 'text-red-400'}`}>
              {winInfo.label}
            </p>
            {winInfo.payout > 0 && (
              <p className="font-mono text-sm neon-gold">+{winInfo.payout.toLocaleString()} 🪙</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balance */}
      <div className="mt-4 font-mono text-sm text-[var(--text-secondary)]">
        Balance: <span className="neon-gold">🪙 {coins.toLocaleString()}</span>
      </div>
    </div>
  )
}
