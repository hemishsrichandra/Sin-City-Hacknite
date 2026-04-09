import { motion } from 'framer-motion'
import RouletteWheel from '../components/casino/RouletteWheel'
import CardFlip from '../components/casino/CardFlip'
import SlotMachine from '../components/casino/SlotMachine'
import FlickerLight from '../components/ui/FlickerLight'

export default function CasinoDistrict() {
  return (
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
        </div>
      </section>

      {/* Roulette */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-gold mb-12"
          >
            ROULETTE
          </motion.h2>
          <RouletteWheel />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent" />

      {/* Card Flip */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-gold mb-12"
          >
            DRAW YOUR HAND
          </motion.h2>
          <CardFlip />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent" />

      {/* Slot Machine */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl text-center neon-gold mb-12"
          >
            LUCKY SLOTS
          </motion.h2>
          <SlotMachine />
        </div>
      </section>
    </motion.div>
  )
}
