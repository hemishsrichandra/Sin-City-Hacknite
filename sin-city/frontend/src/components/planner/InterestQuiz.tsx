import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlannerFormData } from '../../types'

const VICES = [
  { id: 'GAMBLING', label: 'GAMBLING', icon: '🎰' },
  { id: 'NIGHTLIFE', label: 'NIGHTLIFE', icon: '🌙' },
  { id: 'FINE DINING', label: 'FINE DINING', icon: '🍷' },
  { id: 'LIVE SHOWS', label: 'LIVE SHOWS', icon: '🎭' },
  { id: 'POOL PARTIES', label: 'POOL PARTIES', icon: '🌊' },
  { id: 'SHOPPING', label: 'SHOPPING', icon: '💎' },
  { id: 'UNDERGROUND', label: 'UNDERGROUND', icon: '⚡' },
  { id: 'HIGH ROLLER', label: 'HIGH ROLLER', icon: '👑' },
]

const VIBES = [
  { value: 'WILD' as const, label: 'WILD', icon: '🔥', desc: 'Maximum adrenaline' },
  { value: 'SOPHISTICATED' as const, label: 'CLASSY', icon: '🥂', desc: 'Luxury & status' },
  { value: 'LAID_BACK' as const, label: 'CHILL', icon: '😎', desc: 'Low profile' },
  { value: 'MYSTERY' as const, label: 'DANGER', icon: '💀', desc: 'Known unknowns' },
]

const PERSONAS = [
  { id: 'The Ghost', label: 'THE GHOST', desc: 'Move unseen through the shadows.', icon: '👤' },
  { id: 'High Roller', label: 'HIGH ROLLER', desc: 'The city is your playground.', icon: '💰' },
  { id: 'The Tourist', label: 'TOURIST', desc: 'See the lights, stay safe.', icon: '📸' },
  { id: 'The Hedonist', label: 'HEDONIST', desc: 'Savour every forbidden fruit.', icon: '🍇' },
]

const PACES = ['RELAXED', 'BALANCED', 'OVERDRIVE']

interface InterestQuizProps {
  onSubmit: (data: PlannerFormData) => void
  initialData?: PlannerFormData
}

export default function InterestQuiz({ onSubmit, initialData }: InterestQuizProps) {
  const [vices, setVices] = useState<string[]>(initialData?.vices || ['GAMBLING'])
  const [budget, setBudget] = useState(initialData?.budget_per_night || 500)
  const [days, setDays] = useState(initialData?.days || 3)
  const [vibe, setVibe] = useState<PlannerFormData['vibe']>(initialData?.vibe || 'WILD')
  const [partySize, setPartySize] = useState(initialData?.party_size || 2)
  const [persona, setPersona] = useState(initialData?.persona || 'The Tourist')
  const [pace, setPace] = useState(initialData?.pace || 'BALANCED')

  const toggleVice = (v: string) => {
    setVices(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const handleSubmit = () => {
    onSubmit({
      vices,
      budget_per_night: budget,
      days,
      vibe,
      party_size: partySize,
      persona,
      pace
    })
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight text-white mb-2">
            INTEL CONSOLE <span className="text-neon-cyan">V2.0</span>
          </h2>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--text-muted)] uppercase">
            ESTABLISHING SECURE CONNECTION... ENCRYPTING PREFERENCES
          </p>
        </div>
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5"
        >
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_#00F5FF]" />
          <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-widest">System Online</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Persona & Stakes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Persona Selection */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-display text-lg text-neon-cyan mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span> SELECT PERSONA
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`flex items-start gap-4 p-3 rounded-xl border transition-all duration-300 text-left ${
                    persona === p.id 
                      ? 'bg-neon-cyan/10 border-neon-cyan/50 shadow-[0_0_20px_#00F5FF11]' 
                      : 'bg-transparent border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl mt-1">{p.icon}</span>
                  <div>
                    <h4 className={`text-xs font-bold leading-none mb-1 ${persona === p.id ? 'text-neon-cyan' : 'text-white'}`}>
                      {p.label}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] leading-tight">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Sliders */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-display text-lg text-neon-gold mb-6 flex items-center gap-2">
              <span className="text-xl">⚙️</span> PARAMETERS
            </h3>
            
            <div className="space-y-8">
              {/* Days */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Duration</span>
                  <span className="font-display text-xl text-white">{days} DAYS</span>
                </div>
                <input
                  type="range" min="1" max="7" value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-gold"
                />
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Daily Budget</span>
                  <span className="font-display text-xl text-neon-gold">${budget}</span>
                </div>
                <input
                  type="range" min="100" max="2000" step="100" value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-gold"
                />
              </div>

              {/* Party Size */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Party Size</span>
                  <span className="font-display text-xl text-white">{partySize} PERS.</span>
                </div>
                <input
                  type="range" min="1" max="10" value={partySize}
                  onChange={(e) => setPartySize(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-pink"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Vices Map */}
        <div className="lg:col-span-5">
          <div className="h-full p-8 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/[0.02] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00F5FF 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <h3 className="font-display text-2xl text-neon-cyan mb-8 tracking-widest uppercase">Target Vices</h3>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {VICES.map(v => (
                <motion.button
                  key={v.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleVice(v.id)}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                    vices.includes(v.id) 
                      ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_30px_#00F5FF22]' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 grayscale hover:grayscale-0'
                  }`}
                >
                  <span className="text-3xl">{v.icon}</span>
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{v.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 w-full p-4 rounded-xl bg-black/40 border border-white/5">
               <div className="flex-1">
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-neon-cyan" 
                      animate={{ width: `${(vices.length / VICES.length) * 100}%` }}
                    />
                 </div>
               </div>
               <span className="font-mono text-[10px] text-neon-cyan">{vices.length} Selected</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vibe & Pace */}
        <div className="lg:col-span-3 space-y-6">
          {/* Vibe Grid */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-display text-lg text-neon-pink mb-4 flex items-center gap-2">
              <span className="text-xl">🎭</span> VIBE MATCH
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {VIBES.map(v => (
                <button
                  key={v.value}
                  onClick={() => setVibe(v.value)}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300 ${
                    vibe === v.value 
                      ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_20px_#FF006E11]' 
                      : 'bg-transparent border-white/5 text-[var(--text-muted)]'
                  }`}
                >
                  <span className="text-2xl">{v.icon}</span>
                  <span className="font-mono text-[9px] font-bold">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pace Selection */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-display text-lg text-neon-purple mb-4 flex items-center gap-2">
              <span className="text-xl">⚡</span> TRIP PACE
            </h3>
            <div className="space-y-2">
              {PACES.map(p => (
                <button
                  key={p}
                  onClick={() => setPace(p)}
                  className={`w-full py-3 px-4 rounded-xl border font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                    pace === p 
                      ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_20px_#BF00FF11]' 
                      : 'bg-transparent border-white/5 text-[var(--text-muted)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Main Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-6 rounded-2xl font-display text-xl tracking-[0.2em] uppercase transition-all duration-500 relative group overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF006E 0%, #E60039 100%)',
              color: 'white',
              boxShadow: '0 10px 40px rgba(230,0,57,0.4)',
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            GENERATE PLAN
          </motion.button>
        </div>
      </div>
    </div>
  )
}
