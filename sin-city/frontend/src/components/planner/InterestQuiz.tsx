import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlannerFormData } from '../../types'

const VICES = ['GAMBLING', 'NIGHTLIFE', 'FINE DINING', 'LIVE SHOWS', 'POOL PARTIES', 'SHOPPING']
const VIBES = [
  { value: 'WILD' as const, label: 'WILD & RECKLESS', icon: '🔥' },
  { value: 'SOPHISTICATED' as const, label: 'SOPHISTICATED', icon: '🥂' },
  { value: 'LAID_BACK' as const, label: 'LAID BACK', icon: '😎' },
  { value: 'MYSTERY' as const, label: 'MYSTERY & DANGER', icon: '🎭' },
]
const BUDGETS = [100, 250, 500, 1000]

interface InterestQuizProps {
  onSubmit: (data: PlannerFormData) => void
  initialData?: PlannerFormData
}

export default function InterestQuiz({ onSubmit, initialData }: InterestQuizProps) {
  const [step, setStep] = useState(0)
  const [vices, setVices] = useState<string[]>(initialData?.vices || [])
  const [budget, setBudget] = useState(initialData?.budget_per_night || 500)
  const [days, setDays] = useState(initialData?.days || 3)
  const [vibe, setVibe] = useState<PlannerFormData['vibe']>(initialData?.vibe || 'WILD')
  const [partySize, setPartySize] = useState(initialData?.party_size || 2)

  const toggleVice = (v: string) => {
    setVices(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const handleSubmit = () => {
    onSubmit({ vices, budget_per_night: budget, days, vibe, party_size: partySize })
  }

  const canProceed = () => {
    if (step === 0) return vices.length > 0
    return true
  }

  const questions = [
    // Q1: Vices
    <div key="vices" className="text-center">
      <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-2">What are your vices?</h3>
      <p className="font-mono text-xs text-[var(--text-muted)] mb-8">Select all that tempt you</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
        {VICES.map(v => (
          <motion.button
            key={v}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleVice(v)}
            className={`px-5 py-2.5 rounded-full font-body font-semibold text-xs uppercase tracking-wider transition-all duration-300 border ${
              vices.includes(v)
                ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_#00F5FF33]'
                : 'bg-transparent border-white/15 text-[var(--text-secondary)] hover:border-white/30'
            }`}
          >
            {vices.includes(v) && '✓ '}{v}
          </motion.button>
        ))}
      </div>
    </div>,

    // Q2: Budget
    <div key="budget" className="text-center">
      <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-2">Your budget per night?</h3>
      <p className="font-mono text-xs text-[var(--text-muted)] mb-6">Slide to set your limit</p>
      <div className="font-display text-5xl neon-gold mb-8">
        ${budget}{budget >= 1000 ? '+' : ''}
      </div>
      <div className="max-w-md mx-auto px-4">
        <input
          type="range"
          min={0}
          max={3}
          value={BUDGETS.indexOf(budget)}
          onChange={(e) => setBudget(BUDGETS[parseInt(e.target.value)])}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FF006E, #FFD700 ${((BUDGETS.indexOf(budget)) / 3) * 100}%, #1a1a2e ${((BUDGETS.indexOf(budget)) / 3) * 100}%)`,
          }}
        />
        <div className="flex justify-between mt-2">
          {BUDGETS.map(b => (
            <span key={b} className="font-mono text-[10px] text-[var(--text-muted)]">${b}{b >= 1000 ? '+' : ''}</span>
          ))}
        </div>
      </div>
    </div>,

    // Q3: Days
    <div key="days" className="text-center">
      <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-2">How many days?</h3>
      <p className="font-mono text-xs text-[var(--text-muted)] mb-8">How long can you last?</p>
      <div className="flex items-center justify-center gap-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDays(Math.max(1, days - 1))}
          className="w-14 h-14 rounded-full border border-white/20 text-2xl text-[var(--text-secondary)] hover:border-neon-cyan hover:text-neon-cyan transition-colors"
        >
          −
        </motion.button>
        <motion.span
          key={days}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          className="font-display text-7xl text-[var(--text-primary)] w-20 text-center"
        >
          {days}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDays(Math.min(7, days + 1))}
          className="w-14 h-14 rounded-full border border-white/20 text-2xl text-[var(--text-secondary)] hover:border-neon-cyan hover:text-neon-cyan transition-colors"
        >
          +
        </motion.button>
      </div>
      <p className="font-mono text-xs text-[var(--text-muted)] mt-4">{days === 1 ? '1 day' : `${days} days`}</p>
    </div>,

    // Q4: Vibe
    <div key="vibe" className="text-center">
      <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-2">Your vibe?</h3>
      <p className="font-mono text-xs text-[var(--text-muted)] mb-8">What kind of trip are you after?</p>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {VIBES.map(v => (
          <motion.button
            key={v.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVibe(v.value)}
            className={`p-5 rounded-xl border transition-all duration-300 ${
              vibe === v.value
                ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_#00F5FF22]'
                : 'border-white/10 bg-bg-card hover:border-white/20'
            }`}
          >
            <span className="text-3xl block mb-2">{v.icon}</span>
            <span className={`font-body font-semibold text-xs uppercase tracking-wider ${
              vibe === v.value ? 'text-neon-cyan' : 'text-[var(--text-secondary)]'
            }`}>
              {v.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>,

    // Q5: Party size
    <div key="party" className="text-center">
      <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-2">Party size?</h3>
      <p className="font-mono text-xs text-[var(--text-muted)] mb-8">How many sinners?</p>
      <div className="flex items-center justify-center gap-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPartySize(Math.max(1, partySize - 1))}
          className="w-14 h-14 rounded-full border border-white/20 text-2xl text-[var(--text-secondary)] hover:border-neon-cyan hover:text-neon-cyan transition-colors"
        >
          −
        </motion.button>
        <motion.span
          key={partySize}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          className="font-display text-7xl text-[var(--text-primary)] w-20 text-center"
        >
          {partySize}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPartySize(Math.min(20, partySize + 1))}
          className="w-14 h-14 rounded-full border border-white/20 text-2xl text-[var(--text-secondary)] hover:border-neon-cyan hover:text-neon-cyan transition-colors"
        >
          +
        </motion.button>
      </div>
      <p className="font-mono text-xs text-[var(--text-muted)] mt-4">{partySize === 1 ? '1 person' : `${partySize} people`}</p>
    </div>,
  ]

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-[64px] leading-none text-[var(--text-primary)] mb-3">
          CONFIGURE YOUR SIN CITY EXPERIENCE
        </h2>
        <p className="font-mono text-xs text-[var(--text-muted)]">Answer 5 questions. Get a personalised itinerary.</p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-12">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? 'bg-neon-cyan w-6' : i < step ? 'bg-neon-cyan/60' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px] flex items-center justify-center"
        >
          {questions[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          className={`font-body font-semibold text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ${step === 0 ? 'invisible' : ''}`}
        >
          ← Back
        </button>

        {step < 4 ? (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 245, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="px-8 py-3 rounded-lg font-display text-sm font-bold uppercase tracking-widest bg-neon-cyan text-[#0a0a14] shadow-[0_0_15px_rgba(0,245,255,0.3)] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 0, 110, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-10 py-4 rounded-lg font-display text-xl font-bold tracking-widest bg-neon-pink text-white shadow-[0_0_20px_rgba(255,0,110,0.4)] transition-all"
          >
            GENERATE MY ITINERARY
          </motion.button>
        )}
      </div>
    </div>
  )
}
