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
    const nextStep = tacticalRoute[1] // The step after current pos
    
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
                className="absolute inset-0 bg-[#BF00FF22] shadow-[inset_0_0_10px_#BF00FF44]"
              />
            )}
            
            {/* Building Icon if not road (mocking road grid) */}
            {isLandmark && (
              <div className="text-xl opacity-20 filter grayscale drop-shadow-[0_0_5px_cyan]">🏙️</div>
            )}
            
            {/* Coordinates in corner */}
            <span className="absolute bottom-0.5 right-1 text-[6px] text-white/5 font-mono">{x},{y}</span>
          </div>
        )
      }
    }
    return cells
  }

  return (
    <div className="relative w-full h-[calc(100vh-100px)] bg-[#050508] flex items-center justify-center overflow-hidden">
      <FlickerLight color="#00FF88" intensity="low" className="top-10 left-10" />
      
      {/* GRID PLAYFIELD */}
      <div className="relative">
        <div 
          className="grid grid-cols-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        >
          {renderGrid()}
        </div>

        {/* Dynamic Entities Layer (Absolute positioned) */}
        
        {/* DESTINATION (Glow) */}
        <motion.div 
          className="absolute w-[60px] h-[60px] flex items-center justify-center z-10"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ left: destPos.x * CELL_SIZE, top: destPos.y * CELL_SIZE }}
        >
           <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green shadow-[0_0_20px_#00FF88]" />
           <span className="absolute -top-6 font-mono text-[8px] text-neon-green">EXTRACTION</span>
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
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-mono text-[7px] text-[#FF006E] whitespace-nowrap">UNIT_{p.id}</span>
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
             <div className="w-6 h-4 bg-[#00F5FF] rounded-sm shadow-[0_0_25px_#00F5FF]" />
             {/* Headlights */}
             <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 blur-sm -scale-x-100 translate-x-3 translate-y-[-50%]" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }} />
             <div className="absolute -inset-3 border border-[#00F5FF33] rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* OVERLAY UI: HUD */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none p-6 md:p-12 flex flex-col justify-end gap-6 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* Heat & Meta */}
          <div className="md:col-span-3 space-y-4">
             <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-xl pointer-events-auto"
             >
                <div className="flex gap-1 mb-2">
                   {[1,2,3,4,5].map(s => (
                     <span key={s} className={`text-xl ${s <= heatLevel ? 'text-[#FF006E] drop-shadow-[0_0_10px_#FF006E]' : 'text-white/5'}`}>★</span>
                   ))}
                </div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">HEAT SENSOR ACTIVE</p>
             </motion.div>

             <div className="p-5 rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm">
                <p className="font-mono text-[9px] text-white/20 uppercase mb-2">Checkpoints Ahead</p>
                <div className="flex flex-wrap gap-1.5">
                   {checkpoints.map(c => (
                     <span key={c} className="text-[9px] font-mono text-neon-cyan border border-neon-cyan/20 px-2 py-0.5 rounded-sm bg-neon-cyan/5">{c}</span>
                   ))}
                </div>
             </div>
          </div>

          {/* AI Narration Terminal */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:col-span-6 p-6 rounded-2xl border border-neon-green/20 bg-black/80 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green/30" />
            <h3 className="font-mono text-[9px] text-neon-green tracking-[0.4em] mb-4 uppercase">Encrypted Comm 7G-12</h3>
            <p className="font-display text-lg md:text-xl text-white leading-relaxed italic">
              "{narrative}"
            </p>
          </motion.div>

          {/* Action Control */}
          <div className="md:col-span-3 space-y-4">
             <div className="p-5 rounded-xl border border-white/5 bg-black/60 backdrop-blur-xl pointer-events-auto">
                <p className="font-mono text-[9px] text-white/30 uppercase mb-1">Police ETA</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-display text-[#FF006E]">{policeETA || '--'}</span>
                   <span className="text-[10px] font-mono text-white/20">SEC</span>
                </div>
             </div>

             <button 
                disabled={isExecuting || tacticalRoute.length < 2}
                onClick={executeManeuver}
                className="w-full py-5 rounded-xl bg-neon-green/10 border border-neon-green/40 hover:bg-neon-green/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto group overflow-hidden relative"
             >
                <motion.div 
                  className="absolute inset-0 bg-neon-green/5"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative font-display text-xs tracking-[0.2em] text-neon-green flex items-center justify-center gap-2">
                   {isExecuting ? 'EVADING...' : 'EXECUTE MANEUVER'}
                   <span className="text-xl">➔</span>
                </span>
             </button>
          </div>

        </div>

      </div>

      {/* Peripheral HUD Accents */}
      <div className="absolute top-12 left-12 font-mono text-[10px] text-white/20 tracking-widest hidden lg:block">
        SYS_OS v4.2 // NOVA_INFERNO_GRID // [72.112.98.0]
      </div>
      <div className="absolute top-12 right-12 text-right hidden lg:block">
        <h2 className="font-display text-2xl text-neon-cyan leading-none">NOVA INFERNO</h2>
        <p className="font-mono text-[9px] text-white/20 tracking-[0.4em] uppercase">Tactical District Overlay</p>
      </div>

    </div>
  )
}
