import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'
import GlowCard from '../components/ui/GlowCard'

const venues = [
  { name: 'NEON PULSE', genre: 'Techno', vibe: 8, cover: '$40', tags: ['TECHNO'], heat: '🔥🔥🔥' },
  { name: 'VELVET UNDERGROUND', genre: 'Hip-Hop', vibe: 7, cover: '$30', tags: ['HIP-HOP'], heat: '🔥🔥' },
  { name: 'THE MIRAGE LOUNGE', genre: 'Live Band', vibe: 9, cover: '$50', tags: ['LIVE BAND'], heat: '🔥🔥🔥🔥' },
  { name: 'ELECTRIC CHAPEL', genre: 'Techno', vibe: 6, cover: '$35', tags: ['TECHNO'], heat: '🔥🔥' },
  { name: 'GOLD ROOM', genre: 'Hip-Hop', vibe: 8, cover: '$45', tags: ['HIP-HOP'], heat: '🔥🔥🔥' },
  { name: 'CRIMSON STAGE', genre: 'Live Band', vibe: 10, cover: '$60', tags: ['LIVE BAND'], heat: '🔥🔥🔥🔥🔥' },
]

const cabaretShows = [
  { name: 'ROUGE — THE SHOW', time: '10:00 PM', venue: 'The Crimson Theatre', rating: '18+', price: '$95', description: 'A provocative journey through burlesque, acrobatics, and seduction.' },
  { name: 'AFTER DARK CABARET', time: '11:30 PM', venue: 'Velvet Curtain Room', rating: '21+', price: '$120', description: 'Intimate cabaret with world-class performers. No cameras allowed.' },
  { name: 'MIDNIGHT REVUE', time: '12:00 AM', venue: 'The Underground', rating: '21+', price: '$85', description: 'Where burlesque meets jazz. The last show standing.' },
]

const vibeOptions = ['TECHNO', 'HIP-HOP', 'LIVE BAND']

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
          This section contains heavily explicit and kinky content.
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

