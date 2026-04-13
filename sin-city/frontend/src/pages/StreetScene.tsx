import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'

const experiences = [
  { 
    id: 'fremont',
    name: 'FREMONT LIGHT SHOW', 
    icon: '🌆', 
    desc: 'The world\'s largest LED screen canopy comes alive every hour. A sensory overload of light and sound in the heart of old Vegas.',
    rating: 4.8,
    price: 'FREE',
    location: 'Fremont Street Experience',
    image: 'https://images.unsplash.com/photo-1581333100576-b73bbe1b7593?w=800&q=80',
    tags: ['NEON', 'CROWDS', 'SPECTACLE']
  },
  { 
    id: 'tacos',
    name: 'LATE NIGHT TACO CRAWL', 
    icon: '🌮', 
    desc: 'Follow the locals to the hidden taco trucks that only appear after midnight. The best al pastor you will ever have, served on the hood of a car.',
    rating: 4.9,
    price: '🪙 15',
    location: 'Las Vegas Blvd South',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    tags: ['FOOD', 'LOCAL', 'CHILL']
  },
  { 
    id: 'neon',
    name: 'VINTAGE NEON MUSEUM', 
    icon: '💡', 
    desc: 'Where old Vegas signs go to rest. A beautiful, eerie graveyard of glowing history and broken promises.',
    rating: 4.7,
    price: '🪙 25',
    location: 'North Las Vegas Blvd',
    image: 'https://images.unsplash.com/photo-1543269865-cbf460ef3ef2?w=800&q=80',
    tags: ['HISTORY', 'PHOTO-OP', 'NOIR']
  },
  { 
    id: 'performers',
    name: 'STREET PERFORMERS', 
    icon: '🎭', 
    desc: 'Magicians, dancers, and characters you won\'t believe are real. The pulse of the pavement.',
    rating: 4.5,
    price: 'TIPS',
    location: 'The Strip',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    tags: ['LIVE', 'CHAOTIC', 'DANCE']
  },
  { 
    id: 'sunrise',
    name: 'ROOFTOP SUNRISE', 
    icon: '🌅', 
    desc: 'After the longest night, watch the desert sun paint the city gold from a secret parking garage roof.',
    rating: 4.9,
    price: 'FREE',
    location: 'Stratosphere Vicinity',
    image: 'https://images.unsplash.com/photo-1473163928189-39a0c8a900d8?w=800&q=80',
    tags: ['VIEWS', 'QUIET', 'PREMIUM']
  },
  { 
    id: 'speakeasy',
    name: 'HIDDEN SPEAKEASY TOUR', 
    icon: '🥃', 
    desc: 'Knock three times. Give the password. Enter a world of red velvet, jazz, and prohibited excellence.',
    rating: 4.9,
    price: '🪙 45',
    location: 'Secret Locations (Downtown)',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    tags: ['DRINKS', 'SECRET', 'CLASSY']
  },
  { 
    id: 'desert',
    name: 'DESERT HIGHWAY DRIVE', 
    icon: '🏜️', 
    desc: 'Rent a convertible. Hit the open road. The desert doesn\'t judge your speed or your past.',
    rating: 4.6,
    price: '🪙 120',
    location: 'Valley of Fire',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    tags: ['ROADTRIP', 'ESCIPISM', 'SPEED']
  },
  { 
    id: 'pawn',
    name: 'PAWN SHOP TREASURES', 
    icon: '💎', 
    desc: 'One person\'s lost bet is another\'s vintage Rolex. Browse the trophies of the desperate and the lucky.',
    rating: 4.4,
    price: 'VARIES',
    location: 'Gold & Silver Pawn',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=800&q=80',
    tags: ['SHOPPING', 'RARITIES', 'GRITTY']
  },
]

export default function StreetScene() {
  const [selected, setSelected] = useState<typeof experiences[0] | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20 relative bg-bg-void overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00FF88 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <FlickerLight color="#00FF88" intensity="medium" className="top-20 left-10" size={500} />
      <FlickerLight color="#00FF88" intensity="low" className="bottom-20 right-10" size={400} />

      {/* Hero */}
      <section className="relative z-10 py-16 px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs tracking-[0.4em] text-neon-green mb-4 block uppercase">The Pulse of the Asphalt</span>
          <h1 className="font-display text-7xl md:text-[120px] neon-green leading-none mb-6">
            STREET SCENE
          </h1>
          <p className="font-body text-xl text-white/50 max-w-2xl mx-auto">
            Beyond the neon lights of the casinos lies the real soul of Sin City. Gritty, unfiltered, and always glowing.
          </p>
        </motion.div>
      </section>

      {/* Experiences Grid */}
      <section className="relative z-10 py-12 px-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelected(exp)}
              className="group cursor-pointer aspect-[3/4] relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]"
            >
              {/* Image */}
              <img 
                src={exp.image} 
                alt={exp.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-3xl">{exp.icon}</span>
                   <span className="font-mono text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20">
                     ⭐ {exp.rating}
                   </span>
                </div>
                <h3 className="font-display text-2xl text-white mb-1 leading-tight group-hover:text-neon-green transition-colors">
                  {exp.name}
                </h3>
                <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">{exp.location}</p>
              </div>

              {/* Border Glow */}
              <div className="absolute inset-0 border-2 border-neon-green opacity-0 group-hover:opacity-40 transition-opacity rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelected(null)} />
            
            <motion.div
              layoutId={`card-${selected.id}`}
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,255,136,0.15)]"
            >
               <div className="grid grid-cols-1 md:grid-cols-2">
                 {/* Left: Image & Rating */}
                 <div className="relative h-64 md:h-auto">
                    <img src={selected.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <button 
                      onClick={() => setSelected(null)}
                      className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                    >
                       ✕
                    </button>
                 </div>

                 {/* Right: Content */}
                 <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                       {selected.tags.map(tag => (
                         <span key={tag} className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] border border-white/10 px-2 py-1 rounded">
                           {tag}
                         </span>
                       ))}
                    </div>

                    <h2 className="font-display text-5xl text-white mb-4 leading-none">{selected.name}</h2>
                    <p className="font-mono text-xs text-neon-green mb-8 tracking-[0.2em]">{selected.location}</p>
                    
                    <p className="font-body text-lg text-white/70 leading-relaxed mb-10">
                      {selected.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                       <div>
                         <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Entrance</p>
                         <p className="font-display text-3xl text-neon-gold">{selected.price}</p>
                       </div>
                       <div>
                         <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Rating</p>
                         <p className="font-display text-3xl text-white">⭐ {selected.rating}</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setSelected(null)}
                      className="mt-12 w-full py-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-display tracking-widest hover:bg-neon-green/20 transition-all"
                    >
                      ADD TO PLAYBOOK
                    </button>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
