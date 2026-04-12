import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlickerLight from '../components/ui/FlickerLight'
import GlowCard from '../components/ui/GlowCard'

/* ──────────────────── SUBSTANCES DATA ──────────────────── */
const substances = [
  {
    name: 'CLOUD 9',
    type: 'Euphoric Vapor Lounge',
    intensity: 9,
    price: '$75/session',
    desc: 'Float above the strip in a haze of premium hookah blends. Infused flavors, private pods, zero gravity vibes.',
    icon: '☁️',
    color: '#BF00FF',
  },
  {
    name: 'GREEN ROOM',
    type: 'Cannabis Experience',
    intensity: 7,
    price: '$50/entry',
    desc: 'Legal dispensary meets art gallery. Curated strains, edible tastings, and a trippy immersive light tunnel.',
    icon: '🌿',
    color: '#00FF88',
  },
  {
    name: 'PSYCHE DOME',
    type: 'Psychedelic Art Space',
    intensity: 10,
    price: '$100/night',
    desc: 'Projection-mapped walls that breathe. Fractal ceilings. A sensory journey you won\'t forget — or maybe you will.',
    icon: '🍄',
    color: '#FF6B00',
  },
  {
    name: 'THE APOTHECARY',
    type: 'Cocktail Laboratory',
    intensity: 6,
    price: '$40/cocktail',
    desc: 'Molecular mixology meets mad science. Smoking potions, color-changing elixirs, and absinthe rituals.',
    icon: '⚗️',
    color: '#00F5FF',
  },
  {
    name: 'NIRVANA SPA',
    type: 'Altered Wellness',
    intensity: 5,
    price: '$120/treatment',
    desc: 'Sensory deprivation tanks, CBD-infused everything, and guided meditation in a bioluminescent cavern.',
    icon: '🧘',
    color: '#BF00FF',
  },
  {
    name: 'ELECTRIC KOOL-AID',
    type: 'Rave Pharmacy',
    intensity: 10,
    price: 'PRICELESS',
    desc: 'UV body paint parties. Bass therapy. The speakers ARE the drugs here. FDA approved (not really).',
    icon: '⚡',
    color: '#FF006E',
  },
]

const tripPhases = [
  { phase: 'ONSET', time: '0:00', desc: 'Pupils dilating. Colors sharpening. The city hums different.', icon: '👁️' },
  { phase: 'PEAK', time: '0:45', desc: 'The neon signs are talking to you. The buildings are breathing. You are the city.', icon: '🌀' },
  { phase: 'PLATEAU', time: '2:00', desc: 'Everything makes sense and nothing does. The stars are close enough to touch.', icon: '✨' },
  { phase: 'AFTERGLOW', time: '4:00', desc: 'The world is soft. You understand why they call it Sin City. You smile.', icon: '🌅' },
]

