import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useUserStore } from '../../store/userStore'

const SUITS = ['♠', '♥', '♦', '♣'] as const
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

interface Card {
  suit: typeof SUITS[number]
  value: typeof VALUES[number]
  hidden?: boolean
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value })
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function cardValue(card: Card): number {
  if (card.value === 'A') return 11
  if (['K', 'Q', 'J'].includes(card.value)) return 10
  return parseInt(card.value)
}

function handValue(cards: Card[]): number {
  let sum = 0
  let aces = 0
  for (const card of cards) {
    if (card.hidden) continue
    sum += cardValue(card)
    if (card.value === 'A') aces++
  }
  while (sum > 21 && aces > 0) {
    sum -= 10
    aces--
  }
  return sum
}

function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handValue(cards) === 21
}

function getSuitColor(suit: string): string {
  return suit === '♥' || suit === '♦' ? '#E60039' : '#1A1A1A'
}

type GameState = 'betting' | 'playing' | 'dealer' | 'result'

function CardComponent({ card, index, small }: { card: Card; index: number; small?: boolean }) {
  const isHidden = card.hidden
  const w = small ? 'w-14' : 'w-20'
  const h = small ? 'h-20' : 'h-28'

  return (
    <motion.div
      initial={{ rotateY: 180, x: -40, opacity: 0 }}
      animate={{ rotateY: 0, x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
      className={`${w} ${h} rounded-lg flex-shrink-0 relative overflow-hidden`}
      style={{
        perspective: 1000,
        background: isHidden
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
          : '#F5F5F0',
        border: isHidden ? '2px solid #FFD70044' : '1px solid #ddd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {isHidden ? (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-[80%] h-[80%] rounded border border-neon-gold/30 flex items-center justify-center"
            style={{
              background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,215,0,0.05) 3px, rgba(255,215,0,0.05) 6px)',
            }}
          >
            <span className="text-neon-gold/40 text-xl">♠</span>
          </div>
        </div>
      ) : (
        <div className="p-1.5 flex flex-col justify-between h-full">
          <div className="flex flex-col items-start leading-none">
            <span className={`${small ? 'text-xs' : 'text-sm'} font-bold`} style={{ color: getSuitColor(card.suit) }}>
              {card.value}
            </span>
            <span className="text-[10px]" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
          </div>
          <div className="flex items-center justify-center flex-1">
            <span className={`${small ? 'text-2xl' : 'text-3xl'}`} style={{ color: getSuitColor(card.suit) }}>
              {card.suit}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function BlackjackGame() {
  const { user, coins, addCoins, removeCoins } = useUserStore()
  const [bet, setBet] = useState(50)
  const [deck, setDeck] = useState<Card[]>([])
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [dealerCards, setDealerCards] = useState<Card[]>([])
  const [gameState, setGameState] = useState<GameState>('betting')
  const [message, setMessage] = useState('')
  const [winAmount, setWinAmount] = useState(0)

  const betOptions = [25, 50, 100, 250, 500]

  const startGame = useCallback(() => {
    if (!user) return
    if (coins < bet) {
      setMessage('Not enough coins!')
      return
    }

    removeCoins(bet)
    const newDeck = createDeck()
    const pCards = [newDeck.pop()!, newDeck.pop()!]
    const dCards = [newDeck.pop()!, { ...newDeck.pop()!, hidden: true }]

    setDeck(newDeck)
    setPlayerCards(pCards)
    setDealerCards(dCards)
    setMessage('')
    setWinAmount(0)
    setGameState('playing')

    // Check for player blackjack
    if (isBlackjack(pCards)) {
      // Reveal dealer card
      dCards[1].hidden = false
      setDealerCards([...dCards])
      if (isBlackjack(dCards)) {
        // Push
        addCoins(bet)
        setMessage('PUSH — Both Blackjack!')
        setWinAmount(0)
      } else {
        // Blackjack pays 3:2
        const payout = Math.floor(bet * 2.5)
        addCoins(payout)
        setMessage('BLACKJACK! 🃏')
        setWinAmount(payout - bet)
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700', '#E60039', '#00F5FF'] })
      }
      setGameState('result')
    }
  }, [user, coins, bet, removeCoins, addCoins])

  const hit = useCallback(() => {
    if (gameState !== 'playing') return
    const newDeck = [...deck]
    const newCard = newDeck.pop()!
    const newPlayerCards = [...playerCards, newCard]
    setDeck(newDeck)
    setPlayerCards(newPlayerCards)

    if (handValue(newPlayerCards) > 21) {
      // Bust - reveal dealer
      const revealedDealer = dealerCards.map(c => ({ ...c, hidden: false }))
      setDealerCards(revealedDealer)
      setMessage('BUST! 💥')
      setWinAmount(-bet)
      setGameState('result')
    }
  }, [gameState, deck, playerCards, dealerCards, bet])

  const stand = useCallback(() => {
    if (gameState !== 'playing') return

    // Reveal dealer card
    const revealedDealer = dealerCards.map(c => ({ ...c, hidden: false }))
    setDealerCards(revealedDealer)
    setGameState('dealer')

    // Dealer draws
    const newDeck = [...deck]
    let dCards = [...revealedDealer]
    const drawDealer = () => {
      if (handValue(dCards) < 17) {
        const newCard = newDeck.pop()!
        dCards = [...dCards, newCard]
        setDealerCards([...dCards])
        setDeck([...newDeck])
        setTimeout(drawDealer, 600)
      } else {
        // Determine winner
        const pVal = handValue(playerCards)
        const dVal = handValue(dCards)

        if (dVal > 21) {
          const payout = bet * 2
          addCoins(payout)
          setMessage('DEALER BUSTS! You win! 🎉')
          setWinAmount(payout - bet)
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#FFD700', '#00FF88'] })
        } else if (pVal > dVal) {
          const payout = bet * 2
          addCoins(payout)
          setMessage('YOU WIN! 🎉')
          setWinAmount(payout - bet)
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#FFD700', '#00FF88'] })
        } else if (dVal > pVal) {
          setMessage('DEALER WINS 😈')
          setWinAmount(-bet)
        } else {
          addCoins(bet)
          setMessage('PUSH — It\'s a tie!')
          setWinAmount(0)
        }
        setGameState('result')
      }
    }
    setTimeout(drawDealer, 600)
  }, [gameState, deck, dealerCards, playerCards, bet, addCoins])

  const doubleDown = useCallback(() => {
    if (gameState !== 'playing' || playerCards.length !== 2) return
    if (coins < bet) {
      setMessage('Not enough coins to double!')
      return
    }

    removeCoins(bet)
    const doubleBet = bet * 2

    const newDeck = [...deck]
    const newCard = newDeck.pop()!
    const newPlayerCards = [...playerCards, newCard]
    setDeck(newDeck)
    setPlayerCards(newPlayerCards)

    if (handValue(newPlayerCards) > 21) {
      const revealedDealer = dealerCards.map(c => ({ ...c, hidden: false }))
      setDealerCards(revealedDealer)
      setMessage('BUST on Double Down! 💥')
      setWinAmount(-doubleBet)
      setGameState('result')
      return
    }

    // Auto-stand after double
    const revealedDealer = dealerCards.map(c => ({ ...c, hidden: false }))
    setDealerCards(revealedDealer)
    setGameState('dealer')

    let dCards = [...revealedDealer]
    const drawDealer = () => {
      if (handValue(dCards) < 17) {
        const card = newDeck.pop()!
        dCards = [...dCards, card]
        setDealerCards([...dCards])
        setDeck([...newDeck])
        setTimeout(drawDealer, 600)
      } else {
        const pVal = handValue(newPlayerCards)
        const dVal = handValue(dCards)

        if (dVal > 21) {
          addCoins(doubleBet * 2)
          setMessage('DEALER BUSTS! Double win! 🎉🎉')
          setWinAmount(doubleBet)
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700', '#00FF88', '#E60039'] })
        } else if (pVal > dVal) {
          addCoins(doubleBet * 2)
          setMessage('DOUBLE WIN! 🎉🎉')
          setWinAmount(doubleBet)
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700', '#00FF88'] })
        } else if (dVal > pVal) {
          setMessage('DEALER WINS on Double 😈')
          setWinAmount(-doubleBet)
        } else {
          addCoins(doubleBet)
          setMessage('PUSH — Double returned!')
          setWinAmount(0)
        }
        setGameState('result')
      }
    }
    setTimeout(drawDealer, 600)
  }, [gameState, playerCards, deck, dealerCards, bet, coins, removeCoins, addCoins])

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🃏</div>
        <p className="font-display text-2xl text-[var(--text-secondary)]">
          LOG IN TO PLAY BLACKJACK
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
          Check in at the top to receive your chips
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Game table */}
      <div
        className="w-full max-w-2xl rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0a3d0a 0%, #0d4d0d 50%, #0a3d0a 100%)',
          border: '2px solid #1a5a1a',
          boxShadow: '0 0 40px rgba(0,60,0,0.3), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Felt texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'repeating-conic-gradient(rgba(0,80,0,0.1) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px' }}
        />

        <div className="relative z-10">
          {/* Dealer section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-white/60 uppercase tracking-wider">Dealer</span>
              {dealerCards.length > 0 && (
                <span className="font-display text-lg text-white/80">
                  {handValue(dealerCards)}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap min-h-[7rem]">
              <AnimatePresence>
                {dealerCards.map((card, i) => (
                  <CardComponent key={`d-${i}-${card.suit}-${card.value}`} card={card} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-white/10 mb-8" />

          {/* Player section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-white/60 uppercase tracking-wider">Your Hand</span>
              {playerCards.length > 0 && (
                <span className={`font-display text-lg ${handValue(playerCards) > 21 ? 'text-red-400' : 'text-white/80'}`}>
                  {handValue(playerCards)}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap min-h-[7rem]">
              <AnimatePresence>
                {playerCards.map((card, i) => (
                  <CardComponent key={`p-${i}-${card.suit}-${card.value}`} card={card} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          {gameState === 'betting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Bet selection */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {betOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBet(b)}
                    disabled={coins < b}
                    className={`px-4 py-2 rounded-lg font-display text-sm transition-all ${
                      bet === b
                        ? 'bg-neon-gold text-black scale-105 shadow-[0_0_15px_#FFD70044]'
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
                  onClick={startGame}
                  className="px-10 py-3 rounded-lg font-display text-xl tracking-wider bg-neon-gold text-black"
                  style={{ boxShadow: '0 0 20px #FFD70044' }}
                >
                  DEAL — 🪙 {bet}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-3 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={hit}
                className="px-8 py-3 rounded-lg font-display text-lg tracking-wider bg-neon-cyan text-black"
              >
                HIT
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stand}
                className="px-8 py-3 rounded-lg font-display text-lg tracking-wider border-2 border-white/40 text-white"
              >
                STAND
              </motion.button>
              {playerCards.length === 2 && coins >= bet && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={doubleDown}
                  className="px-8 py-3 rounded-lg font-display text-lg tracking-wider bg-neon-gold text-black"
                >
                  DOUBLE ×2
                </motion.button>
              )}
            </motion.div>
          )}

          {gameState === 'dealer' && (
            <div className="text-center">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-display text-xl text-white/60"
              >
                DEALER DRAWING...
              </motion.p>
            </div>
          )}

          {gameState === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <p className="font-display text-3xl text-white">{message}</p>
              {winAmount !== 0 && (
                <p className={`font-display text-xl ${winAmount > 0 ? 'neon-gold' : 'text-red-400'}`}>
                  {winAmount > 0 ? `+${winAmount}` : winAmount} 🪙
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('betting')}
                className="px-10 py-3 rounded-lg font-display text-xl tracking-wider bg-neon-gold text-black"
                style={{ boxShadow: '0 0 20px #FFD70044' }}
              >
                PLAY AGAIN
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Current balance */}
      <div className="mt-4 font-mono text-sm text-[var(--text-secondary)]">
        Balance: <span className="neon-gold">🪙 {coins.toLocaleString()}</span>
      </div>
    </div>
  )
}
