import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ─── City Grid Constants ───────────────────────────────────────────────────────
const COLS = 14
const ROWS = 10
const CELL = 62 // px per cell

// Tile types
const T = { ROAD: 0, BLOCK: 1, CHECKPOINT: 2, HOTZONE: 3, SAFE: 4 } as const
type TileType = typeof T[keyof typeof T]

// Nova Inferno — hand-crafted city layout (0=road, 1=block, 2=checkpoint, 3=hotzone, 4=safe)
const CITY_MAP: TileType[][] = [
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 0, 1, 3, 0, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [1, 0, 1, 1, 0, 2, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
]

const START = { x: 0, y: 2 }   // bottom-left corner road
const DEST  = { x: 13, y: 4 }  // safe house (right side)

// District landmark labels
const LANDMARKS = [
  { x: 6, y: 2, label: 'ZONE ALPHA' },
  { x: 8, y: 3, label: 'RED SECTOR' },
  { x: 13, y: 4, label: 'SAFE HOUSE' },
  { x: 5, y: 7, label: 'ZONE BETA' },
  { x: 11, y: 6, label: 'HOT ZONE' },
]

// Tile visual styles
const TILE_STYLE: Record<TileType, string> = {
  [T.ROAD]:       'bg-[#0d0d1a]',
  [T.BLOCK]:      'bg-[#0a0a15] border-[0.5px] border-white/[0.04]',
  [T.CHECKPOINT]: 'bg-[#1a0010]',
  [T.HOTZONE]:    'bg-[#1a0005]',
  [T.SAFE]:       'bg-[#001a0d]',
}

// ─── A* Pathfinder ─────────────────────────────────────────────────────────────
interface Node { x: number; y: number; f: number; g: number; parent?: Node }

function heuristic(a: {x:number;y:number}, b: {x:number;y:number}) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function astar(
  start: {x:number;y:number},
  goal: {x:number;y:number},
  blocked: {x:number;y:number}[] = []
): {x:number;y:number}[] {
  const isBlocked = (x:number, y:number) =>
    CITY_MAP[y]?.[x] === T.BLOCK ||
    blocked.some(b => b.x === x && b.y === y)

  const open: Node[] = []
  const closed = new Set<string>()
  const key = (n: {x:number;y:number}) => `${n.x},${n.y}`

  const startNode: Node = { x: start.x, y: start.y, f: 0, g: 0 }
  open.push(startNode)

  while (open.length > 0) {
    // Get node with lowest f
    let idx = 0
    for (let i = 1; i < open.length; i++) if (open[i].f < open[idx].f) idx = i
    const current = open.splice(idx, 1)[0]

    if (current.x === goal.x && current.y === goal.y) {
      // Reconstruct path
      const path: {x:number;y:number}[] = []
      let n: Node | undefined = current
      while (n) { path.unshift({ x: n.x, y: n.y }); n = n.parent }
      return path
    }

    closed.add(key(current))

    const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]
    for (const d of dirs) {
      const nx = current.x + d.x
      const ny = current.y + d.y
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue
      if (isBlocked(nx, ny)) continue
      if (closed.has(`${nx},${ny}`)) continue

      const g = current.g + 1
      const h = heuristic({x:nx,y:ny}, goal)
      const existing = open.find(n => n.x === nx && n.y === ny)
      if (existing) {
        if (g < existing.g) { existing.g = g; existing.f = g + h; existing.parent = current }
      } else {
        open.push({ x: nx, y: ny, f: g + h, g, parent: current })
      }
    }
  }
  return [] // no path
}

// ─── Patrol NPC ────────────────────────────────────────────────────────────────
interface Patrol { id: string; x: number; y: number; path: {x:number;y:number}[]; pathIdx: number }

