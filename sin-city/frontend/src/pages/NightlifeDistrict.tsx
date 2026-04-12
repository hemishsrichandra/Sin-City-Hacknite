import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'
import GlowCard from '../components/ui/GlowCard'
import BookingConfirmModal from '../components/ui/BookingConfirmModal'
import { useUserStore } from '../store/userStore'

import lunaVossImg from '../assets/luna_voss.png'
import sakuraMinxImg from '../assets/sakura_minx.png'
import zaraKnightImg from '../assets/zara_knight.png'
import naomiBlazeImg from '../assets/naomi_blaze.png'
import isabellaRoseImg from '../assets/isabella_rose.png'
import VIPRoomImg from '../assets/vip_lounge.png'
import heroImg from '../assets/hero.png'

const escorts = [
  { 
    id: 'escort-luna',
    name: 'LUNA VOSS', 
    ethnicity: 'Eastern European', 
    age: '24', 
    specialty: 'Sensual GFE + Deepthroat', 
    price: 550, 
    tags: ['GFE', 'ORAL', 'ANAL'],
    heat: '🔥🔥🔥🔥',
    image: lunaVossImg
  },
  { 
    id: 'escort-sakura',
    name: 'SAKURA MINX', 
    ethnicity: 'Japanese-Korean', 
    age: '22', 
    specialty: 'Shibari & Submissive Play', 
    price: 670, 
    tags: ['BDSM', 'FETISH', 'ROLEPLAY'],
    heat: '🔥🔥🔥',
    image: sakuraMinxImg
  },
  { 
    id: 'escort-zara',
    name: 'ZARA KNIGHT', 
    ethnicity: 'Brazilian', 
    age: '26', 
    specialty: 'Passionate Latin Passion + Twerk', 
    price: 650, 
    tags: ['LATINA', 'DANCE', 'FULL SERVICE'],
    heat: '🔥🔥🔥🔥🔥',
    image: zaraKnightImg 
  },
  { 
    id: 'escort-naomi',
    name: 'NAOMI BLAZE', 
    ethnicity: 'Ebony', 
    age: '25', 
    specialty: 'Dominatrix Experience + Foot Worship', 
    price: 580, 
    tags: ['DOM', 'FETISH', 'BDSM'],
    heat: '🔥🔥🔥🔥',
    image: naomiBlazeImg
  },
  { 
    id: 'escort-isabella',
    name: 'ISABELLA ROSE', 
    ethnicity: 'Latina', 
    age: '23', 
    specialty: 'Pornstar Experience + Squirting', 
    price: 700, 
    tags: ['PSE', 'SQUIRT', 'ANAL'],
    heat: '🔥🔥🔥',
    image: isabellaRoseImg
  },
]

const cabaretShows = [
  { id: 'show-rouge', name: 'ROUGE — THE SHOW', time: '10:00 PM', venue: 'The Crimson Theatre', rating: '18+', price: 95, description: 'A provocative journey through burlesque, acrobatics, and seduction.' },
  { id: 'show-afterdark', name: 'AFTER DARK CABARET', time: '11:30 PM', venue: 'Velvet Curtain Room', rating: '21+', price: 120, description: 'Intimate cabaret with world-class performers. No cameras allowed.' },
  { id: 'show-midnight', name: 'MIDNIGHT REVUE', time: '12:00 AM', venue: 'The Underground', rating: '21+', price: 85, description: 'Where burlesque meets jazz. The last show standing.' },
]

