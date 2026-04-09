import { useState } from 'react'
import { motion } from 'framer-motion'

const SUITS = ['♠', '♥', '♦', '♣'] as const
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function randomCard() {
  return {
    suit: SUITS[Math.floor(Math.random() * 4)],
    value: VALUES[Math.floor(Math.random() * 13)],
  }
}

function getSuitColor(suit: string) {
  return suit === '♥' || suit === '♦' ? '#CC0000' : '#1A1A1A'
}

interface Card {
  suit: string
  value: string
}

export default function CardFlip() {
  const [cards, setCards] = useState<Card[]>([randomCard(), randomCard(), randomCard(), randomCard(), randomCard()])
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false, false])
  const [dealing, setDealing] = useState(false)

  const dealHand = () => {
    if (dealing) return
    setDealing(true)
    setFlipped([false, false, false, false, false])
    setCards([randomCard(), randomCard(), randomCard(), randomCard(), randomCard()])

    // Stagger flip
    cards.forEach((_, i) => {
      setTimeout(() => {
        setFlipped(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
        if (i === 4) setDealing(false)
      }, 300 + i * 200)
    })
  }

  const toggleCard = (index: number) => {
    if (dealing) return
    setFlipped(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
        {cards.map((card, i) => (
          <motion.div
            key={`${card.suit}-${card.value}-${i}`}
            className="relative cursor-pointer"
            style={{
              width: 100,
              height: 140,
              perspective: 1000,
            }}
            onClick={() => toggleCard(i)}
            whileHover={{ y: -4 }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Card back */}
              <div
                className="absolute inset-0 rounded-lg flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
                  border: '2px solid #FFD70044',
                }}
              >
                <div
                  className="w-[80%] h-[80%] rounded border border-neon-gold/30 flex items-center justify-center"
                  style={{
                    background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,215,0,0.05) 3px, rgba(255,215,0,0.05) 6px)',
                  }}
                >
                  <span className="text-neon-gold/40 text-2xl">♠</span>
                </div>
              </div>

              {/* Card face */}
              <div
                className="absolute inset-0 rounded-lg p-2 flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: '#F5F5F0',
                  border: '1px solid #ddd',
                }}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold" style={{ color: getSuitColor(card.suit) }}>{card.value}</span>
                  <span className="text-xs" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                </div>
                <div className="flex items-center justify-center flex-1">
                  <span className="text-4xl" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                </div>
                <div className="flex flex-col items-end leading-tight rotate-180">
                  <span className="text-sm font-bold" style={{ color: getSuitColor(card.suit) }}>{card.value}</span>
                  <span className="text-xs" style={{ color: getSuitColor(card.suit) }}>{card.suit}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={dealHand}
        disabled={dealing}
        className="mt-8 px-10 py-3 rounded-lg font-display text-2xl tracking-wider bg-neon-gold text-black disabled:opacity-50"
        style={{ boxShadow: '0 0 20px #FFD70044' }}
      >
        {dealing ? 'DEALING...' : 'DEAL HAND'}
      </motion.button>
    </div>
  )
}