// ─── BURLESQUE DANCER SILHOUETTE ───────────────────────────────────────────────
function BurlesqueDancer({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: 100, height: 180 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <svg viewBox="0 0 100 180" className="w-full h-full">
        <defs>
          <linearGradient id={`dancer-glow-${delay}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E60039" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BF00FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Silhouette body */}
        <motion.g
          animate={{
            rotate: [0, -3, 0, 3, 0],
            y: [0, -2, 0, -2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: delay * 0.5, ease: 'easeInOut' }}
        >
          {/* Head */}
          <circle cx="50" cy="25" r="10" fill="#111" />
          {/* Hair plume */}
          <motion.path
            d="M 45 17 Q 50 5 55 17"
            stroke="#E60039"
            strokeWidth="2"
            fill="none"
            animate={{ d: ['M 45 17 Q 50 5 55 17', 'M 45 17 Q 48 3 55 17', 'M 45 17 Q 52 3 55 17', 'M 45 17 Q 50 5 55 17'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Neck */}
          <rect x="47" y="35" width="6" height="8" fill="#111" />
          {/* Torso */}
          <path d="M 35 43 Q 50 40 65 43 L 60 90 Q 50 95 40 90 Z" fill="#111" />
          {/* Feather boa */}
          <motion.path
            d="M 30 50 Q 50 45 70 50"
            stroke="#E60039"
            strokeWidth="3"
            fill="none"
            opacity="0.7"
            animate={{ d: ['M 30 50 Q 50 45 70 50', 'M 28 48 Q 50 42 72 48', 'M 30 50 Q 50 45 70 50'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Left leg */}
          <motion.path
            d="M 42 90 L 30 140 L 25 170"
            stroke="#111"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M 42 90 L 30 140 L 25 170', 'M 42 90 L 35 140 L 30 170', 'M 42 90 L 30 140 L 25 170'] }}
            transition={{ duration: 4, repeat: Infinity, delay: delay * 0.3 }}
          />
          {/* Right leg */}
          <motion.path
            d="M 58 90 L 70 140 L 75 170"
            stroke="#111"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M 58 90 L 70 140 L 75 170', 'M 58 90 L 65 140 L 70 170', 'M 58 90 L 70 140 L 75 170'] }}
            transition={{ duration: 4, repeat: Infinity, delay: delay * 0.3 }}
          />
          {/* High heels */}
          <path d="M 20 168 L 30 168 L 25 173 Z" fill="#E60039" />
          <path d="M 70 168 L 80 168 L 75 173 Z" fill="#E60039" />
        </motion.g>
        {/* Spotlight */}
        <ellipse cx="50" cy="175" rx="30" ry="5" fill={`url(#dancer-glow-${delay})`} opacity="0.5" />
      </svg>
    </motion.div>
  )
}

// ─── RISQUÉ CARD DEALER ────────────────────────────────────────────────────────
function CardDealerAnimation() {
  const cards = ['♠', '♥', '♦', '♣']
  const [dealtCards, setDealtCards] = useState<number[]>([])
  const [dealing, setDealing] = useState(false)

  const deal = () => {
    if (dealing) return
    setDealing(true)
    setDealtCards([])
    
    cards.forEach((_, i) => {
      setTimeout(() => {
        setDealtCards(prev => [...prev, i])
        if (i === cards.length - 1) {
          setTimeout(() => setDealing(false), 500)
        }
      }, i * 400)
    })
  }

  return (
    <div className="flex flex-col items-center">
      {/* Dealer silhouette */}
      <div className="relative mb-6">
        <svg viewBox="0 0 200 120" className="w-48 h-28">
          {/* Table edge */}
          <path d="M 0 100 Q 100 120 200 100" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.5" />
          <ellipse cx="100" cy="105" rx="90" ry="15" fill="#0a3d0a" opacity="0.3" />
          {/* Dealer silhouette */}
          <circle cx="100" cy="30" r="15" fill="#111" />
          <path d="M 75 45 Q 100 40 125 45 L 120 85 Q 100 90 80 85 Z" fill="#111" />
          {/* Bow tie */}
          <motion.g animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <polygon points="93,48 100,52 107,48 100,44" fill="#E60039" />
          </motion.g>
          {/* Dealing arm */}
          <motion.path
            d="M 125 55 L 150 70 L 155 68"
            stroke="#111"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            animate={dealing ? { d: ['M 125 55 L 150 70 L 155 68', 'M 125 55 L 160 60 L 170 55', 'M 125 55 L 150 70 L 155 68'] } : {}}
            transition={{ duration: 0.3, repeat: dealing ? Infinity : 0 }}
          />
        </svg>
      </div>

      {/* Dealt cards */}
      <div className="flex gap-3 mb-6 h-24">
        <AnimatePresence>
          {dealtCards.map((cardIdx) => (
            <motion.div
              key={cardIdx}
              initial={{ rotateY: 180, x: -50, opacity: 0 }}
              animate={{ rotateY: 0, x: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-16 h-24 rounded-lg flex items-center justify-center text-3xl font-bold border"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                borderColor: cardIdx % 2 === 1 ? '#E60039' : '#888',
                color: cardIdx % 2 === 1 ? '#E60039' : '#ddd',
                boxShadow: cardIdx % 2 === 1 ? '0 0 15px #E6003944' : 'none',
              }}
            >
              {cards[cardIdx]}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={deal}
        disabled={dealing}
        className="px-8 py-2 rounded-lg font-display text-lg tracking-wider border border-neon-crimson text-neon-crimson hover:bg-neon-crimson hover:text-black transition-all disabled:opacity-50"
      >
        {dealing ? 'DEALING...' : 'DEAL ME IN'}
      </motion.button>
    </div>
  )
}

// ─── VIP ROOM ──────────────────────────────────────────────────────────────────
function VIPRoom() {
  const [unlocking, setUnlocking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const secretCode = ['♠', '♥', '♦']

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
          UNLOCKING VIP ACCESS...
        </motion.p>
      </motion.div>
    )
  }

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 relative overflow-hidden rounded-3xl border border-neon-gold/20"
      >
        <div className="absolute inset-0 z-0">
          <img src="/@fs/Users/hemish/.gemini/antigravity/brain/61816b40-6441-4ea1-a9db-5752d9dc6ced/kinky_vip_lounge_1775744595766.png" className="w-full h-full object-cover opacity-40 mix-blend-lighten" alt="VIP Lounge" />
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
            WELCOME TO THE VIP ROOM
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-sm text-center text-[var(--text-secondary)] mb-12"
          >
            Where the elite come to play. What happens in VIP, stays in VIP.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'CHAMPAGNE LOUNGE', desc: 'Private bottles. Private moments. Dom Pérignon on ice.', price: '$500+', icon: '🥂' },
              { name: 'HIGH ROLLER SUITE', desc: 'No limits table. Minimum buy-in: $10,000. Maximum thrill: unlimited.', price: '$10,000+', icon: '🎰' },
              { name: 'SKYLINE TERRACE', desc: 'The best view of the Strip. Reserved for the chosen few.', price: '$800+', icon: '🌃' },
              { name: 'THE VAULT', desc: 'If you have to ask what happens here, you can\'t afford it.', price: 'POA', icon: '🔒' },
            ].map((room, i) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
              >
                <GlowCard accentColor="#FFD700" className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{room.icon}</span>
                    <div>
                      <h3 className="font-display text-xl text-[var(--text-primary)] mb-1">{room.name}</h3>
                      <p className="font-body text-sm text-[var(--text-secondary)] mb-2">{room.desc}</p>
                      <span className="font-mono text-xs text-neon-gold">{room.price}</span>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
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
          <text x="80" y="90" fill="#FFD700" fontSize="28" fontFamily="var(--font-display)" textAnchor="middle" opacity="0.8">VIP</text>
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

      <h3 className="font-display text-3xl neon-gold mb-2">VIP ROOM — LOCKED</h3>
      <p className="font-mono text-xs text-[var(--text-secondary)] mb-8">
        Enter the code to gain access: ♠ ♥ ♦
      </p>

      {/* Key input */}
      <div className="flex justify-center gap-3 mb-4">
        {['♠', '♥', '♦', '♣'].map((symbol) => (
          <motion.button
            key={symbol}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress(symbol)}
            className="w-14 h-14 rounded-lg font-bold text-2xl border transition-all duration-200"
            style={{
              background: '#0a0a14',
              borderColor: symbol === '♥' || symbol === '♦' ? '#E6003944' : '#ffffff22',
              color: symbol === '♥' || symbol === '♦' ? '#E60039' : '#ddd',
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const filteredVenues = selectedVibe
    ? venues.filter(v => v.tags.includes(selectedVibe))
    : venues

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
            <img src="/@fs/Users/hemish/.gemini/antigravity/brain/61816b40-6441-4ea1-a9db-5752d9dc6ced/seductive_neon_portrait_1775744546678.png" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" alt="Seductive Host" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0004] via-[#0A0004]/60 to-transparent" />
          </div>
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-6xl md:text-[96px] neon-crimson leading-none mb-4"
            >
              NEON NIGHTLIFE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-base text-[var(--text-secondary)]"
            >
              Flesh, fantasy, and endless vice.
            </motion.p>
          </div>
        </section>

        {/* ─── FLICKERING NEON SIGNS ────────────────────────── */}
        <section className="py-16 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
            <FlickeringNeonSign text="GIRLS GIRLS GIRLS" color="#E60039" />
            <div className="flex gap-8 md:gap-16 flex-wrap justify-center">
              <FlickeringNeonSign text="LIVE" color="#00F5FF" />
              <FlickeringNeonSign text="NUDE" color="#E60039" />
              <FlickeringNeonSign text="XXX" color="#BF00FF" />
            </div>
            <FlickeringNeonSign text="OPEN 24 HRS" color="#FFD700" />
          </div>
        </section>

        {/* ─── BURLESQUE STAGE ──────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-center neon-crimson mb-2">THE BURLESQUE STAGE</h2>
            <p className="font-mono text-xs text-center text-[var(--text-secondary)] mb-12">
              Flesh in motion. Succumb to your deepest desires.
            </p>

            {/* Stage with dancers */}
            <div className="relative bg-gradient-to-b from-[#0a0015] to-[#08080F] rounded-2xl p-8 border border-neon-crimson/10 overflow-hidden">
              {/* Spotlights */}
              <div className="absolute top-0 left-1/4 w-32 h-full opacity-10"
                style={{ background: 'linear-gradient(to bottom, #E60039, transparent)' }} />
              <div className="absolute top-0 left-1/2 w-32 h-full opacity-10 -translate-x-1/2"
                style={{ background: 'linear-gradient(to bottom, #BF00FF, transparent)' }} />
              <div className="absolute top-0 right-1/4 w-32 h-full opacity-10"
                style={{ background: 'linear-gradient(to bottom, #E60039, transparent)' }} />

              {/* Curtain edges */}
              <div className="absolute top-0 left-0 w-16 h-full"
                style={{ background: 'linear-gradient(to right, #1a0020, transparent)' }} />
              <div className="absolute top-0 right-0 w-16 h-full"
                style={{ background: 'linear-gradient(to left, #1a0020, transparent)' }} />

              {/* Massive Seductive Club Dancers Image */}
              <div className="w-full h-[500px] relative rounded-xl overflow-hidden border border-neon-crimson/30 mt-4 shadow-[0_0_30px_#E6003944]">
                <img src="/@fs/Users/hemish/.gemini/antigravity/brain/61816b40-6441-4ea1-a9db-5752d9dc6ced/neon_nightclub_dancers_1775744530671.png" className="w-full h-full object-cover" alt="Mature Cabaret Dancers" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-0 right-0 text-center px-4">
                  <h3 className="font-display text-4xl text-neon-crimson tracking-widest drop-shadow-[0_0_10px_#E60039]">SEDUCTION HAS A NEW NAME</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)] mt-2">Private dances. Strict confidentiality. Enter the red room.</p>
                </div>
              </div>

              {/* Stage floor */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-crimson/50 to-transparent" />
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
              {cabaretShows.map((show, i) => (
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
                        <span className="font-display text-2xl neon-gold">{show.price}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all"
                        >
                          Reserve
                        </motion.button>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── RISQUÉ CARD DEALER ───────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl neon-crimson mb-2">THE PRIVATE TABLE</h2>
            <p className="font-mono text-xs text-[var(--text-secondary)] mb-10">
              Your personal dealer. High stakes. Higher temptation.
            </p>
            <div className="bg-gradient-to-b from-[#0a0a14] to-[#08080F] rounded-2xl p-8 border border-neon-crimson/10">
              <CardDealerAnimation />
            </div>
          </div>
        </section>

        {/* ─── WHAT'S YOUR VIBE? VENUES ─────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl text-[var(--text-primary)] mb-8">WHAT'S YOUR VIBE?</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {vibeOptions.map((vibe) => (
                <motion.button
                  key={vibe}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                  className={`px-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                    selectedVibe === vibe
                      ? 'bg-neon-crimson/20 border-neon-crimson text-neon-crimson shadow-[0_0_20px_#E6003944]'
                      : 'bg-transparent border-white/20 text-[var(--text-secondary)] hover:border-white/40'
                  } border`}
                >
                  {vibe}
                </motion.button>
              ))}
            </div>

            {/* Venue cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVibe || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredVenues.map((venue) => (
                  <GlowCard key={venue.name} accentColor="#E60039" className="p-6 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-2xl text-[var(--text-primary)]">{venue.name}</h3>
                      <span className="text-sm">{venue.heat}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
                        {venue.genre}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">Cover: {venue.cover}</span>
                    </div>
                    {/* Vibe rating bar */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-mono text-[var(--text-muted)]">Vibe:</span>
                      <div className="flex gap-[2px]">
                        {Array.from({ length: 10 }, (_, j) => (
                          <div
                            key={j}
                            className={`w-3 h-2 rounded-sm ${j < venue.vibe ? 'bg-neon-crimson' : 'bg-white/10'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono text-neon-crimson">{venue.vibe}/10</span>
                    </div>
                    <button className="font-body font-semibold text-xs uppercase tracking-wider text-neon-crimson hover:text-neon-crimson/80 transition-colors">
                      Get on the list →
                    </button>
                  </GlowCard>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ─── VIP ROOM ─────────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-neon-gold/30 to-transparent mb-16" />
            <VIPRoom />
          </div>
        </section>

        {/* Bass visualizer — no longer covering footer */}
        <div className="fixed bottom-0 left-0 w-full pointer-events-none z-10">
          <canvas ref={canvasRef} className="w-full" style={{ height: 80 }} />
        </div>
      </motion.div>
    </>
  )
}
