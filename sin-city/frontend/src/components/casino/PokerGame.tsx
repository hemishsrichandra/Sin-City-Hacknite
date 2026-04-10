import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useUserStore } from '../../store/userStore'

const SUITS = ['♠', '♥', '♦', '♣'] as const
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

interface Card {
  suit: typeof SUITS[number]
  value: typeof VALUES[number]
  held?: boolean
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function getSuitColor(suit: string): string {
  return suit === '♥' || suit === '♦' ? '#E60039' : '#1A1A1A'
}

// Hand evaluation
function evaluateHand(cards: Card[]): { rank: string; payout: number } {
  const values = cards.map(c => VALUES.indexOf(c.value))
  const suits = cards.map(c => c.suit)
  const sortedValues = [...values].sort((a, b) => a - b)

  const isFlush = suits.every(s => s === suits[0])
  const isStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1) ||
    // Ace-high straight: A,10,J,Q,K
    (sortedValues.join(',') === '0,9,10,11,12')

  // Count values
  const counts: Record<number, number> = {}
  values.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
  const countValues = Object.values(counts).sort((a, b) => b - a)

  // Royal Flush
  if (isFlush && sortedValues.join(',') === '0,9,10,11,12') return { rank: 'ROYAL FLUSH', payout: 250 }
  // Straight Flush
  if (isFlush && isStraight) return { rank: 'STRAIGHT FLUSH', payout: 50 }
  // Four of a Kind
  if (countValues[0] === 4) return { rank: 'FOUR OF A KIND', payout: 25 }
  // Full House
  if (countValues[0] === 3 && countValues[1] === 2) return { rank: 'FULL HOUSE', payout: 9 }
  // Flush
  if (isFlush) return { rank: 'FLUSH', payout: 6 }
  // Straight
  if (isStraight) return { rank: 'STRAIGHT', payout: 4 }
  // Three of a Kind
  if (countValues[0] === 3) return { rank: 'THREE OF A KIND', payout: 3 }
  // Two Pair
  if (countValues[0] === 2 && countValues[1] === 2) return { rank: 'TWO PAIR', payout: 2 }
  // Jacks or Better
  if (countValues[0] === 2) {
    const pairValue = parseInt(Object.entries(counts).find(([, c]) => c === 2)![0])
    if (pairValue >= 10 || pairValue === 0) return { rank: 'JACKS OR BETTER', payout: 1 }
  }

  return { rank: 'NO WIN', payout: 0 }
}

const PAYOUT_TABLE = [
  { hand: 'Royal Flush', payout: '250x' },
  { hand: 'Straight Flush', payout: '50x' },
  { hand: 'Four of a Kind', payout: '25x' },
  { hand: 'Full House', payout: '9x' },
  { hand: 'Flush', payout: '6x' },
  { hand: 'Straight', payout: '4x' },
  { hand: 'Three of a Kind', payout: '3x' },
  { hand: 'Two Pair', payout: '2x' },
  { hand: 'Jacks or Better', payout: '1x' },
]

type GamePhase = 'betting' | 'deal' | 'draw' | 'result'

