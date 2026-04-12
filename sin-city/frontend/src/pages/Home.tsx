import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../components/ui/ParticleField'
import AnimatedButton from '../components/ui/AnimatedButton'
import DistrictMap from '../components/districts/DistrictMap'
import FlickerLight from '../components/ui/FlickerLight'

// Typewriter text for the gangster intro
const typewriterText = 'THE FAMILY IS WATCHING.'

// Terminal lines for the consigliere teaser
const terminalLines = [
  '> Connecting to the underground...',
  '> Scanning VIP guest lists ♠',
  '> Budget: $500/night',
  '> Danger tolerance: MAXIMUM',
  '> Mapping secret routes...',
  '> Day 1: Casino Floor → Nightlife → After Hours',
  '> Day 2: The Shows → VIP Room → Cloud 9',
  '> The Consigliere has spoken. Your playbook is ready.',
]

export default function Home() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [typewriterIndex, setTypewriterIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (typewriterIndex >= typewriterText.length) return
    const timer = setTimeout(() => {
      setTypewriterIndex(i => i + 1)
    }, 80)
    return () => clearTimeout(timer)
  }, [typewriterIndex])

  // Title letters for staggered flicker
  const sinCityLetters = 'SIN CITY'.split('')

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">

        {/* Film grain overlay */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Dark vignette overlay */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)',
          }}
        />

        {/* Noir city silhouette — darker, sharper, more menacing */}
        <motion.div 
          initial={{ y: 250, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full h-[45%] z-[2]"
        >
          <svg viewBox="0 0 1440 450" className="w-full h-full" preserveAspectRatio="none">
            {/* Rain streaks */}
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.line
                key={i}
                x1={60 + i * 56}
                y1={0}
                x2={55 + i * 56}
                y2={30}
                stroke="rgba(200,200,220,0.15)"
                strokeWidth="0.5"
                animate={{ y1: [0, 450], y2: [30, 480] }}
                transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}

            {/* Buildings — taller, sharper, noir */}
            <rect x="80" y="40" width="40" height="410" fill="#050510" />
            <rect x="85" y="70" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="100" y="110" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="90" y="200" width="3" height="3" fill="rgba(255,180,80,0.6)" />

            <rect x="160" y="100" width="70" height="350" fill="#060612" />
            <rect x="175" y="130" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="200" y="160" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="185" y="220" width="3" height="3" fill="rgba(255,180,80,0.5)" />

            <rect x="270" y="20" width="55" height="430" fill="#040410" />
            <rect x="280" y="50" width="3" height="3" fill="rgba(255,180,80,0.7)" />
            <rect x="300" y="100" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="285" y="170" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="305" y="240" width="3" height="3" fill="rgba(255,180,80,0.3)" />

            <rect x="360" y="80" width="80" height="370" fill="#070714" />
            <rect x="380" y="110" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="410" y="150" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="390" y="210" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="480" y="50" width="45" height="400" fill="#050510" />
            <rect x="490" y="80" width="3" height="3" fill="rgba(255,180,80,0.7)" />
            <rect x="505" y="150" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="560" y="10" width="65" height="440" fill="#030310" />
            <rect x="575" y="40" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="595" y="90" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="580" y="160" width="3" height="3" fill="rgba(255,180,80,0.7)" />

            <rect x="660" y="70" width="90" height="380" fill="#060614" />
            <rect x="680" y="95" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="720" y="140" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="700" y="200" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="730" y="260" width="3" height="3" fill="rgba(255,180,80,0.3)" />

            <rect x="780" y="30" width="50" height="420" fill="#040412" />
            <rect x="790" y="60" width="3" height="3" fill="rgba(255,180,80,0.7)" />
            <rect x="810" y="120" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="795" y="200" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="815" y="280" width="3" height="3" fill="rgba(255,180,80,0.3)" />

            <rect x="870" y="90" width="75" height="360" fill="#050514" />
            <rect x="890" y="120" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="920" y="170" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="900" y="240" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="980" y="120" width="60" height="330" fill="#060610" />
            <rect x="995" y="150" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="1020" y="200" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="1070" y="40" width="80" height="410" fill="#040414" />
            <rect x="1090" y="70" width="3" height="3" fill="rgba(255,180,80,0.7)" />
            <rect x="1120" y="130" width="3" height="3" fill="rgba(255,180,80,0.4)" />
            <rect x="1100" y="200" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="1130" y="270" width="3" height="3" fill="rgba(255,180,80,0.3)" />

            <rect x="1180" y="80" width="50" height="370" fill="#050510" />
            <rect x="1195" y="110" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="1210" y="170" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="1260" y="50" width="65" height="400" fill="#060612" />
            <rect x="1275" y="80" width="3" height="3" fill="rgba(255,180,80,0.6)" />
            <rect x="1300" y="140" width="3" height="3" fill="rgba(255,180,80,0.5)" />
            <rect x="1280" y="220" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            <rect x="1360" y="60" width="80" height="390" fill="#040410" />
            <rect x="1380" y="90" width="3" height="3" fill="rgba(255,180,80,0.7)" />
            <rect x="1410" y="150" width="3" height="3" fill="rgba(255,180,80,0.4)" />

            {/* Neon sign glow on building */}
            <rect x="685" y="85" width="30" height="8" fill="#E60039" opacity="0.3" rx="1" />
          </svg>
        </motion.div>

        {/* Smoke particles */}
        <ParticleField count={60} variant="smoke" />

        {/* Headline */}
        <div className="relative z-10 text-center px-4 mt-[-10vh]">
          {/* Typewriter intro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <p className="font-mono text-sm tracking-[0.5em] uppercase mb-8 ml-3 h-6" style={{
              color: '#E60039',
              textShadow: '0 0 10px #E60039, 0 0 30px #E6003966',
            }}>
              {typewriterText.slice(0, typewriterIndex)}
              {typewriterIndex < typewriterText.length && (
                <span className="inline-block w-[2px] h-4 bg-[#E60039] ml-1 animate-pulse align-middle" />
              )}
            </p>
          </motion.div>

          {/* SIN CITY neon sign — blood red with golden danger glow */}
          <div className="relative mb-6">
            <motion.h1
              initial={{ opacity: 0, scale: 1.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="font-display text-[80px] md:text-[160px] leading-none relative z-20"
            >
              {sinCityLetters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    color: '#E60039',
                    textShadow: '0 0 10px #E60039, 0 0 40px #E6003966, 0 0 80px #E6003933',
                    animation: `flicker ${2 + Math.random() * 1.5}s infinite`,
                    animationDelay: `${Math.random()}s`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
              {/* Golden danger glow offset */}
              <span
                className="absolute inset-0 font-display text-[80px] md:text-[160px] leading-none pointer-events-none"
                style={{
                  transform: 'translate(4px, 3px)',
                  color: '#FFD700',
                  opacity: 0.15,
                  filter: 'blur(3px)',
                }}
              >
                SIN CITY
              </span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <p className="font-mono text-sm md:text-lg tracking-[0.3em] mb-12" style={{
              color: 'rgba(255,255,255,0.5)',
              textShadow: '0 0 20px rgba(0,0,0,0.8)',
            }}>
              EVERY EMPIRE NEEDS A KING. TONIGHT, THAT'S YOU.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px #E6003966' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/districts')}
              className="px-8 py-4 rounded-xl font-display text-xl uppercase tracking-widest transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #E60039, #8B0000)',
                color: '#fff',
                border: '1px solid rgba(230,0,57,0.4)',
                textShadow: '0 0 10px rgba(230,0,57,0.5)',
              }}
            >
              Step Into The Shadows
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px #FFD70033' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/planner')}
              className="px-8 py-4 rounded-xl font-display text-xl uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'transparent',
                color: '#FFD700',
                border: '1px solid rgba(255,215,0,0.25)',
                textShadow: '0 0 10px rgba(255,215,0,0.3)',
              }}
            >
              <div className="absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              Summon The Concierge
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ opacity: scrollY > 100 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-[1px] h-8 bg-white/10 relative">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E60039]"
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">SCROLL</span>
        </motion.div>

        {/* Ambient blood-red glow lights */}
        <FlickerLight color="#E60039" intensity="high" className="-top-20 -left-20" size={400} />
        <FlickerLight color="#8B0000" intensity="medium" className="-bottom-20 -right-20" size={350} />
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <section className="border-y py-3 overflow-hidden" style={{
        background: 'linear-gradient(180deg, #0a0408, #0d0610)',
        borderColor: 'rgba(230,0,57,0.15)',
      }}>
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <span key={idx} className="font-display text-[22px] mx-4" style={{
              color: '#E60039',
              textShadow: '0 0 8px #E6003966',
            }}>
              ◆ HIGH STAKES  ·  AFTER DARK  ·  NO WITNESSES  ·  THE FAMILY  ·  BLACKJACK  ·  ROULETTE  ·  THE HIGH LIFE  ·  BURLESQUE  ·  
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
            Five districts. Infinite temptation.
          </motion.p>
        </div>
        <DistrictMap />
      </section>

      {/* ═══════════════ AI CONSIGLIERE TEASER ═══════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, var(--bg-void), #0a0610, var(--bg-void))',
      }}>
        <FlickerLight color="#FFD700" intensity="low" className="top-10 right-10" size={250} />
        <FlickerLight color="#E60039" intensity="low" className="bottom-10 left-10" size={250} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: '#E60039' }}>
              Powered by AI
            </span>
            <h2 className="font-display text-4xl md:text-[56px] leading-none mt-3 mb-6 text-[var(--text-primary)]">
              YOUR PERSONAL CONSIGLIERE
            </h2>
            <p className="font-body text-lg text-[var(--text-secondary)] mb-8 max-w-lg">
              Tell our AI your vices, your budget, your danger tolerance. It builds your perfect Sin City playbook — hour by hour, district by district. Like having a mob boss's right hand planning your trip.
            </p>
            <AnimatedButton variant="filled" color="#E60039" onClick={() => navigate('/planner')}>
              Summon Now →
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
      setTimeout(() => {
        setDisplayed([])
        setCurrentLine(0)
        setCurrentChar(0)
        setIsTyping(true)
      }, 4000)
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
      }, 35)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentLine, currentChar, isTyping, lines])

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(230,0,57,0.15)' }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#080410', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-[11px] text-[var(--text-muted)] ml-2">the-consigliere v2.0</span>
      </div>
      {/* Terminal body */}
      <div className="p-5 min-h-[260px] relative overflow-hidden" style={{ background: '#04030A' }}>
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(230,0,57,0.1) 2px, rgba(230,0,57,0.1) 4px)',
          }}
        />
        <div className="relative z-10">
          {displayed.map((line, i) => (
            <p key={i} className={`font-mono text-xs leading-6 ${
              line.includes('Consigliere') || line.includes('playbook')
                ? 'text-neon-gold font-bold'
                : 'text-[#E60039]'
            }`}>
              {line}
              {i === currentLine && isTyping && (
                <span className="inline-block w-2 h-3 bg-[#E60039] ml-1 animate-pulse" />
              )}
            </p>
          ))}
          {currentLine < lines.length && !displayed[currentLine] && isTyping && (
            <span className="inline-block w-2 h-3 bg-[#E60039] animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}