const vibeOptions = ['GFE', 'BDSM', 'PSE', 'FETISH']

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl font-body text-sm font-semibold"
      style={{
        background: type === 'success' 
          ? 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05))'
          : 'linear-gradient(135deg, rgba(230,0,57,0.15), rgba(230,0,57,0.05))',
        border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.3)' : 'rgba(230,0,57,0.3)'}`,
        color: type === 'success' ? '#00FF88' : '#E60039',
        boxShadow: `0 0 30px ${type === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(230,0,57,0.1)'}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {message}
    </motion.div>
  )
}

// ─── AGE VERIFICATION GATE ────────────────────────────────────────────────────
function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [hovering, setHovering] = useState(false)
  const [denied, setDenied] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0a0015 0%, #000000 100%)' }}
    >
      {/* Velvet rope lines */}
      <div className="absolute top-0 left-[20%] w-[2px] h-full opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #E60039, transparent)' }} />
      <div className="absolute top-0 right-[20%] w-[2px] h-full opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #E60039, transparent)' }} />
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-md px-8"
      >
        {/* Bouncer silhouette */}
        <motion.div
          className="mx-auto mb-8 relative"
          style={{ width: 120, height: 160 }}
          animate={hovering ? { scale: 1.05 } : { scale: 1 }}
        >
          <svg viewBox="0 0 120 160" className="w-full h-full">
            {/* Body */}
            <ellipse cx="60" cy="145" rx="35" ry="15" fill="#111" />
            <rect x="35" y="60" width="50" height="85" rx="8" fill="#1a1a1a" />
            {/* Head */}
            <circle cx="60" cy="40" r="22" fill="#1a1a1a" />
            {/* Sunglasses */}
            <rect x="42" y="33" width="15" height="8" rx="3" fill="#333" />
            <rect x="62" y="33" width="15" height="8" rx="3" fill="#333" />
            <rect x="57" y="35" width="5" height="4" fill="#333" />
            {/* Arms crossed */}
            <rect x="20" y="75" width="25" height="12" rx="6" fill="#1a1a1a" transform="rotate(-15 32 81)" />
            <rect x="75" y="75" width="25" height="12" rx="6" fill="#1a1a1a" transform="rotate(15 88 81)" />
            {/* Earpiece glow */}
            <motion.circle
              cx="82" cy="38" r="3" fill="#E60039"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
        {/* Neon sign */}
        <motion.h1
          className="font-display text-5xl md:text-7xl mb-2"
          style={{
            color: '#E60039',
            textShadow: '0 0 10px #E60039, 0 0 40px #E6003966, 0 0 80px #E6003933',
          }}
          animate={{ opacity: [1, 0.7, 1, 0.9, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          AFTER HOURS
        </motion.h1>
        <p className="font-mono text-sm text-[var(--text-secondary)] mb-8">
          This section contains heavily explicit, adult, and kinky sexual content.
        </p>
        <p className="font-body text-lg text-[var(--text-primary)] mb-6">
          Are you 21 or older?
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px #E6003966' }}
            whileTap={{ scale: 0.95 }}
            onClick={onVerified}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="px-10 py-3 rounded-lg font-display text-xl tracking-wider border-2 border-neon-crimson text-neon-crimson hover:bg-neon-crimson hover:text-black transition-all duration-300"
          >
            I'M IN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDenied(true)}
            className="px-10 py-3 rounded-lg font-display text-xl tracking-wider border border-white/20 text-[var(--text-muted)] hover:border-white/40 transition-all"
          >
            NOT YET
          </motion.button>
        </div>
        <AnimatePresence>
          {denied && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 font-mono text-sm text-neon-crimson"
            >
              The bouncer shakes his head. Come back when you're ready.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── NEON SIGN ("GIRLS GIRLS GIRLS" style) ────────────────────────────────────
function FlickeringNeonSign({ text, color = '#E60039' }: { text: string; color?: string }) {
  return (
    <div className="relative inline-block">
      <motion.span
        className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider block"
        style={{
          color: color,
          textShadow: `0 0 7px ${color}, 0 0 20px ${color}88, 0 0 42px ${color}44, 0 0 82px ${color}22, 0 0 92px ${color}11`,
        }}
        animate={{
          opacity: [1, 1, 0.4, 1, 1, 1, 0.6, 1, 1, 0.3, 1, 1, 1, 1, 0.5, 1],
          textShadow: [
            `0 0 7px ${color}, 0 0 20px ${color}88, 0 0 42px ${color}44`,
            `0 0 7px ${color}, 0 0 20px ${color}88, 0 0 42px ${color}44`,
            `0 0 2px ${color}44, 0 0 5px ${color}22`,
            `0 0 7px ${color}, 0 0 20px ${color}88, 0 0 42px ${color}44`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        {text}
      </motion.span>
      {/* Reflection */}
      <div
        className="absolute -bottom-2 left-0 right-0 h-4 opacity-20 blur-sm"
        style={{ background: `linear-gradient(to bottom, ${color}44, transparent)` }}
      />
    </div>
  )
}

// ─── RISQUÉ CARD DEALER ────────────────────────────────────────────────────────

// ─── MATURE VIP ROOM ───────────────────────────────────────────────────────────
function VIPRoom() {
  const { coins, removeCoins, addToInventory, hasItem } = useUserStore()
  const [unlocking, setUnlocking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const secretCode = ['♠️', '♥️', '♦️']

  const vipItems = [
    { 
      id: 'vip-kink-sub',
      name: 'PREMIUM KINK SUBSCRIPTION', 
      desc: 'Monthly unlimited access to all private BDSM suites, fetish rooms, and elite companions. Includes custom scenes.', 
      price: 4999, 
      icon: '⛓️' 
    },
    { 
      id: 'vip-bdsm',
      name: 'BDSM PLAYROOM', 
      desc: 'Fully equipped dungeon with suspension rigs, spanking benches, and professional dominatrix on staff.', 
      price: 1200, 
      icon: '🖤' 
    },
    { 
      id: 'vip-taboo',
      name: 'TABOO SUITE', 
      desc: 'Roleplay, CNC, age play, and extreme fetish experiences in total discretion.', 
      price: 2500, 
      icon: '🔞' 
    },
    { 
      id: 'vip-elite',
      name: 'ELITE COMPANION CLUB', 
      desc: 'Hand-selected models for overnight GFE, threesomes, and group kink sessions.', 
      price: 3000, 
      icon: '💎' 
    },
  ]

  const handleKeyPress = (symbol: string) => {
    const next = [...keySequence, symbol]
    setKeySequence(next)
    if (next.length === secretCode.length) {
      if (next.every((s, i) => s === secretCode[i])) {
        setUnlocking(true)
        setTimeout(() => {
          setUnlocked(true)
          setUnlocking(false)
        }, 2500)
      } else {
        setTimeout(() => setKeySequence([]), 500)
      }
    }
  }

  const handleBuyVip = (item: typeof vipItems[0]) => {
    if (hasItem(item.id)) {
      setToast({ message: 'Already booked!', type: 'error' })
      return
    }
    if (coins < item.price) {
      setToast({ message: `Need ${item.price - coins} more coins! Hit the Casino! 🎰`, type: 'error' })
      return
    }
    const success = removeCoins(item.price)
    if (success) {
      addToInventory(item.id)
      setToast({ message: `${item.name} booked! 🔥`, type: 'success' })
    }
  }

  if (unlocking) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-24 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: 'linear' }}
          className="mx-auto w-20 h-20 border-2 border-neon-gold border-t-transparent rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ duration: 2 }}
          className="mt-6 font-mono text-sm text-neon-gold"
        >
          UNLOCKING ELITE KINK ACCESS...
        </motion.p>
      </motion.div>
    )
  }

  if (unlocked) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 relative overflow-hidden rounded-3xl border border-neon-gold/20"
        >
          <div className="absolute inset-0 z-0">
            <img src={VIPRoomImg} className="w-full h-full object-cover opacity-40 mix-blend-lighten" alt="VIP Lounge" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14]/90 via-[#0a0a14]/60 to-[#0a0a14]/90" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <motion.h2
              className="font-display text-5xl md:text-7xl text-center mb-4"
              style={{
                color: '#FFD700',
                textShadow: '0 0 15px #FFD700, 0 0 40px #FFD70066, 0 0 80px #FFD70033',
              }}
              initial={{ y: 30 }}
              animate={{ y: 0 }}
            >
              WELCOME TO THE KINK VAULT
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-mono text-sm text-center text-[var(--text-secondary)] mb-12"
            >
              Unlimited access to premium BDSM, fetish, and taboo experiences.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vipItems.map((room, i) => {
                const owned = hasItem(room.id)
                return (
                  <motion.div
                    key={room.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.2 }}
                  >
                    <GlowCard accentColor="#FFD700" className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{room.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-display text-xl text-[var(--text-primary)] mb-1">{room.name}</h3>
                          <p className="font-body text-sm text-[var(--text-secondary)] mb-2">{room.desc}</p>
                          <span className="font-display text-lg neon-gold">🪙 {room.price.toLocaleString()}</span>
                          <motion.button
                            whileHover={!owned ? { scale: 1.03 } : {}}
                            onClick={() => handleBuyVip(room)}
                            disabled={owned}
                            className={`mt-4 block w-full py-2 text-xs font-display tracking-widest border transition-all ${
                              owned
                                ? 'border-green-500/40 text-green-400 bg-green-500/10 cursor-default'
                                : 'border-neon-gold text-neon-gold hover:bg-neon-gold hover:text-black'
                            }`}
                          >
                            {owned ? 'BOOKED ✓' : 'BOOK SESSION'}
                          </motion.button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="py-20 text-center">
      {/* Locked door */}
      <motion.div
        className="mx-auto relative mb-8"
        style={{ width: 160, height: 220 }}
      >
        <svg viewBox="0 0 160 220" className="w-full h-full">
          {/* Door frame */}
          <rect x="20" y="10" width="120" height="200" rx="8" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
          <rect x="25" y="15" width="110" height="190" rx="6" fill="#0a0a14" stroke="#FFD700" strokeWidth="1" opacity="0.3" />
          {/* VIP text on door */}
          <text x="80" y="90" fill="#FFD700" fontSize="28" fontFamily="var(--font-display)" textAnchor="middle" opacity="0.8">KINK VAULT</text>
          {/* Keyhole */}
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx="120" cy="120" r="8" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <rect x="118" y="128" width="4" height="10" rx="2" fill="#FFD700" opacity="0.5" />
          </motion.g>
          {/* Lock icon */}
          <motion.path
            d="M 65 140 L 65 130 Q 65 115 80 115 Q 95 115 95 130 L 95 140"
            stroke="#FFD700"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </motion.div>
      <h3 className="font-display text-3xl neon-gold mb-2">KINK VAULT — LOCKED</h3>
      <p className="font-mono text-xs text-[var(--text-secondary)] mb-8">
        Enter the code to gain access: ♠️ ♥️ ♦️
      </p>
      {/* Key input */}
      <div className="flex justify-center gap-3 mb-4">
        {['♠️', '♥️', '♦️', '♣️'].map((symbol) => (
          <motion.button
            key={symbol}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress(symbol)}
            className="w-14 h-14 rounded-lg font-bold text-2xl border transition-all duration-200"
            style={{
              background: '#0a0a14',
              borderColor: symbol === '♥️' || symbol === '♦️' ? '#E6003944' : '#ffffff22',
              color: symbol === '♥️' || symbol === '♦️' ? '#E60039' : '#ddd',
            }}
          >
            {symbol}
          </motion.button>
        ))}
      </div>
      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {secretCode.map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              background: i < keySequence.length ? '#FFD700' : '#333',
              boxShadow: i < keySequence.length ? '0 0 8px #FFD700' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function NightlifeDistrict() {
  const [verified, setVerified] = useState(false)
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [bookingItem, setBookingItem] = useState<{ id: string; name: string; type: string; district: string; price: number; venue?: string; time?: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const { coins, hasItem } = useUserStore()

  const filteredEscorts = selectedVibe
    ? escorts.filter(e => e.tags.includes(selectedVibe))
    : escorts

  const handleBookEscort = (escort: typeof escorts[0]) => {
    if (hasItem(escort.id)) {
      setToast({ message: `${escort.name} already booked!`, type: 'error' })
      return
    }
    setBookingItem({
      id: escort.id,
      name: escort.name,
      type: 'escort',
      district: 'Neon Nightlife',
      price: escort.price,
      venue: 'Private Suite',
      time: 'Tonight',
    })
  }

  const handleBookShow = (show: typeof cabaretShows[0]) => {
    if (hasItem(show.id)) {
      setToast({ message: 'Already reserved!', type: 'error' })
      return
    }
    setBookingItem({
      id: show.id,
      name: show.name,
      type: 'cabaret',
      district: 'Neon Nightlife',
      price: show.price,
      venue: show.venue,
      time: show.time,
    })
  }

  // Bass visualizer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 80
    }
    resize()
    window.addEventListener('resize', resize)
    let time = 0
    const barCount = 32
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = canvas.width / barCount - 2
      for (let i = 0; i < barCount; i++) {
        const height = 15 + Math.abs(Math.sin((i * 0.3) + time * 2)) * 55
        const x = i * (barWidth + 2)
        const hue = 320 + (i / barCount) * 40
        ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
        ctx.shadowBlur = 10
        ctx.fillRect(x, canvas.height - height, barWidth, height)
      }
      time += 0.016
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* Age Gate */}
      <AnimatePresence>
        {!verified && <AgeGate onVerified={() => setVerified(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen pt-20 bg-bg-void relative pb-28"
      >
        {/* Ambient lights */}
        <FlickerLight color="#E60039" intensity="high" className="top-20 left-10" size={350} />
        <FlickerLight color="#BF00FF" intensity="medium" className="top-40 right-20" size={300} />
        <FlickerLight color="#E60039" intensity="low" className="bottom-40 left-1/3" size={250} />

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="relative py-32 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroImg} className="w-full h-full object-cover opacity-50 mix-blend-luminosity" alt="Seductive Host" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0004] via-[#0A0004]/60 to-transparent" />
          </div>
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-6xl md:text-[96px] neon-crimson leading-none mb-4"
            >
              NEON DESIRE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-base text-[var(--text-secondary)]"
            >
              Premium escorts • Explicit encounters • No limits after midnight
            </motion.p>

            {/* Coin balance - always shown (auth enforced globally) */}
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
          </div>
        </section>

        {/* ─── FLICKERING NEON SIGNS ────────────────────────── */}
        <section className="py-16 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
            <FlickeringNeonSign text="GIRLS GIRLS GIRLS" color="#E60039" />
            <div className="flex gap-8 md:gap-16 flex-wrap justify-center">
              <FlickeringNeonSign text="ESCORTS" color="#00F5FF" />
              <FlickeringNeonSign text="KINK" color="#E60039" />
              <FlickeringNeonSign text="XXX" color="#BF00FF" />
            </div>
            <FlickeringNeonSign text="BOOK NOW • 24/7" color="#FFD700" />
          </div>
        </section>

        {/* ─── PREMIUM ESCORTS GALLERY ──────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-5xl text-center neon-crimson mb-3">PREMIUM COMPANIONS</h2>
            <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-12">
              Hand-selected. Discreet. Unforgettable. All services are explicit and consensual.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {vibeOptions.map((vibe) => (
                <motion.button
                  key={vibe}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                  className={`px-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300 border ${
                    selectedVibe === vibe
                      ? 'bg-neon-crimson/20 border-neon-crimson text-neon-crimson shadow-[0_0_20px_#E6003944]'
                      : 'bg-transparent border-white/20 text-[var(--text-secondary)] hover:border-white/40'
                  }`}
                >
                  {vibe}
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {filteredEscorts.map((escort, i) => {
                  const owned = hasItem(escort.id)
                  return (
                    <motion.div
                      key={escort.name}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlowCard accentColor="#E60039" className="overflow-hidden group">
                        <div className="relative h-96">
                          <img 
                            src={escort.image} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={escort.name} 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="font-display text-3xl text-white">{escort.name}</h3>
                                <p className="text-sm text-white/70">{escort.ethnicity} • {escort.age}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-display text-2xl neon-gold">🪙 {escort.price}</div>
                                <div className="text-xs text-white/60">{escort.heat}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="font-body text-sm mb-4 text-[var(--text-secondary)]">{escort.specialty}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {escort.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 text-[10px] font-mono bg-white/5 border border-white/10 rounded-full text-white/70">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <motion.button
                            whileHover={!owned ? { scale: 1.02 } : {}}
                            whileTap={!owned ? { scale: 0.98 } : {}}
                            onClick={() => handleBookEscort(escort)}
                            disabled={owned}
                            className={`w-full py-4 font-display tracking-widest text-sm transition-all ${
                              owned
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default'
                                : 'bg-neon-crimson hover:bg-white hover:text-black text-black'
                            }`}
                          >
                            {owned ? `BOOKED ✓` : `BOOK — 🪙 ${escort.price}`}
                          </motion.button>
                        </div>
                      </GlowCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ─── CABARET SHOWS ────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl text-center neon-purple mb-2">CABARET & BURLESQUE</h2>
            <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-10">
              Tonight's performances. Reservations required.
            </p>
            <div className="space-y-4">
              {cabaretShows.map((show, i) => {
                const owned = hasItem(show.id)
                return (
                  <motion.div
                    key={show.name}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <GlowCard accentColor="#BF00FF" className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-2xl text-[var(--text-primary)]">{show.name}</h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-crimson/20 text-neon-crimson border border-neon-crimson/30">
                              {show.rating}
                            </span>
                          </div>
                          <p className="font-body text-sm text-[var(--text-secondary)] mb-1">{show.description}</p>
                          <p className="font-mono text-xs text-[var(--text-muted)]">{show.venue} · {show.time}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display text-2xl neon-gold">🪙 {show.price}</span>
                          <motion.button
                            whileHover={!owned ? { scale: 1.05 } : {}}
                            whileTap={!owned ? { scale: 0.95 } : {}}
                            onClick={() => handleBookShow(show)}
                            disabled={owned}
                            className={`px-6 py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider border transition-all ${
                              owned
                                ? 'border-green-500/40 text-green-400 bg-green-500/10 cursor-default'
                                : 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black'
                            }`}
                          >
                            {owned ? 'RESERVED ✓' : 'Reserve Seat'}
                          </motion.button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>


        {/* ─── VIP ROOM ─────────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent mb-16" />
            <VIPRoom />
          </div>
        </section>

        {/* Bass visualizer */}
        <div className="fixed bottom-0 left-0 w-full pointer-events-none z-10">
          <canvas ref={canvasRef} className="w-full" style={{ height: 80 }} />
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>


      {/* Booking Confirm Modal */}
      <BookingConfirmModal
        open={!!bookingItem}
        onClose={() => setBookingItem(null)}
        item={bookingItem}
      />
    </>
  )
}