import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useUserStore } from '../../store/userStore'

const SEGMENTS = 37
const COLORS = Array.from({ length: SEGMENTS }, (_, i) => {
  if (i === 0) return '#00AA44'
  return i % 2 === 0 ? '#CC0000' : '#1A1A1A'
})

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

type BetType =
  | { type: 'number'; value: number }
  | { type: 'red' }
  | { type: 'black' }
  | { type: 'odd' }
  | { type: 'even' }
  | { type: 'low' }
  | { type: 'high' }

function betLabel(b: BetType): string {
  if (b.type === 'number') return `#${b.value}`
  return b.type.toUpperCase()
}

function betMultiplier(b: BetType): number {
  if (b.type === 'number') return 35
  return 1
}

function isBetWin(b: BetType, result: number): boolean {
  if (result === 0) {
    return b.type === 'number' && b.value === 0
  }
  switch (b.type) {
    case 'number': return b.value === result
    case 'red': return RED_NUMBERS.includes(result)
    case 'black': return !RED_NUMBERS.includes(result) && result !== 0
    case 'odd': return result % 2 !== 0
    case 'even': return result % 2 === 0
    case 'low': return result >= 1 && result <= 18
    case 'high': return result >= 19 && result <= 36
  }
}

export default function RouletteWheel() {
  const { coins, addCoins, removeCoins } = useUserStore()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [betAmount, setBetAmount] = useState(25)
  const [selectedBet, setSelectedBet] = useState<BetType | null>(null)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [winAmount, setWinAmount] = useState(0)

  const betAmountOptions = [10, 25, 50, 100, 250]

  const outsideBets: BetType[] = [
    { type: 'red' },
    { type: 'black' },
    { type: 'odd' },
    { type: 'even' },
    { type: 'low' },
    { type: 'high' },
  ]

  const spin = useCallback(() => {
    if (spinning) return
    if (!selectedBet) {
      setWinMessage('Pick a bet first!')
      return
    }
    if (coins < betAmount) {
      setWinMessage('Not enough coins!')
      return
    }

    removeCoins(betAmount)
    setSpinning(true)
    setResult(null)
    setWinMessage(null)
    setWinAmount(0)

    const winningNumber = Math.floor(Math.random() * 37)
    const extraRotations = 5 + Math.floor(Math.random() * 5)
    const segmentAngle = 360 / SEGMENTS
    const targetAngle = extraRotations * 360 + (360 - winningNumber * segmentAngle)
    const newRotation = rotation + targetAngle
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setResult(winningNumber)

      // Check win
      if (isBetWin(selectedBet, winningNumber)) {
        const mult = betMultiplier(selectedBet)
        const payout = betAmount + betAmount * mult
        addCoins(payout)
        setWinAmount(payout - betAmount)
        setWinMessage(`${betLabel(selectedBet)} WINS! 🎉`)
        confetti({
          particleCount: mult > 5 ? 200 : 100,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#00FF88', '#00F5FF'],
        })
      } else {
        setWinMessage(`Landed on ${winningNumber}. You lose.`)
        setWinAmount(-betAmount)
      }
    }, 4000)
  }, [spinning, selectedBet, coins, betAmount, rotation, removeCoins, addCoins])


  return (
    <div className="flex flex-col items-center">
      {/* Wheel */}
      <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
        {/* Ball marker */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[2%] z-10" style={{ width: 14, height: 14 }}>
          <div className="w-full h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>

        <svg viewBox="-150 -150 300 300" className="w-full h-full">
          <circle cx={0} cy={0} r={145} fill="none" stroke="#2A2A3A" strokeWidth={4} />
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
                    x={tx} y={ty} fill="white" fontSize="8"
                    fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="central"
                    transform={`rotate(${(angle + nextAngle) / 2 + 90}, ${tx}, ${ty})`}
                  >
                    {i}
                  </text>
                </g>
              )
            })}
            <circle cx={0} cy={0} r={20} fill="#1A1A2E" stroke="#FFD700" strokeWidth={2} />
            <circle cx={0} cy={0} r={8} fill="#FFD700" />
          </g>
        </svg>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result !== null && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 text-center">
            <span className="font-display text-4xl neon-gold">{result}</span>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
              {result === 0 ? 'GREEN' : RED_NUMBERS.includes(result) ? 'RED' : 'BLACK'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win/Loss message */}
      <AnimatePresence>
        {winMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center"
          >
            <p className={`font-display text-xl ${winAmount > 0 ? 'neon-gold' : winAmount < 0 ? 'text-red-400' : 'text-white'}`}>
              {winMessage}
            </p>
            {winAmount !== 0 && (
              <p className={`font-mono text-sm ${winAmount > 0 ? 'neon-gold' : 'text-red-400'}`}>
                {winAmount > 0 ? `+${winAmount}` : winAmount} 🪙
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Betting controls */}
      <div className="mt-6 w-full max-w-xl space-y-4">
        {/* Bet amount */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-[var(--text-muted)] mr-2">BET:</span>
          {betAmountOptions.map((b) => (
            <button
              key={b}
              onClick={() => setBetAmount(b)}
              disabled={spinning || coins < b}
              className={`px-3 py-1.5 rounded font-display text-sm transition-all ${
                betAmount === b
                  ? 'bg-neon-gold text-black shadow-[0_0_10px_#FFD70044]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/30 disabled:opacity-30'
              }`}
            >
              🪙{b}
            </button>
          ))}
        </div>

        {/* Bet type - outside bets */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {outsideBets.map((b) => {
            const isSelected = selectedBet && selectedBet.type === b.type
            const color = b.type === 'red' ? '#CC0000' : b.type === 'black' ? '#333' : undefined
            return (
              <button
                key={b.type}
                onClick={() => setSelectedBet(b)}
                disabled={spinning}
                className={`px-4 py-2 rounded-lg font-display text-sm uppercase tracking-wider transition-all border ${
                  isSelected
                    ? 'border-neon-gold text-neon-gold shadow-[0_0_15px_#FFD70033] scale-105'
                    : 'border-white/15 text-white/60 hover:border-white/30'
                }`}
                style={color && !isSelected ? { backgroundColor: color + '33' } : {}}
              >
                {b.type === 'low' ? '1-18' : b.type === 'high' ? '19-36' : b.type}
              </button>
            )
          })}
        </div>

        {/* Number bet (quick picks) */}
        <div className="text-center">
          <p className="font-mono text-[10px] text-[var(--text-muted)] mb-2">OR PICK A NUMBER (35:1)</p>
          <div className="flex flex-wrap justify-center gap-1">
            {[0, 7, 13, 17, 21, 27, 32, 36].map((n) => (
              <button
                key={n}
                onClick={() => setSelectedBet({ type: 'number', value: n })}
                disabled={spinning}
                className={`w-9 h-9 rounded font-mono text-xs transition-all ${
                  selectedBet?.type === 'number' && selectedBet.value === n
                    ? 'bg-neon-gold text-black shadow-[0_0_10px_#FFD70044]'
                    : `text-white/70 hover:border-white/40 border ${n === 0 ? 'border-green-500/40 bg-green-900/20' : RED_NUMBERS.includes(n) ? 'border-red-500/30 bg-red-900/15' : 'border-white/10 bg-white/5'}`
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spin button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spin}
        disabled={spinning || !selectedBet}
        className="mt-6 px-10 py-3 rounded-lg font-display text-2xl tracking-wider bg-neon-gold text-black disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 20px #FFD70044' }}
      >
        {spinning ? 'SPINNING...' : selectedBet ? `SPIN — 🪙 ${betAmount}` : 'SELECT A BET'}
      </motion.button>

      {/* Balance */}
      <div className="mt-3 font-mono text-sm text-[var(--text-secondary)]">
        Balance: <span className="neon-gold">🪙 {coins.toLocaleString()}</span>
      </div>
    </div>
  )
}
