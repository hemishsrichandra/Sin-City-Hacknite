import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import FlickerLight from '../components/ui/FlickerLight'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const GRID_SIZE = 10
const CELL_SIZE = 60 // px

// District Landmarks
const LANDMARKS = [
  { x: 1, y: 1, name: "The Void" },
  { x: 8, y: 2, name: "Carbon Slums" },
  { x: 3, y: 7, name: "Neon Cathedral" },
  { x: 7, y: 8, name: "The Vault" }
]

interface Patrol {
  id: string
  x: number
  y: number
  targetX: number
  targetY: number
}

export default function GetawayGrid() {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 9 })
  const [destPos] = useState({ x: 9, y: 0 })
  const [heatLevel, setHeatLevel] = useState(1)
  const [narrative, setNarrative] = useState("CONNECTION SECURE. SCANNING GRID FOR POLICE CHATTER...")
  const [policeETA, setPoliceETA] = useState<number | null>(null)
  const [checkpoints, setCheckpoints] = useState<string[]>([])
  const [patrols, setPatrols] = useState<Patrol[]>([
    { id: 'p1', x: 5, y: 5, targetX: 5, targetY: 0 },
    { id: 'p2', x: 2, y: 2, targetX: 8, targetY: 2 }
  ])
  const [tacticalRoute, setTacticalRoute] = useState<{x: number, y: number}[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  // 1. NPC Patrol Movement logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPatrols(prev => prev.map(p => {
        let newX = p.x
        let newY = p.y
        
        // Move towards target
        if (p.x < p.targetX) newX++
        else if (p.x > p.targetX) newX--
        
        if (p.y < p.targetY) newY++
        else if (p.y > p.targetY) newY--

        // Randomly change target if reached
        let nextTargetX = p.targetX
        let nextTargetY = p.targetY
        if (newX === p.targetX && newY === p.targetY) {
            nextTargetX = Math.floor(Math.random() * GRID_SIZE)
            nextTargetY = Math.floor(Math.random() * GRID_SIZE)
        }

        // Proximity check for heat
        const dist = Math.abs(newX - playerPos.x) + Math.abs(newY - playerPos.y)
        if (dist <= 1) setHeatLevel(h => Math.min(5, h + 1))

        return { ...p, x: newX, y: newY, targetX: nextTargetX, targetY: nextTargetY }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [playerPos])

  // 2. Tactical Route Update (Backend AI)
  const updateIntel = async () => {
    try {
      const resp = await axios.post(`${API_URL}/api/escape`, {
        player_x: playerPos.x,
        player_y: playerPos.y,
        dest_x: destPos.x,
        dest_y: destPos.y,
        heat_level: heatLevel,
        police_positions: patrols.map(p => ({ x: p.x, y: p.y }))
      })

      const data = resp.data
      setNarrative(data.narrative)
      setPoliceETA(data.police_eta_seconds)
      setCheckpoints(data.checkpoints_ahead)
      setTacticalRoute(data.escape_route || [])
      setHeatLevel(data.heat_level)
    } catch (e) {
      console.error("Link Error:", e)
    }
  }

  // Auto-intel on start
  useEffect(() => {
    updateIntel()
  }, [])

  // 3. Evasive Maneuver
  const executeManeuver = () => {
    if (tacticalRoute.length < 2 || isExecuting) return

    setIsExecuting(true)
    const nextStep = tacticalRoute[1] 
    
    setTimeout(() => {
      setPlayerPos(nextStep)
      setIsExecuting(false)
      updateIntel()
    }, 600)
  }

  // 4. Grid Rendering Helpers
  const renderGrid = () => {
    const cells = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isLandmark = LANDMARKS.find(l => l.x === x && l.y === y)
        const isRoute = tacticalRoute.some(node => node.x === x && node.y === y)
        
        cells.push(
          <div 
            key={`${x}-${y}`}
            className="relative flex items-center justify-center border-[0.5px] border-white/5"
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          >
            {/* Cell Highlight for Route */}
            {isRoute && (
              <motion.div 
                layoutId="route-trail"
                className="absolute inset-0 bg-[#BF00FF33] shadow-[inset_0_0_15px_#BF00FF66]"
              />
            )}
            
            {/* Building Icon */}
            {isLandmark && (
              <div className="text-xl opacity-30 drop-shadow-[0_0_10px_cyan]">🏙️</div>
            )}
            
            {/* Coordinates in corner */}
            <span className="absolute bottom-0.5 right-1 text-[7px] text-white/10 font-mono">{x},{y}</span>
          </div>
        )
      }
    }
    return cells
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] mt-20 bg-[#050508] flex items-center justify-center overflow-hidden">
      <FlickerLight color="#00FF88" intensity="low" className="top-10 left-10" />
      
      {/* GRID PLAYFIELD */}
      <motion.div 
        animate={isExecuting ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div 
          className="grid grid-cols-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        >
          {renderGrid()}
        </div>

        {/* Dynamic Entities Layer (Absolute positioned) */}
        
        {/* DESTINATION (Glow) */}
        <motion.div 
          className="absolute w-[60px] h-[60px] flex items-center justify-center z-10"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ left: destPos.x * CELL_SIZE, top: destPos.y * CELL_SIZE }}
        >
           <div className="w-8 h-8 rounded-full bg-neon-green/30 border-2 border-neon-green shadow-[0_0_30px_#00FF88]" />
           <span className="absolute -top-8 font-mono text-[9px] text-neon-green font-bold tracking-tighter shadow-black">EXTRACTION_POINT</span>
        </motion.div>

        {/* PATROLS */}
        {patrols.map(p => (
          <motion.div 
            key={p.id}
            className="absolute w-[60px] h-[60px] flex items-center justify-center z-20"
            animate={{ x: p.x * CELL_SIZE, y: p.y * CELL_SIZE }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <div className="relative group">
              <div className="w-4 h-4 bg-[#FF006E] shadow-[0_0_15px_#FF006E]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              <div className="absolute -inset-2 rounded-full border border-[#FF006E44] animate-ping" />
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-mono text-[7px] text-[#FF006E] whitespace-nowrap bg-black/80 px-1">UNIT_{p.id}</span>
            </div>
          </motion.div>
        ))}

        {/* PLAYER (The Car) */}
        <motion.div 
          className="absolute w-[60px] h-[60px] flex items-center justify-center z-30"
          animate={{ x: playerPos.x * CELL_SIZE, y: playerPos.y * CELL_SIZE }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        >
          <div className="relative">
             <motion.div 
               animate={isExecuting ? { scale: [1, 1.3, 1] } : {}}
               className="w-7 h-4 bg-[#00F5FF] rounded-sm shadow-[0_0_25px_#00F5FF]" 
             />
             <div className="absolute top-0 right-0 w-6 h-6 bg-white/20 blur-md -scale-x-100 translate-x-4 translate-y-[-50%]" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }} />
             <div className="absolute -inset-4 border border-[#00F5FF33] rounded-full animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* OVERLAY UI: HUD */}
      <div className="absolute inset-0 pointer-events-none p-6 md:p-12 flex flex-col justify-between max-w-7xl mx-auto">
        
        {/* Top Titles - Repositioned to clear Navbar */}
        <div className="flex justify-between items-start mt-8">
           <div className="p-4 border-l-2 border-[#FF006E] bg-black/40 backdrop-blur-sm pointer-events-auto">
              <div className="flex gap-1 mb-1">
                 {[1,2,3,4,5].map(s => (
                   <span key={s} className={`text-xl ${s <= heatLevel ? 'text-[#FF006E] drop-shadow-[0_0_12px_#FF006E]' : 'text-white/5'}`}>★</span>
                 ))}
              </div>
              <p className="font-mono text-[9px] tracking-[0.4em] text-white/40 uppercase">Heat Signal</p>
           </div>

           <div className="text-right pointer-events-auto">
              <motion.h2 
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="font-display text-4xl lg:text-5xl text-neon-cyan leading-none mb-1 drop-shadow-[0_0_15px_#00F5FF]"
              >
                NOVA INFERNO
              </motion.h2>
              <p className="font-mono text-[10px] text-white/30 tracking-[0.5em] uppercase">Sector: Red-Line Alpha</p>
           </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* Tactical Tracker */}
          <div className="md:col-span-3 space-y-4">
             <div className="p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-xl pointer-events-auto">
                <p className="font-mono text-[9px] text-white/20 uppercase mb-2">Checkpoints Identified</p>
                <div className="flex flex-wrap gap-1.5">
                   {checkpoints.map(c => (
                     <span key={c} className="text-[10px] font-mono text-neon-cyan border border-neon-cyan/20 px-2 py-1 rounded-sm bg-neon-cyan/5">{c}</span>
                   ))}
                </div>
             </div>
          </div>

          {/* AI Narration Terminal */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:col-span-6 p-7 rounded-2xl border border-neon-green/30 bg-black/90 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] pointer-events-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-green to-transparent animate-pulse" />
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              <h3 className="font-mono text-[9px] text-neon-green tracking-[0.5em] uppercase">Signal Confirmed // AI_CONSIGLIERE</h3>
            </div>
            <p className="font-display text-xl md:text-2xl text-white leading-relaxed italic">
              <motion.span
                key={narrative}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="block"
              >
                "{narrative}"
              </motion.span>
            </p>
          </motion.div>

          {/* Action Control */}
          <div className="md:col-span-3 space-y-4">
             <div className="p-6 rounded-xl border border-white/5 bg-black/60 backdrop-blur-xl pointer-events-auto group">
                <p className="font-mono text-[9px] text-white/30 uppercase mb-1">Police ETA</p>
                <div className="flex items-baseline gap-2">
                   <motion.span 
                    animate={heatLevel >= 3 ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-4xl font-display text-[#FF006E] drop-shadow-[0_0_10px_#FF006E]"
                   >
                    {policeETA || '--'}
                   </motion.span>
                   <span className="text-[10px] font-mono text-white/20">SECONDS TO INTERCEPT</span>
                </div>
             </div>

             <button 
                disabled={isExecuting || tacticalRoute.length < 2}
                onClick={executeManeuver}
                className="w-full py-6 rounded-xl bg-neon-green/10 border-2 border-neon-green/40 hover:bg-neon-green/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto group overflow-hidden relative"
             >
                <motion.div 
                  className="absolute inset-0 bg-neon-green/10"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative font-display text-sm tracking-[0.3em] text-neon-green flex items-center justify-center gap-3">
                   {isExecuting ? 'SHADOW_MODE_ALPHA' : 'EXECUTE EVASIVE MANEUVER'}
                   <span className="text-xl group-hover:translate-x-1 transition-transform">➔</span>
                </span>
             </button>
          </div>

        </div>

      </div>

      {/* Peripheral HUD Accents */}
      <div className="absolute top-24 left-12 font-mono text-[10px] text-white/20 tracking-widest hidden lg:block">
        SYS_OS v4.2 // NOVA_INFERNO_GRID // [72.112.98.0]
      </div>

    </div>
  )
}
