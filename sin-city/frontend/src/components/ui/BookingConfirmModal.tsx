import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore, Booking } from '../../store/userStore'

interface BookingConfirmModalProps {
  open: boolean
  onClose: () => void
  item: {
    id: string
    name: string
    type: string       // "show", "escort", "cabaret", "substance"
    district: string   // "Shows", "Nightlife", "Cloud 9"
    price: number
    venue?: string
    time?: string
    image?: string
  } | null
}

function generateRefCode(): string {
  return 'BK-' + Math.random().toString(16).slice(2, 8).toUpperCase()
}

export default function BookingConfirmModal({ open, onClose, item }: BookingConfirmModalProps) {
  const { user, coins, removeCoins, addToInventory, addBooking, hasItem } = useUserStore()
  const [stage, setStage] = useState<'confirm' | 'success'>('confirm')
  const [refCode] = useState(generateRefCode)

  if (!item) return null

  const alreadyOwned = hasItem(item.id)
  const canAfford = coins >= item.price

  const handleConfirm = () => {
    if (!user || alreadyOwned || !canAfford) return

    const success = removeCoins(item.price)
    if (success) {
      addToInventory(item.id)

      const booking: Booking = {
        id: refCode,
        name: item.name,
        type: item.type,
        district: item.district,
        date: new Date().toISOString(),
        coins_spent: item.price,
        status: 'confirmed',
        details: {
          venue: item.venue || 'Sin City',
          time: item.time || 'Tonight',
          ref: refCode,
        }
      }
      addBooking(booking)
      setStage('success')
    }
  }

  const handleClose = () => {
    setStage('confirm')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0a0a14 0%, #0d0416 50%, #0a0a14 100%)',
              border: '1px solid rgba(255,215,0,0.15)',
              boxShadow: '0 0 80px rgba(255,215,0,0.08), 0 0 120px rgba(230,0,57,0.06)',
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClose() }}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all text-lg"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              ✕
            </button>

            <div className="p-8">
              {stage === 'confirm' ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="font-mono text-[10px] text-neon-gold tracking-[0.4em] uppercase mb-2"
                    >
                      Booking Confirmation
                    </motion.div>
                    <h2 className="font-display text-3xl text-white">{item.name}</h2>
                    <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{item.district}</p>
                  </div>

                  {/* Receipt-style details */}
                  <div
                    className="rounded-xl p-5 mb-6 space-y-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Reference</span>
                      <span className="font-mono text-sm text-neon-cyan">{refCode}</span>
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    {item.venue && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Venue</span>
                          <span className="font-body text-sm text-[var(--text-secondary)]">{item.venue}</span>
                        </div>
                        <div className="h-[1px] bg-white/5" />
                      </>
                    )}
                    {item.time && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Time</span>
                          <span className="font-body text-sm text-[var(--text-secondary)]">{item.time}</span>
                        </div>
                        <div className="h-[1px] bg-white/5" />
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Date</span>
                      <span className="font-body text-sm text-[var(--text-secondary)]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Type</span>
                      <span className="font-body text-sm text-[var(--text-secondary)] capitalize">{item.type}</span>
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-mono text-xs text-neon-gold uppercase font-bold">Total</span>
                      <span className="font-display text-2xl neon-gold">🪙 {item.price}</span>
                    </div>
                  </div>

                  {/* Balance check */}
                  <div className="text-center mb-6">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      Your balance: <span className={canAfford ? 'text-neon-gold' : 'text-neon-crimson'}>{coins.toLocaleString()} coins</span>
                      {!canAfford && <span className="text-neon-crimson ml-2">(Need {item.price - coins} more)</span>}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-3 rounded-xl font-body font-semibold text-sm uppercase tracking-wider border border-white/10 text-[var(--text-muted)] hover:text-white hover:border-white/20 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={!canAfford || alreadyOwned}
                      whileHover={canAfford && !alreadyOwned ? { scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' } : {}}
                      whileTap={canAfford && !alreadyOwned ? { scale: 0.98 } : {}}
                      onClick={handleConfirm}
                      className={`flex-1 py-3 rounded-xl font-display text-lg tracking-widest transition-all ${
                        canAfford && !alreadyOwned
                          ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:shadow-lg'
                          : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                      }`}
                    >
                      {alreadyOwned ? 'ALREADY BOOKED' : 'CONFIRM'}
                    </motion.button>
                  </div>
                </>
              ) : (
                /* Success receipt */
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6"
                >
                  {/* Confetti burst effect */}
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8 }}
                  >
                    🎟️
                  </motion.div>
                  <h2
                    className="font-display text-4xl mb-2"
                    style={{
                      color: '#FFD700',
                      textShadow: '0 0 15px #FFD700, 0 0 40px #FFD70066',
                    }}
                  >
                    CONFIRMED!
                  </h2>
                  <p className="font-body text-lg text-[var(--text-secondary)] mb-4">
                    {item.name}
                  </p>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="inline-block px-6 py-3 rounded-xl mb-4"
                    style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)' }}
                  >
                    <p className="font-mono text-xs text-[var(--text-muted)] mb-1">BOOKING REFERENCE</p>
                    <p className="font-display text-2xl text-neon-cyan">{refCode}</p>
                  </motion.div>

                  <p className="font-mono text-xs text-[var(--text-muted)] mb-6">
                    View all bookings in MY BOOKINGS
                  </p>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="px-8 py-3 rounded-xl font-display text-lg tracking-widest bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black"
                  >
                    DONE
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
