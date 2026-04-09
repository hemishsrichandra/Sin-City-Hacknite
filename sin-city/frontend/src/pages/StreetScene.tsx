import { motion } from 'framer-motion'
import GlowCard from '../components/ui/GlowCard'
import FlickerLight from '../components/ui/FlickerLight'

const experiences = [
  { name: 'FREMONT LIGHT SHOW', icon: '🌆', desc: 'The world\'s largest LED screen canopy comes alive every hour. Free. Unmissable.' },
  { name: 'LATE NIGHT TACO CRAWL', icon: '🌮', desc: 'Follow the locals to the hidden taco trucks that only appear after midnight.' },
  { name: 'VINTAGE NEON MUSEUM', icon: '💡', desc: 'Where old Vegas signs go to rest. A graveyard of glowing history.' },
  { name: 'STREET PERFORMERS', icon: '🎭', desc: 'Magicians, dancers, and characters you won\'t believe are real.' },
  { name: 'ROOFTOP SUNRISE', icon: '🌅', desc: 'After the longest night, watch the desert sun paint the city gold.' },
  { name: 'HIDDEN SPEAKEASY TOUR', icon: '🥃', desc: 'Knock three times. Give the password. Enter a world that time forgot.' },
  { name: 'DESERT HIGHWAY DRIVE', icon: '🏜️', desc: 'Rent a convertible. Hit the open road. The desert doesn\'t judge.' },
  { name: 'PAWN SHOP TREASURES', icon: '💎', desc: 'One person\'s lost bet is another\'s vintage Rolex.' },
]

export default function StreetScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 relative"
    >
      <FlickerLight color="#00FF88" intensity="medium" className="top-20 left-10" size={300} />
      <FlickerLight color="#00FF88" intensity="low" className="bottom-20 right-10" size={250} />

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl md:text-[96px] neon-green leading-none mb-4"
        >
          STREET SCENE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-base text-[var(--text-secondary)]"
        >
          Where the real city breathes.
        </motion.p>
      </section>

      {/* Experiences grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlowCard accentColor="#00FF88" className="p-5 h-full">
                <span className="text-4xl block mb-3">{exp.icon}</span>
                <h3 className="font-display text-xl text-[var(--text-primary)] mb-2">{exp.name}</h3>
                <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">{exp.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
