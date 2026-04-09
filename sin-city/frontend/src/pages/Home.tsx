import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../components/ui/ParticleField'
import AnimatedButton from '../components/ui/AnimatedButton'
import DistrictMap from '../components/districts/DistrictMap'
import FlickerLight from '../components/ui/FlickerLight'

// Typewriter lines for the AI teaser terminal
const terminalLines = [
  '> Analysing your preferences...',
  '> High risk tolerance detected ♠',
  '> Budget: $500/night',
  '> Building itinerary...',
  '> Day 1: Check in → Casino Floor (8pm-2am)',
  '> Day 2: Pool party → Nightclub crawl',
  '> Itinerary ready. 14 activities. 3 districts.',
]

export default function Home() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Title letters for staggered flicker
  const sinCityLetters = 'SIN CITY'.split('')

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Layer 1: Grid floor */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `perspective(500px) rotateX(60deg) translateY(${scrollY * 0.2}px)`,
            transformOrigin: 'center top',
            opacity: 0.6,
          }}
        />

        {/* Layer 2: City silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-[35%]">
          <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
            {/* Buildings */}
            <rect x="50" y="180" width="60" height="220" fill="#0A0A1A" />
            <rect x="55" y="195" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="75" y="210" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="65" y="240" width="4" height="4" fill="rgba(255,200,100,0.6)" />
            <rect x="85" y="260" width="4" height="4" fill="rgba(255,200,100,0.8)" />

            <rect x="130" y="120" width="80" height="280" fill="#0C0C22" />
            <rect x="140" y="140" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="165" y="160" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="150" y="200" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="180" y="180" width="4" height="4" fill="rgba(255,200,100,0.6)" />
            <rect x="145" y="250" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="175" y="270" width="4" height="4" fill="rgba(255,200,100,0.7)" />

            <rect x="240" y="80" width="50" height="320" fill="#0D0D28" />
            <rect x="250" y="100" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="265" y="130" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="255" y="190" width="4" height="4" fill="rgba(255,200,100,0.8)" />

            <rect x="320" y="150" width="90" height="250" fill="#0B0B20" />
            <rect x="330" y="170" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="360" y="190" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="380" y="210" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="340" y="260" width="4" height="4" fill="rgba(255,200,100,0.6)" />

            <rect x="440" y="60" width="70" height="340" fill="#0E0E2A" />
            <rect x="450" y="80" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="475" y="120" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="460" y="180" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="485" y="220" width="4" height="4" fill="rgba(255,200,100,0.6)" />

            <rect x="540" y="130" width="55" height="270" fill="#0A0A1E" />
            <rect x="550" y="150" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="570" y="200" width="4" height="4" fill="rgba(255,200,100,0.7)" />

            <rect x="620" y="90" width="100" height="310" fill="#0C0C24" />
            <rect x="635" y="110" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="665" y="140" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="645" y="200" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="690" y="180" width="4" height="4" fill="rgba(255,200,100,0.6)" />
            <rect x="660" y="250" width="4" height="4" fill="rgba(255,200,100,0.8)" />

            <rect x="750" y="40" width="60" height="360" fill="#0D0D2A" />
            <rect x="760" y="60" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="780" y="100" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="770" y="160" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="790" y="220" width="4" height="4" fill="rgba(255,200,100,0.6)" />
            <rect x="765" y="280" width="4" height="4" fill="rgba(255,200,100,0.8)" />

            <rect x="840" y="100" width="75" height="300" fill="#0B0B22" />
            <rect x="855" y="120" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="880" y="160" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="860" y="230" width="4" height="4" fill="rgba(255,200,100,0.8)" />

            <rect x="940" y="140" width="65" height="260" fill="#0E0E26" />
            <rect x="955" y="160" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="975" y="200" width="4" height="4" fill="rgba(255,200,100,0.7)" />

            <rect x="1030" y="70" width="85" height="330" fill="#0C0C20" />
            <rect x="1045" y="90" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="1075" y="130" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="1055" y="190" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="1085" y="240" width="4" height="4" fill="rgba(255,200,100,0.6)" />

            <rect x="1140" y="110" width="55" height="290" fill="#0A0A1C" />
            <rect x="1155" y="130" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="1170" y="180" width="4" height="4" fill="rgba(255,200,100,0.7)" />

            <rect x="1220" y="160" width="70" height="240" fill="#0D0D24" />
            <rect x="1235" y="180" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="1260" y="220" width="4" height="4" fill="rgba(255,200,100,0.7)" />

            <rect x="1310" y="90" width="80" height="310" fill="#0B0B20" />
            <rect x="1325" y="110" width="4" height="4" fill="rgba(255,200,100,0.8)" />
            <rect x="1355" y="150" width="4" height="4" fill="rgba(255,200,100,0.7)" />
            <rect x="1335" y="210" width="4" height="4" fill="rgba(255,200,100,0.8)" />
          </svg>
        </div>

        {/* Layer 3: Particles */}
        <ParticleField count={150} />

        {/* Layer 4: Headline */}
        <div className="relative z-10 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg text-[var(--text-secondary)] tracking-[0.4em] uppercase mb-4"
          >
            Welcome To
          </motion.p>

          {/* SIN CITY neon sign */}
          <div className="relative mb-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
              className="font-display text-[64px] md:text-[120px] leading-none relative"
            >
              {sinCityLetters.map((letter, i) => (
                <span
                  key={i}
                  className="neon-pink inline-block"
                  style={{
                    animation: `flicker ${3 + Math.random() * 2}s infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
              {/* Cyan overlay offset */}
              <span
                className="absolute inset-0 font-display text-[64px] md:text-[120px] leading-none neon-cyan pointer-events-none"
                style={{
                  transform: 'translate(3px, 3px)',
                  mixBlendMode: 'screen',
                  opacity: 0.5,
                }}
              >
                SIN CITY
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="font-mono text-[13px] text-[var(--text-secondary)] tracking-[0.2em]"
          >
            YOUR RULES. YOUR VICES. YOUR NIGHT.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <AnimatedButton variant="filled" color="#FF006E" onClick={() => navigate('/districts')}>
              Enter the City
            </AnimatedButton>
            <AnimatedButton variant="outlined" color="#00F5FF" onClick={() => navigate('/planner')}>
              Plan My Trip
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Layer 6: Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ opacity: scrollY > 100 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-[1px] h-8 bg-white/20 relative">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-cyan"
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">SCROLL</span>
        </motion.div>

        {/* Ambient lights */}
        <FlickerLight color="#FF006E" intensity="low" className="-top-20 -left-20" size={300} />
        <FlickerLight color="#BF00FF" intensity="low" className="-bottom-20 -right-20" size={300} />
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <section className="bg-bg-surface border-y border-neon-gold/20 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <span key={idx} className="font-display text-[22px] neon-gold mx-4">
              ★ BLACKJACK  ·  ROULETTE  ·  COCKTAILS  ·  CABARET  ·  POKER  ·  LIVE SHOWS  ·  NEON NIGHTS  ·  
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ DISTRICTS PREVIEW ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-7xl text-[var(--text-primary)] mb-4"
          >
            CHOOSE YOUR VICE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg text-[var(--text-secondary)]"
          >
            Four districts. Infinite possibilities.
          </motion.p>
        </div>
        <DistrictMap />
      </section>

      {/* ═══════════════ AI PLANNER TEASER ═══════════════ */}
      <section className="bg-bg-surface py-24 px-6 relative overflow-hidden">
        <FlickerLight color="#00F5FF" intensity="low" className="top-10 right-10" size={250} />
        <FlickerLight color="#FF006E" intensity="low" className="bottom-10 left-10" size={250} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[11px] text-neon-cyan tracking-[0.3em] uppercase">
              Powered by AI
            </span>
            <h2 className="font-display text-4xl md:text-[56px] leading-none mt-3 mb-6 text-[var(--text-primary)]">
              YOUR PERSONAL SIN CITY CONCIERGE
            </h2>
            <p className="font-body text-lg text-[var(--text-secondary)] mb-8 max-w-lg">
              Tell our AI agent your vices. It builds your perfect Las Vegas itinerary — hour by hour, district by district.
            </p>
            <AnimatedButton variant="filled" color="#FF006E" onClick={() => navigate('/planner')}>
              Start Planning →
            </AnimatedButton>
          </motion.div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TerminalWindow lines={terminalLines} />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// ─── Terminal Window Component ──────────────────────────────────
function TerminalWindow({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!isTyping) return
    if (currentLine >= lines.length) {
      setIsTyping(false)
      // Reset after delay
      setTimeout(() => {
        setDisplayed([])
        setCurrentLine(0)
        setCurrentChar(0)
        setIsTyping(true)
      }, 3000)
      return
    }

    const line = lines[currentLine]
    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => {
          const newLines = [...prev]
          newLines[currentLine] = line.slice(0, currentChar + 1)
          return newLines
        })
        setCurrentChar(c => c + 1)
      }, 40)
      return () => clearTimeout(timer)
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentLine, currentChar, isTyping, lines])

  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A14] border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-[11px] text-[var(--text-muted)] ml-2">sin-city-agent v1.0</span>
      </div>
      {/* Terminal body */}
      <div className="bg-[#06060E] p-5 min-h-[260px] relative overflow-hidden">
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)',
          }}
        />
        <div className="relative z-10">
          {displayed.map((line, i) => (
            <p key={i} className="font-mono text-xs text-neon-green leading-6">
              {line}
              {i === currentLine && isTyping && (
                <span className="inline-block w-2 h-3 bg-neon-green ml-1 animate-pulse" />
              )}
            </p>
          ))}
          {currentLine < lines.length && !displayed[currentLine] && isTyping && (
            <span className="inline-block w-2 h-3 bg-neon-green animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}