/* ──────────────────── AGE GATE ──────────────────── */
function DrugAgeGate({ onVerified }: { onVerified: () => void }) {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'verified'>('idle')

  const handleVerify = () => {
    setStage('scanning')
    setTimeout(() => {
      setStage('verified')
      setTimeout(onVerified, 1000)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #020010 0%, #0a0030 40%, #050015 100%)' }}
    >
      {/* Psychedelic background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              background: `radial-gradient(circle, ${['#BF00FF11', '#00FF8811', '#FF6B0011', '#00F5FF11'][i % 4]} 0%, transparent 70%)`,
              filter: 'blur(50px)',
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.8, 1],
              rotate: [0, 90, 180, 360],
            }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative z-10 text-center px-8 max-w-lg"
      >
        <motion.div
          className="mx-auto mb-6 text-7xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧪
        </motion.div>

        <h2
          className="font-display text-5xl md:text-7xl mb-4"
          style={{
            color: '#BF00FF',
            textShadow: '0 0 20px #BF00FF, 0 0 60px #BF00FF66, 0 0 100px #BF00FF33',
            animation: 'flicker 4s infinite',
          }}
        >
          THE HIGH LIFE
        </h2>

        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#BF00FF] to-transparent mx-auto mb-6" />

        <p className="font-body text-xl text-[var(--text-primary)] mb-2 tracking-wide">
          <span className="text-[#BF00FF] font-bold">WARNING:</span> You are about to cross the threshold.
        </p>
        <p className="font-mono text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
          The High Life contains mature, explicit themes involving simulated substance use, hallucinogenic visual effects, and altered states of consciousness.<br />
          <strong className="text-white">Strictly 21+ only.</strong> Discretion is heavily advised.
        </p>

        {stage === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px #BF00FF55' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            className="px-10 py-4 rounded-lg font-display text-2xl tracking-wider border-2 border-[#BF00FF] text-[#BF00FF] bg-[#0A0015] hover:bg-[#BF00FF] hover:text-black transition-all shadow-[0_0_20px_#BF00FF33]"
          >
            I AM 21+ — LET ME IN
          </motion.button>
        )}

        {stage === 'scanning' && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="relative w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-[#BF00FF] border-t-transparent" />
              <div className="absolute inset-2 rounded-full border-2 border-[#00FF88] border-b-transparent" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-4 rounded-full border-2 border-[#FF6B00] border-l-transparent" />
            </motion.div>
            <motion.span
              className="font-mono text-xs text-[#BF00FF]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              SCANNING CONSCIOUSNESS...
            </motion.span>
          </div>
        )}

        {stage === 'verified' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <span className="font-display text-4xl neon-green">MIND EXPANDED ✧</span>
          </motion.div>
        )}

        <p className="font-mono text-[10px] text-[var(--text-muted)] mt-8 max-w-sm mx-auto">
          ⚠️ Disclaimer: This is a fictional entertainment experience. We do not promote or endorse illegal substance use.
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────── TRIP VISUALIZER ──────────────────── */
function TripVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 300

    let time = 0
    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 8, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      for (let i = 0; i < 5; i++) {
        const radius = 40 + i * 25 + Math.sin(time * 0.5 + i) * 20
        const hue = (time * 30 + i * 72) % 360

        ctx.beginPath()
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.4)`
        ctx.lineWidth = 2
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.6)`
        ctx.shadowBlur = 20

        for (let a = 0; a < Math.PI * 2; a += 0.02) {
          const wobble = Math.sin(a * 6 + time * 2) * 10 + Math.cos(a * 3 - time) * 8
          const x = cx + Math.cos(a) * (radius + wobble)
          const y = cy + Math.sin(a) * (radius + wobble)
          if (a === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Particles
      for (let i = 0; i < 15; i++) {
        const angle = time * 0.5 + (i * Math.PI * 2) / 15
        const dist = 80 + Math.sin(time + i) * 50
        const x = cx + Math.cos(angle) * dist
        const y = cy + Math.sin(angle) * dist
        const hue = (time * 50 + i * 40) % 360

        ctx.beginPath()
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`
        ctx.arc(x, y, 2 + Math.sin(time * 3 + i) * 1, 0, Math.PI * 2)
        ctx.fill()
      }

      time += 0.016
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl w-full max-w-[600px]"
        style={{
          border: '1px solid #BF00FF22',
          boxShadow: '0 0 40px #BF00FF11',
          height: 300,
        }}
      />
    </div>
  )
}

import { useUserStore } from '../store/userStore'

/* ──────────────────── SUBSTANCE MIXER ──────────────────── */
function SubstanceMixer() {
  const { coins, removeCoins } = useUserStore()
  const [ingredients, setIngredients] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const options = ['🌿 Herb', '🍄 Shroom', '⚡ Energy', '🧊 Ice', '🔥 Spice', '💜 Lean']

  const mix = () => {
    if (ingredients.length < 2) return
    if (coins < 150) {
      alert("You need 150 coins to mix. Earn more at the Casino.")
      return
    }
    
    // Attempt purchase
    if (!removeCoins(150)) return

    const results = [
      '🌈 RAINBOW ROAD — You see in 4 dimensions now',
      '🚀 ROCKET FUEL — Houston, we have liftoff',
      '🦋 BUTTERFLY EFFECT — Everything is connected',
      '🌀 VORTEX — Time is a flat circle',
      '💫 STARDUST — You ARE the universe',
      '🎭 MASQUERADE — Who are you, really?',
    ]
    setResult(results[Math.floor(Math.random() * results.length)])
    setTimeout(() => { setResult(null); setIngredients([]) }, 4000)
  }

  const toggleIngredient = (item: string) => {
    setIngredients(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : prev.length < 3 ? [...prev, item] : prev
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {options.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleIngredient(opt)}
            className={`px-4 py-2 rounded-full text-sm font-mono transition-all ${
              ingredients.includes(opt)
                ? 'bg-[#BF00FF33] border-[#BF00FF] text-[#BF00FF] shadow-[0_0_15px_#BF00FF33]'
                : 'bg-transparent border-white/15 text-[var(--text-muted)] hover:border-[#BF00FF44]'
            } border`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="py-8 px-6 rounded-xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #0a0030, #15004a)',
              border: '1px solid #BF00FF44',
              boxShadow: '0 0 40px #BF00FF22',
            }}
          >
            <span className="font-display text-2xl text-[#BF00FF] block mb-1">{result.split(' — ')[0]}</span>
            <span className="font-mono text-xs text-[var(--text-muted)]">{result.split(' — ')[1]}</span>
          </motion.div>
        ) : (
          <motion.div key="mixer" className="mb-6">
            <div className="flex justify-center items-center gap-2 py-6 px-4 rounded-xl bg-[#08080F] border border-white/5 min-h-[80px]">
              {ingredients.length === 0 ? (
                <span className="font-mono text-xs text-[var(--text-muted)]">Select 2-3 ingredients to mix...</span>
              ) : (
                ingredients.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    {item.split(' ')[0]}
                    {i < ingredients.length - 1 && <span className="text-[var(--text-muted)] mx-1">+</span>}
                  </motion.span>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={mix}
        disabled={ingredients.length < 2 || !!result}
        className="px-8 py-3 rounded-lg font-display text-xl tracking-wider border-2 border-[#BF00FF] text-[#BF00FF] bg-transparent hover:bg-[#BF00FF22] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        MIX IT UP — 🪙 150
      </motion.button>
    </div>
  )
}

/* ──────────────────── MAIN PAGE ──────────────────── */
export default function Cloud9District() {
  const [ageVerified, setAgeVerified] = useState(false)
  const [activePhase, setActivePhase] = useState(0)

  // Auto-cycle trip phases
  useEffect(() => {
    if (!ageVerified) return
    const timer = setInterval(() => {
      setActivePhase(p => (p + 1) % tripPhases.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [ageVerified])

  if (!ageVerified) {
    return <DrugAgeGate onVerified={() => setAgeVerified(true)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 bg-bg-void relative overflow-hidden"
    >
      {/* Ambient psychedelic lights */}
      <FlickerLight color="#BF00FF" intensity="high" className="top-20 left-10" size={400} />
      <FlickerLight color="#00FF88" intensity="medium" className="top-60 right-20" size={350} />
      <FlickerLight color="#FF6B00" intensity="medium" className="bottom-40 left-1/4" size={300} />
      <FlickerLight color="#00F5FF" intensity="low" className="top-[50%] right-1/4" size={250} />
      <FlickerLight color="#BF00FF" intensity="low" className="bottom-20 right-10" size={200} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-24 px-6 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
          >
            <span className="text-7xl md:text-8xl block mb-4">🍄</span>
            <h1
              className="font-display text-6xl md:text-[110px] leading-none mb-2"
              style={{
                background: 'linear-gradient(135deg, #BF00FF, #FF006E, #FF6B00, #00FF88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px #BF00FF66)',
              }}
            >
              THE HIGH LIFE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-48 h-[2px] mx-auto mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, #BF00FF, #00FF88, transparent)' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-base text-[#BF00FF99] tracking-[0.2em]"
          >
            ALTER YOUR REALITY. EXPAND YOUR MIND. LOSE YOURSELF.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════ THE TRIP TIMELINE ═══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-[11px] text-[#BF00FF99] tracking-[0.3em] uppercase">The Journey</span>
            <h2 className="font-display text-5xl text-[var(--text-primary)] mt-2">TRIP TIMELINE</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#BF00FF44] via-[#00FF8844] to-[#FF6B0044]" />

            {tripPhases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}
              >
                {/* Dot on timeline */}
                <motion.div
                  className="absolute left-1/2 top-4 w-4 h-4 rounded-full -translate-x-1/2 z-10"
                  style={{
                    background: activePhase === i ? '#BF00FF' : '#1A1A2E',
                    border: `2px solid ${activePhase === i ? '#BF00FF' : '#BF00FF44'}`,
                    boxShadow: activePhase === i ? '0 0 15px #BF00FF66' : 'none',
                  }}
                  animate={activePhase === i ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                <div className={`w-[45%] p-5 rounded-xl transition-all duration-500 ${activePhase === i ? 'bg-[#12121F] border-[#BF00FF44] shadow-[0_0_20px_#BF00FF11]' : 'bg-[#08080F] border-white/5'} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{phase.icon}</span>
                    <span className="font-display text-xl text-[#BF00FF]">{phase.phase}</span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] ml-auto">T+{phase.time}</span>
                  </div>
                  <p className="font-body text-sm text-[var(--text-secondary)]">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DIVIDER ═══════════════ */}
      <div className="max-w-md mx-auto h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #BF00FF33, #00FF8833, transparent)' }} />

      {/* ═══════════════ TRIP VISUALIZER ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-[11px] text-[#00FF8899] tracking-[0.3em] uppercase">Visual Experience</span>
            <h2 className="font-display text-5xl text-[var(--text-primary)] mt-2">CONSCIOUSNESS VISUALIZER</h2>
            <p className="font-body text-sm text-[var(--text-secondary)] mt-2">Stare into the void. The void stares back.</p>
          </motion.div>
          <TripVisualizer />
        </div>
      </section>

      {/* ═══════════════ DIVIDER ═══════════════ */}
      <div className="max-w-md mx-auto h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #BF00FF33, #00FF8833, transparent)' }} />

      {/* ═══════════════ SUBSTANCE MIXER ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-[11px] text-[#FF6B0099] tracking-[0.3em] uppercase">Experiment</span>
            <h2 className="font-display text-5xl text-[var(--text-primary)] mt-2">THE MIXER</h2>
            <p className="font-body text-sm text-[var(--text-secondary)] mt-2">Combine ingredients. See what happens. No refunds.</p>
          </motion.div>
          <SubstanceMixer />
        </div>
      </section>

      {/* ═══════════════ DIVIDER ═══════════════ */}
      <div className="max-w-md mx-auto h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #BF00FF33, #00FF8833, transparent)' }} />

      {/* ═══════════════ EXPERIENCE VENUES ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-[11px] text-[#BF00FF99] tracking-[0.3em] uppercase">Choose Your Poison</span>
            <h2 className="font-display text-5xl text-[var(--text-primary)] mt-2 mb-4">THE EXPERIENCES</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {substances.map((sub, i) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard accentColor={sub.color} className="p-6 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-3xl mr-2">{sub.icon}</span>
                      <h3 className="font-display text-2xl mt-1" style={{ color: sub.color }}>{sub.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] whitespace-nowrap">{sub.price}</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded inline-block mb-3"
                    style={{ background: `${sub.color}15`, color: sub.color, border: `1px solid ${sub.color}33` }}
                  >
                    {sub.type}
                  </span>
                  <p className="font-body text-sm text-[var(--text-secondary)] mb-4">{sub.desc}</p>
                  {/* Intensity bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-muted)]">Intensity:</span>
                    <div className="flex gap-[2px]">
                      {Array.from({ length: 10 }, (_, j) => (
                        <motion.div
                          key={j}
                          className="w-3 h-2 rounded-sm"
                          style={{
                            background: j < sub.intensity ? sub.color : 'rgba(255,255,255,0.1)',
                            boxShadow: j < sub.intensity ? `0 0 4px ${sub.color}66` : 'none',
                          }}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + j * 0.05 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono" style={{ color: sub.color }}>{sub.intensity}/10</span>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DISCLAIMER ═══════════════ */}
      <section className="py-12 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center py-8 px-6 rounded-xl border border-neon-crimson/30 bg-[#0A000A]"
        >
          <span className="text-3xl mb-3 block drop-shadow-[0_0_10px_#E60039]">💊</span>
          <h4 className="font-display text-2xl text-neon-crimson mb-2 tracking-widest">STRICTLY ENTERTAINMENT ONLY</h4>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed text-left">
            This digital environment is a curated, fictional sandbox created solely for the Sin City hackathon event. 
            All depicted elements of substance use and altered psychological states are satirical mechanisms of the "Sin City" universe experience. <br/><br/>
            <strong>We absolutely do not condone, promote, or participate in the sale or consumption of illicit narcotics.</strong> <br/>
            If you or someone you know is struggling with substance dependency, please reach out safely.<br/>
            <br/>
            <span className="text-[#BF00FF] font-bold">SAMHSA Helpline: 1-800-662-4357</span>
          </p>
        </motion.div>
      </section>

      <div className="h-8" />
    </motion.div>
  )
}
