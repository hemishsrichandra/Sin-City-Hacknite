import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'
import BookingConfirmModal from '../components/ui/BookingConfirmModal'
import { useUserStore } from '../store/userStore'

const shows = [
  { id: 'show-cirque', name: 'CIRQUE DU NOIR', type: 'Acrobatics', time: '8:00 PM', venue: 'The Obsidian Arena', price: 120, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80', desc: 'A gravity-defying spectacle in total darkness, lit only by neon laser lines. Cinematic performances mapping the edge of human limits.', acts: ['Aerial Silk Duo', 'Fire Breathing Finale', 'Contortion Trio'], duration: '90 min' },
  { id: 'show-velvet', name: 'VELVET ILLUSIONS', type: 'Magic', time: '9:30 PM', venue: 'The Enchanted Lounge', price: 85, rating: '⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80', desc: 'Close-up cyber-magic meets grand illusion in an intimate, luxurious velvet-draped lounge. Exclusive, limited seating.', acts: ['Card Manipulation', 'Teleportation Act', 'Mind Reading'], duration: '75 min' },
  { id: 'show-burlesque', name: 'ELECTRIC BURLESQUE', type: 'Cabaret', time: '10:00 PM', venue: 'The Neon Stage', price: 75, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', desc: 'The most daring cabaret show on the Strip. Glitzy cyber-noir outfits, feathers, and massive glowing neon signs.', acts: ['Opening Revue', 'Fan Dance', 'Grand Burlesque Finale'], duration: '60 min' },
  { id: 'show-comedy', name: 'COMEDY AFTERDARK', type: 'Comedy', time: '11:00 PM', venue: 'The Underground', price: 45, rating: '⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80', desc: 'Uncensored stand-up from comics who have nothing left to lose. Gritty, moody, underground.', acts: ['3 Comics', 'Headliner Set', 'Crowd Work'], duration: '120 min' },
  { id: 'show-phoenix', name: 'PHOENIX RISING', type: 'Concert', time: '7:30 PM', venue: 'The Grand Coliseum', price: 150, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', desc: 'A massive stadium concert experience. Explosive pyrotechnics and laser lights bringing the house down.', acts: ['DJ Opening', 'Star Performance', 'Encore Pyro Show'], duration: '150 min' },
  { id: 'show-ballet', name: 'SHADOW BALLET', type: 'Dance', time: '8:30 PM', venue: 'The Crystal Hall', price: 95, rating: '⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80', desc: 'Contemporary ballet behind a glowing, translucent screen creating mesmerizing geometric shadows.', acts: ['Solo Opening', 'Duo Shadow Play', 'Full Ensemble Finale'], duration: '80 min' },
]

export default function ShowsDistrict() {
  const { coins, hasItem } = useUserStore()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedShow, setSelectedShow] = useState<typeof shows[0] | null>(null)
  const [bookingItem, setBookingItem] = useState<typeof shows[0] | null>(null)

  const handleBookTicket = (show: typeof shows[0]) => {
    if (hasItem(show.id)) {
      setToast({ message: `${show.name} ticket already purchased!`, type: 'error' })
      return
    }
    // Open booking confirmation modal
    setBookingItem(show)
    setSelectedShow(null)
  }

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-void min-h-screen relative text-[var(--text-primary)] pb-24 pt-20"
    >
      <FlickerLight color="#BF00FF" intensity="medium" className="top-20 right-10" size={500} />
      <FlickerLight color="#E60039" intensity="high" className="bottom-40 left-10" size={400} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] px-6 py-3 rounded-full border shadow-2xl backdrop-blur-md"
            style={{
              background: toast.type === 'success' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(230, 0, 57, 0.15)',
              borderColor: toast.type === 'success' ? '#00FF88' : '#E60039',
              color: toast.type === 'success' ? '#00FF88' : '#E60039',
              boxShadow: toast.type === 'success' ? '0 0 20px rgba(0,255,136,0.3)' : '0 0 20px rgba(230,0,57,0.3)'
            }}
          >
            <span className="font-mono text-sm tracking-widest uppercase">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal removed — auth is enforced at App level */}

      {/* Booking Confirm Modal */}
      <BookingConfirmModal
        open={!!bookingItem}
        onClose={() => setBookingItem(null)}
        item={bookingItem ? {
          id: bookingItem.id,
          name: bookingItem.name,
          type: 'show',
          district: 'The Strip Shows',
          price: bookingItem.price,
          venue: bookingItem.venue,
          time: bookingItem.time,
        } : null}
      />

      {/* Show Details Modal */}
      <AnimatePresence>
        {selectedShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedShow(null) }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0a0a14 0%, #12061a 50%, #0a0a14 100%)',
                border: '1px solid rgba(191,0,255,0.2)',
                boxShadow: '0 0 80px rgba(191,0,255,0.15)',
              }}
            >
              {/* Modal Image */}
              <div className="relative h-64 overflow-hidden">
                <img src={selectedShow.image} alt={selectedShow.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedShow(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors text-lg z-20"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 -mt-8 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs px-3 py-1 bg-neon-purple/10 text-neon-purple rounded-full border border-neon-purple/30">{selectedShow.type}</span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{selectedShow.time}</span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">•</span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{selectedShow.duration}</span>
                </div>

                <h2 className="font-display text-4xl text-white mb-2">{selectedShow.name}</h2>
                <p className="font-body text-sm text-[var(--text-secondary)] mb-6">{selectedShow.desc}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Venue</p>
                    <p className="font-body text-sm text-[var(--text-primary)]">{selectedShow.venue}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Rating</p>
                    <p className="text-sm">{selectedShow.rating}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-3">Tonight's Acts</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedShow.acts.map((act) => (
                      <span key={act} className="px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <p className="font-display text-3xl neon-gold">🪙 {selectedShow.price}</p>
                  <motion.button
                    disabled={hasItem(selectedShow.id)}
                    whileHover={!hasItem(selectedShow.id) ? { scale: 1.03 } : {}}
                    whileTap={!hasItem(selectedShow.id) ? { scale: 0.97 } : {}}
                    onClick={() => handleBookTicket(selectedShow)}
                    className={`px-8 py-4 rounded-xl font-display text-lg tracking-widest transition-all duration-300 ${
                      hasItem(selectedShow.id)
                        ? 'bg-transparent border border-green-500/30 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]'
                    }`}
                  >
                    {hasItem(selectedShow.id) ? 'ACQUIRED ✓' : 'BOOK NOW'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col justify-end overflow-hidden px-6 md:px-16 pb-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-void to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-purple mb-4 block">The Highest Tier of Entertainment</span>
            <h1 className="font-display text-7xl md:text-[120px] leading-none mb-6 text-white drop-shadow-[0_0_20px_#BF00FF]">
              THE SHOWS
            </h1>
            <p className="font-body text-xl max-w-2xl text-[var(--text-secondary)] border-l-2 border-neon-purple pl-4">
              World-class spectacles, exclusive front-row seats, and unforgettable nights. Prepare to be mesmerized.
            </p>

            {/* Coin balance - always shown (user is always authed) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full"
              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}
            >
              <span className="font-display text-lg neon-gold">🪙 {coins.toLocaleString()}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">available</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Magazine Layout Shows */}
      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-7xl mx-auto space-y-32">
          {shows.map((show, index) => {
            const isEven = index % 2 === 0
            const owned = hasItem(show.id)

            return (
              <div key={show.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                
                {/* Image Section */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="w-full md:w-7/12 relative aspect-[4/3] md:aspect-[16/9] group cursor-pointer"
                  onClick={() => setSelectedShow(show)}
                >
                  <div className="absolute inset-0 bg-neon-purple opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl z-10 pointer-events-none" />
                  <img 
                    src={show.image} 
                    alt={show.name} 
                    className="w-full h-full object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="font-display text-2xl text-white bg-black/60 px-6 py-3 rounded-xl backdrop-blur-sm tracking-widest">
                      VIEW DETAILS →
                    </span>
                  </div>
                </motion.div>

                {/* Text / Booking Section */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full md:w-5/12 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-xs px-3 py-1 bg-neon-purple/10 text-neon-purple rounded-full border border-neon-purple/30">
                      {show.type}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
                      {show.time}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {show.duration}
                    </span>
                  </div>
                  
                  <h2 className="font-display text-5xl mb-2 text-white hover:text-neon-cyan transition-colors duration-300 cursor-pointer" onClick={() => setSelectedShow(show)}>
                    {show.name}
                  </h2>
                  <p className="font-mono text-xs text-[var(--text-muted)] mb-4">{show.venue}</p>
                  
                  <p className="font-body text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                    {show.desc}
                  </p>

                  <div className="flex items-end justify-between mb-8 pb-8 border-b border-white/10">
                    <div>
                      <p className="font-mono text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">Ticket Price</p>
                      <p className="font-display text-4xl neon-gold">
                        🪙 {show.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">Rating</p>
                      <p className="text-lg">{show.rating}</p>
                    </div>
                  </div>

                  <motion.button
                    disabled={owned}
                    whileHover={!owned ? { scale: 1.02 } : {}}
                    whileTap={!owned ? { scale: 0.98 } : {}}
                    onClick={() => handleBookTicket(show)}
                    className={`w-full py-5 px-8 flex justify-between items-center rounded-xl font-display text-xl tracking-widest transition-all duration-300 ${
                      owned 
                        ? 'bg-transparent border border-green-500/30 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]'
                    }`}
                  >
                    <span>{owned ? 'TICKET ACQUIRED ✓' : 'BOOK PREMIUM SEAT'}</span>
                    {!owned && <span>→</span>}
                  </motion.button>
                </motion.div>
                
              </div>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}