export default function PokerGame() {
  const { user, coins, addCoins, removeCoins } = useUserStore()
  const [bet, setBet] = useState(25)
  const [deck, setDeck] = useState<Card[]>([])
  const [hand, setHand] = useState<Card[]>([])
  const [phase, setPhase] = useState<GamePhase>('betting')
  const [result, setResult] = useState<{ rank: string; payout: number } | null>(null)
  const [showPayTable, setShowPayTable] = useState(false)

  const betOptions = [10, 25, 50, 100, 250]

  const dealCards = useCallback(() => {
    if (!user || coins < bet) return
    removeCoins(bet)
    const newDeck = createDeck()
    const dealtHand = [newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!]
    setDeck(newDeck)
    setHand(dealtHand)
    setResult(null)
    setPhase('deal')
  }, [user, coins, bet, removeCoins])

  const toggleHold = (index: number) => {
    if (phase !== 'deal') return
    setHand(prev => prev.map((c, i) => i === index ? { ...c, held: !c.held } : c))
  }

  const drawCards = useCallback(() => {
    if (phase !== 'deal') return
    const newDeck = [...deck]
    const newHand = hand.map(card => {
      if (card.held) return { ...card, held: false }
      return newDeck.pop()!
    })
    setDeck(newDeck)
    setHand(newHand)

    // Evaluate
    const evaluation = evaluateHand(newHand)
    setResult(evaluation)

    if (evaluation.payout > 0) {
      const winnings = bet * evaluation.payout
      addCoins(winnings + bet) // return bet + winnings
      if (evaluation.payout >= 25) {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ['#FFD700', '#E60039', '#00F5FF', '#BF00FF'] })
      } else if (evaluation.payout >= 4) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#FFD700', '#00FF88'] })
      }
    }

    setPhase('result')
  }, [phase, deck, hand, bet, addCoins])

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎴</div>
        <p className="font-display text-2xl text-[var(--text-secondary)]">
          LOG IN TO PLAY POKER
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
          Check in at the top to receive your chips
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Pay table toggle */}
      <button
        onClick={() => setShowPayTable(!showPayTable)}
        className="mb-4 px-4 py-1 rounded font-mono text-xs text-neon-gold border border-neon-gold/30 hover:bg-neon-gold/10 transition-all"
      >
        {showPayTable ? 'HIDE' : 'SHOW'} PAY TABLE
      </button>

      {/* Pay table */}
      <AnimatePresence>
        {showPayTable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 w-full max-w-md"
          >
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.15)' }}
            >
              {PAYOUT_TABLE.map((row) => (
                <div
                  key={row.hand}
                  className={`flex justify-between py-1 px-2 font-mono text-xs ${
                    result?.rank === row.hand.toUpperCase() ? 'bg-neon-gold/20 rounded text-neon-gold' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span>{row.hand}</span>
                  <span className="text-neon-gold">{row.payout}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div
        className="w-full max-w-2xl rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0a0a2e 0%, #12064a 50%, #0a0a2e 100%)',
          border: '2px solid #2a1a5a',
          boxShadow: '0 0 40px rgba(60,0,120,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="font-display text-2xl neon-purple">VIDEO POKER — JACKS OR BETTER</h3>
          </div>

          {/* Hand */}
          <div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-6 min-h-[10rem]">
            {hand.map((card, i) => (
              <motion.div
                key={`${card.suit}-${card.value}-${i}`}
                className="relative cursor-pointer"
                onClick={() => toggleHold(i)}
                whileHover={phase === 'deal' ? { y: -8 } : {}}
              >
                {/* HELD label */}
                <AnimatePresence>
                  {card.held && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-6 left-0 right-0 text-center"
                    >
                      <span className="font-display text-xs text-neon-gold tracking-widest">HELD</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className={`w-20 h-28 md:w-24 md:h-36 rounded-lg p-2 flex flex-col justify-between transition-all ${
                    card.held ? 'ring-2 ring-neon-gold shadow-[0_0_15px_#FFD70044]' : ''
                  }`}
                  style={{
                    background: '#F5F5F0',
                    border: card.held ? '2px solid #FFD700' : '1px solid #ddd',
                    boxShadow: card.held ? '0 0 15px #FFD70044' : '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold" style={{ color: getSuitColor(card.suit) }}>{card.value}</span>
                    <span className="text-xs" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                  </div>
                  <div className="flex items-center justify-center flex-1">
                    <span className="text-3xl md:text-4xl" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                  </div>
                  <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="text-sm font-bold" style={{ color: getSuitColor(card.suit) }}>{card.value}</span>
                    <span className="text-xs" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-6"
              >
                <p className={`font-display text-3xl ${result.payout > 0 ? 'neon-gold' : 'text-red-400'}`}>
                  {result.rank}
                </p>
                {result.payout > 0 && (
                  <p className="font-display text-xl neon-gold mt-1">
                    +{(result.payout * bet).toLocaleString()} 🪙
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-center gap-3 flex-wrap">
            {phase === 'betting' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 w-full">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {betOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBet(b)}
                      disabled={coins < b}
                      className={`px-4 py-2 rounded-lg font-display text-sm transition-all ${
                        bet === b
                          ? 'bg-neon-purple text-white scale-105 shadow-[0_0_15px_#BF00FF44]'
                          : 'bg-black/30 text-white/70 border border-white/10 hover:border-white/30 disabled:opacity-30'
                      }`}
                    >
                      🪙 {b}
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={dealCards}
                    className="px-10 py-3 rounded-lg font-display text-xl tracking-wider bg-neon-purple text-white"
                    style={{ boxShadow: '0 0 20px #BF00FF44' }}
                  >
                    DEAL — 🪙 {bet}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {phase === 'deal' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-center">
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  Click cards to HOLD, then draw replacements
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={drawCards}
                  className="px-10 py-3 rounded-lg font-display text-xl tracking-wider bg-neon-gold text-black"
                  style={{ boxShadow: '0 0 20px #FFD70044' }}
                >
                  DRAW
                </motion.button>
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setPhase('betting'); setHand([]); setResult(null) }}
                className="px-10 py-3 rounded-lg font-display text-xl tracking-wider bg-neon-purple text-white"
                style={{ boxShadow: '0 0 20px #BF00FF44' }}
              >
                PLAY AGAIN
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="mt-4 font-mono text-sm text-[var(--text-secondary)]">
        Balance: <span className="neon-gold">🪙 {coins.toLocaleString()}</span>
      </div>
    </div>
  )
}
