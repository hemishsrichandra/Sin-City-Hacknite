import { useState } from 'react'
import { motion } from 'framer-motion'
import RouletteWheel from '../components/casino/RouletteWheel'
import BlackjackGame from '../components/casino/BlackjackGame'
import PokerGame from '../components/casino/PokerGame'
import SlotMachine from '../components/casino/SlotMachine'
import FlickerLight from '../components/ui/FlickerLight'
import { useUserStore } from '../store/userStore'

const GAMES = [
  { id: 'blackjack', label: '🃏 BLACKJACK', color: '#00FF88' },
  { id: 'roulette', label: '🎡 ROULETTE', color: '#FFD700' },
  { id: 'poker', label: '🎴 POKER', color: '#BF00FF' },
  { id: 'slots', label: '🎰 JACKPOT', color: '#E60039' },
]

export default function CasinoDistrict() {
  const { firebaseUser, coins } = useUserStore()
  const [activeGame, setActiveGame] = useState('blackjack')

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20"
    >
      {/* Hero */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at center, rgba(0,60,20,0.4) 0%, rgba(3,3,8,1) 70%),
            repeating-conic-gradient(rgba(0,80,30,0.05) 0% 25%, transparent 0% 50%) 0 0 / 40px 40px
          `,
        }}
      >
        <FlickerLight color="#FFD700" intensity="medium" className="top-0 left-1/4" size={300} />
        <FlickerLight color="#FFD700" intensity="low" className="bottom-0 right-1/4" size={250} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-6xl md:text-[96px] neon-gold leading-none mb-4"
          >
            THE CASINO FLOOR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-base text-[var(--text-secondary)]"
          >
            Where fortunes are made. And lost.
          </motion.p>

          {/* Balance display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl"
            style={{
              background: 'rgba(255,215,0,0.06)',
              border: '1px solid rgba(255,215,0,0.2)',
              boxShadow: '0 0 40px rgba(255,215,0,0.05)',
            }}
          >
            {firebaseUser?.photoURL ? (
              <img src={firebaseUser.photoURL} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-white/20" />
            ) : (
              <span className="text-2xl">🎰</span>
            )}
            <div className="text-left">
              <p className="font-body text-sm text-[var(--text-secondary)]">{firebaseUser?.displayName?.split(' ')[0]}'s Wallet</p>
              <p className="font-display text-3xl neon-gold">🪙 {coins.toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Game Navigation Tabs */}
      <section className="sticky top-16 z-30 py-4 px-6" style={{ background: 'rgba(5,0,2,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 md:gap-3">
          {GAMES.map((game) => {
            const isActive = activeGame === game.id
            return (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveGame(game.id)
                  document.getElementById(`game-${game.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`px-5 py-2.5 rounded-xl font-display text-sm md:text-base tracking-wider transition-all duration-300 border ${
                  isActive
                    ? 'text-black shadow-lg scale-105'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
                }`}
                style={isActive ? {
                  background: game.color,
                  borderColor: game.color,
                  boxShadow: `0 0 25px ${game.color}44`,
                } : {}}
              >
                {game.label}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Blackjack */}
      <section id="game-blackjack" className="py-20 px-6 scroll-mt-32">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center mb-2"
            style={{ color: '#00FF88', textShadow: '0 0 10px #00FF88, 0 0 30px #00FF8866' }}
          >
            BLACKJACK
          </motion.h2>
          <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-10">
            Get as close to 21 as you can. Beat the dealer. Don't bust.
          </p>
          <BlackjackGame />
        </div>
      </section>

      <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent" />

      {/* Roulette */}
      <section id="game-roulette" className="py-20 px-6 scroll-mt-32">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-gold mb-2"
          >
            ROULETTE
          </motion.h2>
          <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-10">
            Place your bet. Red, black, or go for a number. 35:1 payout on singles.
          </p>
          <RouletteWheel />
        </div>
      </section>

      <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent" />

      {/* Poker */}
      <section id="game-poker" className="py-20 px-6 scroll-mt-32">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-purple mb-2"
          >
            VIDEO POKER
          </motion.h2>
          <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-10">
            Jacks or Better. Hold your best cards, draw replacements. Royal Flush pays 250x.
          </p>
          <PokerGame />
        </div>
      </section>

      <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent" />

      {/* Slot Machine */}
      <section id="game-slots" className="py-20 px-6 scroll-mt-32">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-crimson mb-2"
          >
            JACKPOT SLOTS
          </motion.h2>
          <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-10">
            Pull the lever. Three 7s wins 25x your bet. Feeling lucky?
          </p>
          <SlotMachine />
        </div>
      </section>
    </motion.div>

    </>
  )
}
