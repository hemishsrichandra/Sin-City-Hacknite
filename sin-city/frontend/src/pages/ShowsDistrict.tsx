import { motion } from 'framer-motion'
import GlowCard from '../components/ui/GlowCard'
import FlickerLight from '../components/ui/FlickerLight'

const shows = [
  { name: 'CIRQUE DU NOIR', type: 'Acrobatics', time: '8:00 PM', price: '$120', rating: '⭐⭐⭐⭐⭐', desc: 'A gravity-defying spectacle in total darkness, lit only by neon.' },
  { name: 'VELVET ILLUSIONS', type: 'Magic', time: '9:30 PM', price: '$85', rating: '⭐⭐⭐⭐', desc: 'Close-up magic meets grand illusion in an intimate lounge setting.' },
  { name: 'ELECTRIC BURLESQUE', type: 'Cabaret', time: '10:00 PM', price: '$75', rating: '⭐⭐⭐⭐⭐', desc: 'The most daring cabaret show on the Strip. Not for the faint-hearted.' },
  { name: 'COMEDY AFTERDARK', type: 'Comedy', time: '11:00 PM', price: '$45', rating: '⭐⭐⭐⭐', desc: 'Uncensored stand-up from comics who have nothing left to lose.' },
  { name: 'PHOENIX RISING', type: 'Concert', time: '7:30 PM', price: '$150', rating: '⭐⭐⭐⭐⭐', desc: 'A residency by one of the biggest names in music. Pure energy.' },
  { name: 'SHADOW BALLET', type: 'Dance', time: '8:30 PM', price: '$95', rating: '⭐⭐⭐⭐', desc: 'Contemporary dance meets shadow play in a mesmerizing performance.' },
]

export default function ShowsDistrict() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 relative"
    >
      <FlickerLight color="#BF00FF" intensity="medium" className="top-20 right-10" size={350} />
      <FlickerLight color="#BF00FF" intensity="low" className="bottom-40 left-10" size={300} />

      {/* Hero */}
      <section className="py-24 px-6 text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl md:text-[96px] neon-purple leading-none mb-4"
        >
          THE STRIP SHOWS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-base text-[var(--text-secondary)]"
        >
          Spectacle beyond belief.
        </motion.p>
      </section>

      {/* Shows grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show, i) => (
            <motion.div
              key={show.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlowCard accentColor="#BF00FF" className="p-6 h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                    {show.type}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{show.time}</span>
                </div>
                <h3 className="font-display text-3xl text-[var(--text-primary)] mb-2">{show.name}</h3>
                <p className="font-body text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{show.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl neon-purple">{show.price}</span>
                  <span className="text-sm">{show.rating}</span>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-colors">
                  Get Tickets →
                </button>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