function makeRandomPatrolPath(): {x:number;y:number}[] {
  const roads = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (CITY_MAP[r][c] === T.ROAD) roads.push({x:c, y:r})
  const shuffle = [...roads].sort(() => Math.random() - 0.5)
  const waypoints = shuffle.slice(0, 4)
  const fullPath: {x:number;y:number}[] = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const seg = astar(waypoints[i], waypoints[i+1])
    if (seg.length) fullPath.push(...seg.slice(0, -1))
  }
  fullPath.push(waypoints[waypoints.length - 1])
  return fullPath.length > 1 ? fullPath : [{ x: 2, y: 2 }]
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function GetawayGrid() {
  const [playerPos, setPlayerPos] = useState(START)
  const [route, setRoute] = useState<{x:number;y:number}[]>([])
  const [patrols, setPatrols] = useState<Patrol[]>([])
  const [heatLevel, setHeatLevel] = useState(1)
  const [narrative, setNarrative] = useState('NOVA INFERNO GRID ACTIVATED. POLICE SCANNER ONLINE. PLOTTING EXTRACTION ROUTE...')
  const [policeETA, setPoliceETA] = useState<number | null>(null)
  const [checkpoints, setCheckpoints] = useState<string[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const playerRef = useRef(playerPos)
  playerRef.current = playerPos

  // Init patrols on mount
  useEffect(() => {
    const initial: Patrol[] = [
      { id: 'K9-1', x: 6, y: 0, path: makeRandomPatrolPath(), pathIdx: 0 },
      { id: 'K9-2', x: 10, y: 5, path: makeRandomPatrolPath(), pathIdx: 0 },
      { id: 'K9-3', x: 3, y: 8, path: makeRandomPatrolPath(), pathIdx: 0 },
    ]
    setPatrols(initial)
  }, [])

  // Recalculate route whenever position changes
  useEffect(() => {
    const blockedByPatrols = patrols.map(p => ({ x: p.x, y: p.y }))
    const newRoute = astar(playerPos, DEST, blockedByPatrols)
    setRoute(newRoute)
  }, [playerPos, patrols])

  // Patrol movement loop
  useEffect(() => {
    if (patrols.length === 0) return
    const interval = setInterval(() => {
      setPatrols(prev => prev.map(p => {
        const nextIdx = (p.pathIdx + 1) % p.path.length
        const next = p.path[nextIdx] ?? p
        return { ...p, x: next.x, y: next.y, pathIdx: nextIdx }
      }))
    }, 1400)
    return () => clearInterval(interval)
  }, [patrols.length])

  // Heat & capture detection
  useEffect(() => {
    if (gameLost || gameWon) return
    const caught = patrols.some(p => p.x === playerPos.x && p.y === playerPos.y)
    if (caught) { setGameLost(true); return }

    const minDist = patrols.reduce((min, p) => {
      const d = Math.abs(p.x - playerPos.x) + Math.abs(p.y - playerPos.y)
      return Math.min(min, d)
    }, 999)

    if (minDist <= 1) setHeatLevel(5)
    else if (minDist <= 2) setHeatLevel(h => Math.min(4, Math.max(3, h)))
    else if (minDist <= 3) setHeatLevel(h => Math.min(3, Math.max(2, h)))
    else setHeatLevel(h => Math.max(1, h - 0 ))
  }, [patrols, playerPos, gameLost, gameWon])

  // Win detection
  useEffect(() => {
    if (playerPos.x === DEST.x && playerPos.y === DEST.y) {
      setGameWon(true)
    }
  }, [playerPos])

  // Click-to-move: move one step along A* route toward clicked cell
  const handleCellClick = useCallback((cx: number, cy: number) => {
    if (isMoving || gameWon || gameLost) return
    if (CITY_MAP[cy]?.[cx] === T.BLOCK) return

    const target = { x: cx, y: cy }
    const newRoute = astar(playerRef.current, target, patrols.map(p => ({ x: p.x, y: p.y })))

    if (newRoute.length < 2) return

    // Animate step by step with delay
    setIsMoving(true)
    setRoute(newRoute)
    let step = 1

    const moveNext = () => {
      if (step >= newRoute.length) {
        setIsMoving(false)
        fetchIntel(newRoute[newRoute.length - 1])
        return
      }
      const next = newRoute[step]
      playerRef.current = next
      setPlayerPos({ ...next })
      step++
      setTimeout(moveNext, 180)
    }
    setTimeout(moveNext, 120)
  }, [isMoving, gameWon, gameLost, patrols])

  // Fetch AI intel
  const fetchIntel = useCallback(async (pos?: {x:number;y:number}) => {
    const p = pos ?? playerRef.current
    setAiLoading(true)
    try {
      const resp = await axios.post(`${API_URL}/api/escape`, {
        player_x: p.x,
        player_y: p.y,
        dest_x: DEST.x,
        dest_y: DEST.y,
        heat_level: heatLevel,
        police_positions: patrols.map(pt => ({ x: pt.x, y: pt.y }))
      })
      const d = resp.data
      setNarrative(d.narrative || narrative)
      setPoliceETA(d.police_eta_seconds ?? null)
      setCheckpoints(d.checkpoints_ahead ?? [])
    } catch {
      setNarrative('COMMS DISRUPTED. KEEP MOVING.')
    } finally {
      setAiLoading(false)
    }
  }, [heatLevel, patrols, narrative])

  const resetGame = () => {
    setPlayerPos(START)
    setHeatLevel(1)
    setGameWon(false)
    setGameLost(false)
    setNarrative('GRID REBOOTED. EXTRACTION ROUTE RECALCULATED.')
    setPatrols([
      { id: 'K9-1', x: 6, y: 0, path: makeRandomPatrolPath(), pathIdx: 0 },
      { id: 'K9-2', x: 10, y: 5, path: makeRandomPatrolPath(), pathIdx: 0 },
      { id: 'K9-3', x: 3, y: 8, path: makeRandomPatrolPath(), pathIdx: 0 },
    ])
  }

  const isOnRoute = (x: number, y: number) => route.some(n => n.x === x && n.y === y)
  const routeIdx = (x: number, y: number) => route.findIndex(n => n.x === x && n.y === y)

  return (
    <div className="min-h-screen bg-[#030308] flex flex-col pt-20">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-xl flex-shrink-0">
        <div>
          <h1 className="font-display text-2xl text-[#00F5FF] tracking-widest drop-shadow-[0_0_12px_#00F5FF]">
            THE GETAWAY GRID
          </h1>
          <p className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase">
            Nova Inferno // Tactical Evasion Engine v3
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Heat meter */}
          <div className="text-right">
            <p className="font-mono text-[8px] text-white/30 tracking-widest mb-1 uppercase">Heat Signal</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <motion.span
                  key={s}
                  animate={s <= heatLevel && heatLevel >= 4 ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className={`text-lg leading-none ${s <= heatLevel ? 'text-[#FF006E] drop-shadow-[0_0_10px_#FF006E]' : 'text-white/10'}`}
                >★</motion.span>
              ))}
            </div>
          </div>

          {/* Police ETA */}
          <div className="text-right border-l border-white/10 pl-6">
            <p className="font-mono text-[8px] text-white/30 tracking-widest mb-1 uppercase">Police ETA</p>
            <motion.span
              animate={heatLevel >= 3 ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="font-display text-2xl text-[#FF006E] drop-shadow-[0_0_8px_#FF006E]"
            >
              {policeETA !== null ? `${policeETA}s` : '—'}
            </motion.span>
          </div>

          <button onClick={() => fetchIntel()} disabled={aiLoading}
            className="px-4 py-2 rounded-lg text-xs font-mono tracking-widest border border-neon-green/30 text-neon-green bg-neon-green/5 hover:bg-neon-green/15 transition-all disabled:opacity-40"
          >
            {aiLoading ? 'SCANNING...' : 'GET INTEL'}
          </button>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── City Map ──────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-auto">

          {/* Background ambient glow */}
          <div className="absolute inset-0 bg-gradient-radial from-[#0a0020]/60 via-transparent to-transparent pointer-events-none" />

          <div className="relative" style={{ width: COLS * CELL, height: ROWS * CELL }}>
            {/* SVG layer — roads, route trail, landmark labels */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={COLS * CELL}
              height={ROWS * CELL}
            >
              {/* Road grid lines */}
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) =>
                  CITY_MAP[r][c] === T.ROAD && (
                    <rect key={`road-${r}-${c}`}
                      x={c * CELL} y={r * CELL}
                      width={CELL} height={CELL}
                      fill="none" stroke="#1c1c2e" strokeWidth="0.5"
                    />
                  )
                )
              )}

              {/* Route trail dashed line */}
              {route.length > 1 && (
                <motion.polyline
                  key={route.map(n=>`${n.x},${n.y}`).join('-')}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  points={route.map(n => `${n.x * CELL + CELL/2},${n.y * CELL + CELL/2}`).join(' ')}
                  fill="none"
                  stroke="#BF00FF"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}

              {/* Landmark text labels */}
              {LANDMARKS.map(lm => (
                <text key={lm.label}
                  x={lm.x * CELL + CELL/2}
                  y={lm.y * CELL + CELL/2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fontFamily="monospace"
                  letterSpacing="2"
                  fill={lm.label === 'SAFE HOUSE' ? '#00FF88' : lm.label.includes('ZONE') || lm.label === 'HOT ZONE' ? '#FF006E' : '#00F5FF'}
                  fillOpacity="0.5"
                >
                  {lm.label}
                </text>
              ))}
            </svg>

            {/* Tile grid */}
            <div
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)` }}
            >
              {CITY_MAP.flatMap((row, r) =>
                row.map((tile, c) => {
                  const onRoute = isOnRoute(c, r)
                  const routeStep = routeIdx(c, r)
                  const isPlayer = playerPos.x === c && playerPos.y === r
                  const isDest = DEST.x === c && DEST.y === r
                  const patrol = patrols.find(p => p.x === c && p.y === r)
                  const isBlocker = tile === T.BLOCK

                  return (
                    <div
                      key={`${c}-${r}`}
                      onClick={() => !isBlocker && handleCellClick(c, r)}
                      className={[
                        TILE_STYLE[tile],
                        'relative overflow-hidden transition-colors duration-150',
                        !isBlocker ? 'cursor-pointer hover:brightness-125' : 'cursor-default',
                        tile === T.CHECKPOINT ? 'ring-inset ring-1 ring-[#FF006E]/30' : '',
                        tile === T.HOTZONE ? 'ring-inset ring-1 ring-[#FF0040]/40' : '',
                        tile === T.SAFE ? 'ring-inset ring-1 ring-[#00FF88]/40' : '',
                        onRoute && !isBlocker ? 'bg-[#BF00FF]/10' : '',
                      ].filter(Boolean).join(' ')}
                      style={{ width: CELL, height: CELL }}
                    >
                      {/* Checkpoint pulse */}
                      {tile === T.CHECKPOINT && (
                        <motion.div
                          animate={{ opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 bg-[#FF006E]/10"
                        />
                      )}

                      {/* Hotzone pulse */}
                      {tile === T.HOTZONE && (
                        <motion.div
                          animate={{ opacity: [0.1, 0.5, 0.1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="absolute inset-0 bg-[#FF0020]/15"
                        />
                      )}

                      {/* Safe house pulse */}
                      {tile === T.SAFE && (
                        <motion.div
                          animate={{ opacity: [0.1, 0.4, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-[#00FF88]/15"
                        />
                      )}

                      {/* Route step number */}
                      {onRoute && !isPlayer && routeStep > 0 && routeStep < 5 && (
                        <span className="absolute top-0.5 left-1 text-[8px] font-mono text-[#BF00FF]/60">{routeStep}</span>
                      )}

                      {/* Building texture */}
                      {isBlocker && (
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.015) 8px,rgba(255,255,255,0.015) 9px)',
                        }} />
                      )}

                      {/* DESTINATION marker */}
                      {isDest && !isPlayer && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="w-5 h-5 rounded-full border-2 border-[#00FF88] shadow-[0_0_20px_#00FF88]"
                          />
                        </div>
                      )}

                      {/* PLAYER */}
                      {isPlayer && (
                        <motion.div
                          layout
                          className="absolute inset-0 flex items-center justify-center z-20"
                        >
                          <motion.div
                            animate={{ scale: isMoving ? [1, 1.15, 1] : 1 }}
                            transition={{ duration: 0.3, repeat: isMoving ? Infinity : 0 }}
                            className="relative"
                          >
                            {/* Car body */}
                            <div className="w-7 h-5 bg-[#00F5FF] rounded-[3px] shadow-[0_0_20px_#00F5FF,0_0_40px_#00F5FF66]" />
                            {/* Headlight beam */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-2 bg-white/40 blur-sm translate-x-3" style={{ clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)' }} />
                            {/* Glow ring */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.8, 0.4] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              className="absolute -inset-2 rounded-full border border-[#00F5FF]/40"
                            />
                          </motion.div>
                        </motion.div>
                      )}

                      {/* PATROL NPC */}
                      {patrol && !isPlayer && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="relative">
                            {/* Siren flash */}
                            <motion.div
                              animate={{ backgroundColor: ['#FF006E', '#0040FF', '#FF006E'] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-4 h-3 rounded-[2px] shadow-[0_0_15px_#FF006E]"
                            />
                            <motion.div
                              animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.6, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="absolute -inset-2 rounded-full bg-[#FF006E]/20"
                            />
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-mono text-[#FF006E] whitespace-nowrap bg-black/70 px-1 rounded">{patrol.id}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel ──────────────────────────────────────── */}
        <div className="w-80 xl:w-96 flex flex-col border-l border-white/5 bg-black/40 backdrop-blur-xl flex-shrink-0">

          {/* AI Narration */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-neon-green"
              />
              <span className="font-mono text-[9px] text-neon-green tracking-[0.4em] uppercase">AI Consigliere // Live Intel</span>
            </div>

            {/* Narrative scrollable */}
            <div className="flex-1 rounded-xl bg-[#030310] border border-neon-green/10 p-4 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.p
                  key={narrative}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-sm text-white leading-relaxed italic"
                >
                  "{narrative}"
                </motion.p>
              </AnimatePresence>
              {aiLoading && (
                <div className="mt-3 flex items-center gap-2 text-neon-green/60">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3 h-3 border border-neon-green/60 border-t-transparent rounded-full"
                  />
                  <span className="font-mono text-[9px] tracking-widest">DECRYPTING...</span>
                </div>
              )}
            </div>

            {/* Checkpoints */}
            {checkpoints.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[8px] text-white/30 tracking-widest uppercase mb-2">Obstacles Ahead</p>
                <div className="flex flex-wrap gap-1.5">
                  {checkpoints.map(c => (
                    <span key={c} className="text-[9px] font-mono text-[#FF006E] bg-[#FF006E]/5 border border-[#FF006E]/20 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-5 py-4 border-t border-white/5 space-y-2">
            <p className="font-mono text-[8px] text-white/20 tracking-widest uppercase mb-3">Map Legend</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                { color: 'bg-[#00F5FF]', shadow: 'shadow-[0_0_6px_#00F5FF]', label: 'YOU' },
                { color: 'bg-[#FF006E]', shadow: 'shadow-[0_0_6px_#FF006E]', label: 'Police K9' },
                { color: 'bg-[#00FF88] border-2 border-[#00FF88]', shadow: '', label: 'Safe House' },
                { color: 'bg-[#BF00FF]', shadow: '', label: 'Route' },
                { color: 'bg-[#1a0010] border border-[#FF006E]/30', shadow: '', label: 'Checkpoint' },
                { color: 'bg-[#0a0a15] border border-white/10', shadow: '', label: 'Building' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-[2px] flex-shrink-0 ${item.color} ${item.shadow}`} />
                  <span className="font-mono text-[9px] text-white/40">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="px-5 py-4 border-t border-white/5 space-y-2">
            <p className="font-mono text-[8px] text-white/20 tracking-widest uppercase mb-3">Controls</p>
            <p className="font-mono text-[9px] text-white/40 leading-relaxed">
              <span className="text-white/60">Click any road tile</span> to move your car. The AI calculates the safest route around police patrols automatically.
            </p>
            <button onClick={resetGame}
              className="w-full mt-3 py-3 rounded-xl border border-[#FF006E]/30 text-[#FF006E] font-mono text-xs tracking-widest hover:bg-[#FF006E]/10 transition-all"
            >
              RESET GRID
            </button>
          </div>
        </div>
      </div>

      {/* ── Win/Loss Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {(gameWon || gameLost) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className={`p-10 rounded-2xl text-center border ${gameWon ? 'border-neon-green/40 bg-[#001a0d]/90' : 'border-[#FF006E]/40 bg-[#1a0005]/90'} shadow-2xl max-w-sm mx-4`}
            >
              <div className="text-6xl mb-4">{gameWon ? '🏁' : '🚔'}</div>
              <h2 className={`font-display text-4xl mb-3 ${gameWon ? 'text-neon-green drop-shadow-[0_0_20px_#00FF88]' : 'text-[#FF006E] drop-shadow-[0_0_20px_#FF006E]'}`}>
                {gameWon ? 'CLEAN ESCAPE' : 'INTERCEPTED'}
              </h2>
              <p className="font-mono text-sm text-white/60 mb-8 leading-relaxed">
                {gameWon
                  ? 'Safe house reached. You vanished into Nova Inferno like a ghost. The heat is off... for now.'
                  : 'K9 units closed the perimeter. Nova Inferno claims another ghost. Reboot and vanish again.'}
              </p>
              <button onClick={resetGame}
                className={`w-full py-4 rounded-xl font-display text-sm tracking-widest border-2 transition-all ${
                  gameWon
                    ? 'border-neon-green text-neon-green hover:bg-neon-green/20'
                    : 'border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/20'
                }`}
              >
                RUN IT AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
