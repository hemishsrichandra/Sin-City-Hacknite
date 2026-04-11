import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserStore, Booking } from '../store/userStore'
import FlickerLight from '../components/ui/FlickerLight'
import { useEffect } from 'react'

const districtIcons: Record<string, string> = {
  'The Strip Shows': '🎭',
  'Neon Nightlife': '🌙',
  'Cloud 9': '☁️',
  'Casino Floor': '🎰',
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: 'rgba(0,245,255,0.08)', text: '#00F5FF', border: 'rgba(0,245,255,0.3)' },
  completed: { bg: 'rgba(0,255,136,0.08)', text: '#00FF88', border: 'rgba(0,255,136,0.3)' },
  cancelled: { bg: 'rgba(230,0,57,0.08)', text: '#E60039', border: 'rgba(230,0,57,0.3)' },
}

export default function MyBookings() {
  const navigate = useNavigate()
  const { user, coins, bookings } = useUserStore()

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  if (!user) return null

  const activeBookings = bookings.filter(b => b.status === 'confirmed')
  const pastBookings = bookings.filter(b => b.status !== 'confirmed')
  const totalSpent = bookings.reduce((sum, b) => sum + b.coins_spent, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-void text-[var(--text-primary)] pt-24 pb-20 px-6"
    >
      <FlickerLight color="#FFD700" intensity="low" className="top-20 right-10" size={400} />
      <FlickerLight color="#E60039" intensity="low" className="bottom-40 left-10" size={350} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-neon-gold mb-3 block">Your Portfolio</span>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-4">MY BOOKINGS</h1>
          <div className="h-[1px] bg-gradient-to-r from-neon-gold/40 via-neon-gold/10 to-transparent" />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {[
            { label: 'Total Bookings', value: bookings.length.toString(), icon: '🎟️' },
            { label: 'Coins Spent', value: totalSpent.toLocaleString(), icon: '🪙' },
            { label: 'Current Balance', value: coins.toLocaleString(), icon: '💰' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="font-display text-2xl text-white mb-1">{stat.value}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl text-neon-cyan mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              ACTIVE BOOKINGS
            </h2>
            <div className="space-y-4">
              {activeBookings.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl text-[var(--text-muted)] mb-6">PAST BOOKINGS</h2>
            <div className="space-y-4 opacity-60">
              {pastBookings.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6 opacity-40">🎟️</div>
            <h3 className="font-display text-3xl text-[var(--text-muted)] mb-4">NO BOOKINGS YET</h3>
            <p className="font-body text-lg text-[var(--text-muted)] mb-8 max-w-md mx-auto">
              Explore the districts and book shows, experiences, and more. All your reservations will appear here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/districts')}
              className="px-8 py-4 rounded-xl font-display text-lg tracking-widest bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black"
            >
              EXPLORE DISTRICTS
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const icon = districtIcons[booking.district] || '🎯'
  const colors = statusColors[booking.status] || statusColors.confirmed
  const date = new Date(booking.date)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl p-5 flex items-center gap-5 group hover:scale-[1.01] transition-transform duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `0 0 0 0 ${colors.border}`,
      }}
      whileHover={{
        boxShadow: `0 0 20px ${colors.border}`,
      }}
    >
      {/* District Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-display text-xl text-white truncate">{booking.name}</h3>
          <span
            className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border flex-shrink-0"
            style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
          >
            {booking.status}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">{booking.district}</span>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {booking.details?.venue && (
            <span className="font-mono text-xs text-[var(--text-muted)]">{booking.details.venue}</span>
          )}
        </div>
      </div>

      {/* Reference & Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-mono text-xs text-neon-cyan mb-1">{booking.id}</p>
        <p className="font-display text-lg neon-gold">🪙 {booking.coins_spent}</p>
      </div>
    </motion.div>
  )
}
