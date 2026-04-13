import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ROUTE_REFRESH_MS = 30_000  // 30 seconds
const PATROL_MOVE_MS   = 4_000   // police move every 4s (was 2.5 — easier)
const CAR_STEP_MS      = 280     // ms between each road-point step
const MISSION_SECS     = 300     // 5 minutes to escape (was 3 — easier)

// ── Las Vegas fixed coordinates ──────────────────────────────────────────────
// Start: MGM Grand (south end of Strip)
const LV_START  = { lat: 36.1020, lng: -115.1721 }
// Safe House: Fremont Street Experience (Downtown Las Vegas)
const LV_SAFE   = { lat: 36.1699, lng: -115.1425 }
// Police patrol spawn points (real Strip intersections)
const LV_POLICE = [
  { id: 'K9-1', lat: 36.1163, lng: -115.1745 },  // Caesars Palace
  { id: 'K9-2', lat: 36.1283, lng: -115.1641 },  // Wynn / Encore
  { id: 'K9-3', lat: 36.0907, lng: -115.1763 },  // Mandalay Bay
  { id: 'K9-4', lat: 36.1126, lng: -115.1748 },  // Bellagio / Flamingo crossroads
  { id: 'K9-5', lat: 36.1200, lng: -115.1700 },  // Paris Las Vegas block
]


// Custom Leaflet icons — inline SVG so no image file needed
const makeIcon = (color: string, label: string) => L.divIcon({
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  html: `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
      <div style="width:36px;height:36px;border-radius:50%;background:${color};
        box-shadow:0 0 20px ${color},0 0 40px ${color}66;
        display:flex;align-items:center;justify-content:center;
        border:2px solid rgba(255,255,255,0.3);font-size:16px;">
        ${label}
      </div>
    </div>
  `,
})

// Bearing in degrees between two lat/lng points (for car rotation)
function bearing(a: [number,number], b: [number,number]) {
  const toRad = (d: number) => d * Math.PI / 180
  const toDeg = (r: number) => r * 180 / Math.PI
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0]), lat2 = toRad(b[0])
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// Dynamic car icon with rotation
const makeCarIcon = (deg = 0) => L.divIcon({
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  html: `
    <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;transform:rotate(${deg}deg);transition:transform 0.25s ease;">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="16" rx="16" ry="16" fill="#00F5FF" fill-opacity="0.18"/>
        <path d="M16 4 L22 26 L16 22 L10 26 Z" fill="#00F5FF" filter="url(#glow)"/>
        <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      </svg>
    </div>
  `,
})

const SAFE_ICON   = makeIcon('#00FF88', '🏁')
const POLICE_ICON = makeIcon('#FF006E', '🚔')

// Slightly offset a coordinate for simulated patrol randomness
const nudge = (lat: number, lng: number, radius = 0.005) => ({
  lat: lat + (Math.random() - 0.5) * radius,
  lng: lng + (Math.random() - 0.5) * radius,
})

// Fetch route from OSRM – Promise.race timeout, one retry, smooth interpolated fallback
async function fetchRoute(
  from: { lat: number; lng: number },
  to:   { lat: number; lng: number },
  attempt = 0
): Promise<[number, number][]> {
  // 60‑point great‑circle interpolation so the car ALWAYS has a full path to drive
  const smoothFallback = (): [number,number][] =>
    Array.from({ length: 60 }, (_, i) => {
      const t = i / 59
      return [from.lat + (to.lat - from.lat) * t, from.lng + (to.lng - from.lng) * t] as [number,number]
    })
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    const fetchP   = fetch(url)
    const timeoutP = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 7000))
    const resp = await Promise.race([fetchP, timeoutP]) as Response
    if (!resp.ok) throw new Error('OSRM failed')
    const data = await resp.json()
    const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    )
    // Guard against suspiciously short route – retry once
    if (coords.length < 8 && attempt < 1) {
      await new Promise(r => setTimeout(r, 1000))
      return fetchRoute(from, to, attempt + 1)
    }
    return coords.length >= 2 ? coords : smoothFallback()
  } catch {
    if (attempt < 1) {
      await new Promise(r => setTimeout(r, 1200))
      return fetchRoute(from, to, attempt + 1)
    }
    return smoothFallback()
  }
}

interface PatrolUnit {
  id: string
  lat: number
  lng: number
  marker: L.Marker | null
  waypoints: { lat: number; lng: number }[]
  wIdx: number
}

export default function GetawayGrid() {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapObj      = useRef<L.Map | null>(null)
  const playerMark  = useRef<L.Marker | null>(null)
  const safeMark    = useRef<L.Marker | null>(null)
  const routeLine   = useRef<L.Polyline | null>(null)
  const patrols     = useRef<PatrolUnit[]>([])
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const narrativeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playerPos   = useRef<{ lat: number; lng: number } | null>(null)
  const routeCoords = useRef<[number,number][]>([])   // full OSRM road geometry
  const carStepIdx  = useRef(0)                        // which coord the car is at
  const carMoveRef    = useRef<ReturnType<typeof setInterval> | null>(null) // car animation
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null) // route refresh tick
  const missionRef    = useRef<ReturnType<typeof setInterval> | null>(null) // mission timer tick

  const [phase, setPhase]           = useState<'ready' | 'active' | 'won' | 'busted'>('ready')
  const [narrative, setNarrative]   = useState('LAS VEGAS GRID ONLINE. MGM GRAND → FREMONT STREET. HIT LAUNCH TO BEGIN EVASION.')
  const [heatLevel, setHeatLevel]   = useState(1)
  const [policeETA, setPoliceETA]   = useState<number | null>(null)
  const [timeLeft, setTimeLeft]     = useState(ROUTE_REFRESH_MS / 1000)
  const [missionTime, setMissionTime] = useState(MISSION_SECS)  // 3-min mission clock
  const [aiLoading, setAiLoading]   = useState(false)
  const [checkpoints, setCheckpoints] = useState<string[]>([])
  const [safeHousePos, setSafeHousePos] = useState<{ lat: number; lng: number } | null>(null)
  const heatRef = useRef(1) // stable ref for heat inside intervals

  // ── Build map once ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapObj.current) return

    const map = L.map(mapRef.current, {
      center: [LV_START.lat, LV_START.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    })

    // CartoDB Dark Matter (all) — dark background, full street + label visibility
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    mapObj.current = map
  }, [])

  // ── Initialize Las Vegas fixed city ──────────────────────────────────────────
  useEffect(() => {
    // Wait for the map to be ready (runs after map-build effect)
    const init = () => {
      if (!mapObj.current) { setTimeout(init, 50); return }

      playerPos.current = { ...LV_START }

      // Player car marker at MGM Grand
      playerMark.current = L.marker([LV_START.lat, LV_START.lng], { icon: makeCarIcon(0), zIndexOffset: 1000 })
        .addTo(mapObj.current)
        .bindPopup('<b style="font-family:monospace;color:#00F5FF">GETAWAY CAR // MGM GRAND</b>')

      // Safe house marker at Fremont Street
      setSafeHousePos(LV_SAFE)
      safeMark.current = L.marker([LV_SAFE.lat, LV_SAFE.lng], { icon: SAFE_ICON })
        .addTo(mapObj.current)
        .bindPopup('<b style="font-family:monospace;color:#00FF88">EXTRACTION // FREMONT STREET</b>')

      // Police units at real Strip intersections
      patrols.current = LV_POLICE.map(o => ({
        id: o.id,
        lat: o.lat,
        lng: o.lng,
        marker: L.marker([o.lat, o.lng], { icon: POLICE_ICON })
          .addTo(mapObj.current!)
          .bindTooltip(`<span style="font-family:monospace;color:#FF006E;font-size:10px">${o.id}</span>`, {
            permanent: true, direction: 'top', className: 'patrol-label'
          }),
        waypoints: [
          { lat: o.lat, lng: o.lng },
          nudge(o.lat, o.lng, 0.008),
          nudge(o.lat, o.lng, 0.008),
          nudge(o.lat, o.lng, 0.008),
        ],
        wIdx: 0,
      }))
    }
    init()
  }, [])

  // ── Draw route ───────────────────────────────────────────────────────────────
  const drawRoute = useCallback(async (
    from: { lat: number; lng: number },
    to:   { lat: number; lng: number }
  ): Promise<[number,number][]> => {
    if (!mapObj.current) return []
    // Fetch FIRST – old polyline stays visible until new coords arrive (no blank gap)
    const coords = await fetchRoute(from, to)
    if (routeLine.current) { routeLine.current.remove(); routeLine.current = null }
    routeCoords.current = coords
    carStepIdx.current  = 0
    routeLine.current = L.polyline(coords, {
      color: '#BF00FF',
      weight: 5,
      opacity: 0.9,
      dashArray: '12, 6',
    }).addTo(mapObj.current)
    mapObj.current.fitBounds(L.latLngBounds(coords), { padding: [80, 80] })
    return coords
  }, [])

  // ── AI narration ─────────────────────────────────────────────────────────────
  const fetchIntel = useCallback(async () => {
    const p = playerPos.current
    const s = safeHousePos
    if (!p || !s) return
    setAiLoading(true)
    try {
      const resp = await axios.post(`${API_URL}/api/escape`, {
        player_x: Math.round(p.lat * 1000),
        player_y: Math.round(p.lng * 1000),
        dest_x:   Math.round(s.lat * 1000),
        dest_y:   Math.round(s.lng * 1000),
        heat_level: heatLevel,
        police_positions: patrols.current.map(pt => ({
          x: Math.round(pt.lat * 1000),
          y: Math.round(pt.lng * 1000),
        })),
      })
      const d = resp.data
      if (d.narrative) setNarrative(d.narrative)
      if (d.police_eta_seconds !== undefined) setPoliceETA(d.police_eta_seconds)
      if (d.checkpoints_ahead) setCheckpoints(d.checkpoints_ahead)
    } catch {
      setNarrative('COMMS DISRUPTED. MAINTAIN SPEED.')
    } finally {
      setAiLoading(false)
    }
  }, [heatLevel, safeHousePos])

  // ── Launch simulation ────────────────────────────────────────────────────────
  const launchSim = useCallback(async () => {
    const p = playerPos.current
    const s = safeHousePos
    if (!p || !s) return

    setPhase('active')
    setNarrative('SYSTEMS HOT. ROUTE CALCULATED. POLICE UNITS MOBILIZING.')

    // Draw initial route — coords stored in routeCoords.current
    await drawRoute(p, s)
    await fetchIntel()

    // ── Animate car along real road geometry ──────────────────────────────────
    if (carMoveRef.current) clearInterval(carMoveRef.current)
    carMoveRef.current = setInterval(() => {
      const coords = routeCoords.current
      const idx    = carStepIdx.current
      if (!coords.length || idx >= coords.length - 1) return

      const curr = coords[idx]
      const next = coords[idx + 1]

      // ── BUSTED check at 280ms – only when car physically overlaps a patrol ──
      // 20m ≈ the pixel radius of both icons at zoom 14 (true visual overlap)
      if (mapObj.current) {
        const busted = patrols.current.some(pt =>
          (mapObj.current!.distance([pt.lat, pt.lng], [next[0], next[1]]) ?? 9999) < 20
        )
        if (busted) {
          setPhase('busted')
          setNarrative('GETAWAY CAR INTERCEPTED. K9 UNIT ON TOP OF YOU. LIGHTS OUT.')
          return
        }
      }

      // Compute bearing so car icon faces direction of travel
      const deg = bearing(curr, next)
      const newLatLng: [number,number] = [next[0], next[1]]

      playerMark.current?.setLatLng(newLatLng)
      playerMark.current?.setIcon(makeCarIcon(deg))

      // Keep map camera loosely following the car
      mapObj.current?.setView(newLatLng, mapObj.current.getZoom(), { animate: true, duration: 0.25 })

      // Update playerPos ref so heat/ETA remain accurate
      playerPos.current = { lat: next[0], lng: next[1] }
      carStepIdx.current = idx + 1

      // Win: reached destination
      if (idx + 1 >= coords.length - 1) {
        setPhase('won')
        setNarrative('YOU MADE IT. SAFE HOUSE SECURED. HEAT LEVEL DROPPING. DISAPPEAR.')
      }
    }, CAR_STEP_MS)

    // ── Patrol movement – pure random roaming, no convergence ──────────────────
    timerRef.current = setInterval(() => {
      patrols.current = patrols.current.map(pt => {
        // Always use existing random waypoints – no chasing the player ever
        const next = pt.waypoints[(pt.wIdx + 1) % pt.waypoints.length]
        pt.marker?.setLatLng([next.lat, next.lng])

        // Update ETA display only (heat level raised by proximity, BUSTED only by carMoveRef)
        if (playerPos.current && mapObj.current) {
          const dist = mapObj.current.distance(
            [next.lat, next.lng],
            [playerPos.current.lat, playerPos.current.lng]
          )
          // Heat indicator – purely cosmetic, does not trigger BUSTED
          const newHeat =
            dist < 150 ? 5 :
            dist < 350 ? 4 :
            dist < 600 ? 3 :
            dist < 900 ? 2 : 1
          setHeatLevel(h => Math.max(h, newHeat))
          heatRef.current = Math.max(heatRef.current, newHeat)
          setPoliceETA(Math.round(dist / 13))
        }

        return { ...pt, lat: next.lat, lng: next.lng, wIdx: (pt.wIdx + 1) % pt.waypoints.length }
      })

      // Heat decay when all patrols are well away
      if (playerPos.current && mapObj.current) {
        const minDist = Math.min(
          ...patrols.current.map(pt =>
            mapObj.current!.distance([pt.lat, pt.lng], [playerPos.current!.lat, playerPos.current!.lng])
          )
        )
        if (minDist > 900) {
          setHeatLevel(h => { const n = Math.max(1, h - 1); heatRef.current = n; return n })
        }
      }
    }, PATROL_MOVE_MS)

    // Route + narrative refresh every 30s
    const refreshCycle = async () => {
      setTimeLeft(ROUTE_REFRESH_MS / 1000)
      if (playerPos.current && safeHousePos) {
        await drawRoute(playerPos.current, safeHousePos)
        await fetchIntel()
        // Give patrols new pursuit waypoints
        patrols.current = patrols.current.map(pt => ({
          ...pt,
          waypoints: Array.from({ length: 5 }, () =>
            nudge(pt.lat, pt.lng, 0.006)
          ),
          wIdx: 0,
        }))
      }
      narrativeTimer.current = setTimeout(refreshCycle, ROUTE_REFRESH_MS)
    }
    narrativeTimer.current = setTimeout(refreshCycle, ROUTE_REFRESH_MS)

    // Route countdown — stored in ref so reset can clear it
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { return ROUTE_REFRESH_MS / 1000 }
        return t - 1
      })
    }, 1000)

    // Mission countdown — stored in ref so reset can clear it
    if (missionRef.current) clearInterval(missionRef.current)
    missionRef.current = setInterval(() => {
      setMissionTime(t => {
        if (t <= 1) {
          if (missionRef.current) clearInterval(missionRef.current)
          setPhase('busted')
          setNarrative('TIME EXPIRED. PERIMETER CLOSED. REINFORCEMENTS ARRIVED. NO WAY OUT.')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [drawRoute, fetchIntel, safeHousePos])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (narrativeTimer.current) clearTimeout(narrativeTimer.current)
      if (carMoveRef.current) clearInterval(carMoveRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
      if (missionRef.current) clearInterval(missionRef.current)
    }
  }, [])

  // Win check — when player manually reports reaching safe house
  const reportArrival = () => {
    setPhase('won')
    setNarrative('YOU MADE IT. SAFE HOUSE SECURED. HEAT LEVEL DROPPING. DISAPPEAR.')
  }

  const resetSim = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (narrativeTimer.current) clearTimeout(narrativeTimer.current)
    if (carMoveRef.current) clearInterval(carMoveRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)  // fix: clear route tick
    if (missionRef.current) clearInterval(missionRef.current)       // fix: clear mission tick
    if (routeLine.current) { routeLine.current.remove(); routeLine.current = null }
    routeCoords.current = []
    carStepIdx.current  = 0
    playerPos.current   = { ...LV_START }
    heatRef.current     = 1
    setPhase('ready')
    setHeatLevel(1)
    setPoliceETA(null)
    setMissionTime(MISSION_SECS)
    setNarrative('GRID RESET. GETAWAY CAR RETURNED TO MGM GRAND. READY TO LAUNCH.')
    setTimeLeft(ROUTE_REFRESH_MS / 1000)
    // Reset car marker to start position
    playerMark.current?.setLatLng([LV_START.lat, LV_START.lng])
    playerMark.current?.setIcon(makeCarIcon(0))
    // Reset police to their Strip positions
    patrols.current = patrols.current.map((pt, i) => {
      const origin = LV_POLICE[i] ?? LV_POLICE[0]
      pt.marker?.setLatLng([origin.lat, origin.lng])
      return {
        ...pt,
        lat: origin.lat,
        lng: origin.lng,
        waypoints: [
          { lat: origin.lat, lng: origin.lng },
          nudge(origin.lat, origin.lng, 0.008),
          nudge(origin.lat, origin.lng, 0.008),
        ],
        wIdx: 0,
      }
    })
    // Fly back to the full strip view
    mapObj.current?.flyToBounds(
      [[LV_START.lat, LV_START.lng], [LV_SAFE.lat, LV_SAFE.lng]],
      { padding: [60, 60], duration: 1.2 }
    )
  }

  const pct = Math.round((timeLeft / (ROUTE_REFRESH_MS / 1000)) * 100)

  return (
    <div className="min-h-screen bg-[#030308] flex flex-col pt-20">

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/70 backdrop-blur-xl flex-shrink-0 flex-wrap gap-3">

        {/* Title */}
        <div>
          <h1 className="font-display text-xl text-[#00F5FF] tracking-widest drop-shadow-[0_0_10px_#00F5FF]">
            THE GETAWAY GRID
          </h1>
          <p className="font-mono text-[8px] text-white/30 tracking-[0.35em] uppercase">
            Nova Inferno // Real-World Evasion Engine
          </p>
        </div>

        {/* Heat + ETA + Refresh Timer */}
        <div className="flex items-center gap-5">
          {/* Heat */}
          <div>
            <p className="font-mono text-[7px] text-white/25 tracking-widest uppercase mb-1">Heat</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <motion.span
                  key={s}
                  animate={s <= heatLevel && heatLevel >= 4 ? { opacity: [1, 0.2, 1] } : {}}
                  transition={{ duration: 0.35, repeat: Infinity }}
                  className={`text-base leading-none ${s <= heatLevel ? 'text-[#FF006E] drop-shadow-[0_0_8px_#FF006E]' : 'text-white/8'}`}
                >★</motion.span>
              ))}
            </div>
          </div>

          {/* ETA */}
          <div className="border-l border-white/10 pl-5">
            <p className="font-mono text-[7px] text-white/25 tracking-widest uppercase mb-0.5">Police ETA</p>
            <motion.span
              animate={heatLevel >= 4 ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.4, repeat: Infinity }}
              className="font-display text-xl text-[#FF006E] drop-shadow-[0_0_8px_#FF006E]"
            >
              {policeETA !== null ? `${policeETA}s` : '—'}
            </motion.span>
          </div>

          {/* Route refresh countdown */}
          {phase === 'active' && (
            <div className="border-l border-white/10 pl-5">
              <p className="font-mono text-[7px] text-white/25 tracking-widest uppercase mb-1">Route Refresh</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-neon-green rounded-full"
                    style={{ boxShadow: '0 0 6px #00FF88' }}
                  />
                </div>
                <span className="font-mono text-[9px] text-neon-green">{timeLeft}s</span>
              </div>
            </div>
          )}

          {/* Mission countdown */}
          {phase === 'active' && (
            <div className="border-l border-white/10 pl-5">
              <p className="font-mono text-[7px] text-white/25 tracking-widest uppercase mb-0.5">Time Left</p>
              <motion.span
                animate={missionTime <= 30 ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
                className={`font-display text-xl ${
                  missionTime <= 30 ? 'text-[#FF006E] drop-shadow-[0_0_10px_#FF006E]' :
                  missionTime <= 60 ? 'text-yellow-400' : 'text-neon-green'
                }`}
              >
                {Math.floor(missionTime / 60)}:{String(missionTime % 60).padStart(2, '0')}
              </motion.span>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 border-l border-white/10 pl-5">
            {phase === 'ready' && (
              <button onClick={launchSim}
                className="px-4 py-2 rounded-lg font-mono text-xs tracking-widest bg-neon-green/15 border border-neon-green/40 text-neon-green hover:bg-neon-green/25 transition-all"
              >
                ▶ LAUNCH
              </button>
            )}
            {phase === 'active' && (
              <>
                <button onClick={() => fetchIntel()}
                  disabled={aiLoading}
                  className="px-3 py-2 rounded-lg font-mono text-xs tracking-widest bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20 transition-all disabled:opacity-40"
                >
                  {aiLoading ? '...' : 'INTEL'}
                </button>
                <button onClick={reportArrival}
                  className="px-3 py-2 rounded-lg font-mono text-xs tracking-widest bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 transition-all"
                >
                  ARRIVED
                </button>
                <button onClick={resetSim}
                  className="px-3 py-2 rounded-lg font-mono text-xs tracking-widest bg-[#FF006E]/10 border border-[#FF006E]/30 text-[#FF006E] hover:bg-[#FF006E]/20 transition-all"
                >
                  RESET
                </button>
              </>
            )}
            {(phase === 'won' || phase === 'busted') && (
              <button onClick={resetSim}
                className={`px-4 py-2 rounded-lg font-mono text-xs tracking-widest transition-all ${
                  phase === 'won'
                    ? 'bg-neon-green/15 border border-neon-green/40 text-neon-green hover:bg-neon-green/25'
                    : 'bg-[#FF006E]/15 border border-[#FF006E]/40 text-[#FF006E] hover:bg-[#FF006E]/25'
                }`}
              >
                TRY AGAIN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Map ──────────────────────────────────────────────────────────── */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: 'calc(100vh - 120px)' }} />

          {/* ── Street Animations Layer ── */}

          {/* Rain streaks */}
          <div className="absolute inset-0 pointer-events-none z-[401] overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
                style={{
                  left: `${(i / 28) * 100 + Math.random() * 3}%`,
                  height: `${40 + Math.random() * 40}px`,
                }}
                animate={{ y: ['-60px', '110vh'] }}
                transition={{
                  duration: 0.6 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[402]"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
            }}
          />

          {/* Animated neon corner accents */}
          <div className="absolute inset-0 pointer-events-none z-[403]">
            {/* TL */}
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00F5FF]/50" />
            {/* TR */}
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: 0.75 }}
              className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#00F5FF]/50" />
            {/* BL */}
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00F5FF]/50" />
            {/* BR */}
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: 2.25 }}
              className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00F5FF]/50" />
          </div>

          {/* Police siren flash — only when heat ≥ 3 */}
          {heatLevel >= 3 && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-[404]"
              animate={{ backgroundColor: ['rgba(255,0,110,0.04)', 'rgba(0,64,255,0.04)', 'rgba(255,0,110,0.04)'] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Glitch flash — when heat = 5 */}
          {heatLevel >= 5 && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-[405] bg-[#FF006E]/10"
              animate={{ opacity: [0, 0.6, 0, 0.3, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
            />
          )}

          {/* Vignette frame */}
          <div className="absolute inset-0 pointer-events-none z-[400] border border-white/5"
            style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(3,3,8,0.65) 100%)' }}
          />

          {/* Phase overlays */}
          <AnimatePresence>
            {phase === 'won' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#001a0a]/92 backdrop-blur-sm z-[500]"
              >
                <div className="text-6xl mb-5">🏁</div>
                <h2 className="font-display text-5xl text-neon-green mb-3 drop-shadow-[0_0_30px_#00FF88]">CLEAN ESCAPE</h2>
                <p className="font-mono text-sm text-white/50 mb-8 max-w-xs text-center leading-relaxed">
                  Fremont Street reached. You vanished into the Las Vegas night like smoke. Heat drops to zero.
                </p>
                <button onClick={resetSim} className="px-8 py-4 rounded-xl border-2 border-neon-green text-neon-green font-display text-sm tracking-widest hover:bg-neon-green/20 transition-all">
                  EVADE AGAIN
                </button>
              </motion.div>
            )}
            {phase === 'busted' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a0005]/95 backdrop-blur-sm z-[500]"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.4, repeat: 3 }}
                  className="text-6xl mb-5"
                >🚔</motion.div>
                <motion.h2
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.3, repeat: 5 }}
                  className="font-display text-5xl text-[#FF006E] mb-3 drop-shadow-[0_0_30px_#FF006E]"
                >
                  BUSTED
                </motion.h2>
                <p className="font-mono text-sm text-white/50 mb-8 max-w-xs text-center leading-relaxed">
                  {narrative}
                </p>
                <button onClick={resetSim} className="px-8 py-4 rounded-xl border-2 border-[#FF006E] text-[#FF006E] font-display text-sm tracking-widest hover:bg-[#FF006E]/20 transition-all">
                  TRY AGAIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel ──────────────────────────────────────────────────── */}
        <div className="w-72 xl:w-80 flex flex-col border-l border-white/5 bg-black/50 backdrop-blur-xl flex-shrink-0 overflow-y-auto">

          {/* AI Narration */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                animate={{ opacity: phase === 'active' ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${phase === 'active' ? 'bg-neon-green shadow-[0_0_6px_#00FF88]' : 'bg-white/20'}`}
              />
              <span className="font-mono text-[8px] text-neon-green tracking-[0.5em] uppercase">AI Consigliere</span>
            </div>

            <div className="rounded-xl bg-[#020209] border border-neon-green/10 p-4 min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={narrative.slice(0, 30)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="font-display text-sm text-white leading-relaxed italic"
                >
                  "{narrative}"
                </motion.p>
              </AnimatePresence>
              {aiLoading && (
                <div className="mt-3 flex items-center gap-2 text-neon-green/50">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3 h-3 border border-neon-green/50 border-t-transparent rounded-full"
                  />
                  <span className="font-mono text-[8px] tracking-widest">DECRYPTING COMMS</span>
                </div>
              )}
            </div>

            {checkpoints.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[7px] text-white/25 tracking-widest uppercase mb-2">Surveillance Zones</p>
                <div className="flex flex-wrap gap-1">
                  {checkpoints.map(c => (
                    <span key={c} className="font-mono text-[8px] text-[#FF006E] bg-[#FF006E]/5 border border-[#FF006E]/15 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-5 py-4 border-t border-white/5">
            <p className="font-mono text-[7px] text-white/20 tracking-widest uppercase mb-3">Legend</p>
            <div className="space-y-2">
              {[
                { icon: '🚗', color: '#00F5FF', label: 'Your Position' },
                { icon: '🚔', color: '#FF006E', label: 'Police Unit (×3)' },
                { icon: '🏁', color: '#00FF88', label: 'Extraction Point' },
                { icon: '—',  color: '#BF00FF', label: 'Safest Route (live)' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-sm w-5 text-center">{item.icon}</span>
                  <span className="font-mono text-[9px]" style={{ color: item.color }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="px-5 py-4 border-t border-white/5">
            <p className="font-mono text-[7px] text-white/20 tracking-widest uppercase mb-3">How It Works</p>
            <div className="space-y-2.5">
              {[
                { n: '01', t: 'Scene: MGM Grand → Fremont Street, Las Vegas.' },
                { n: '02', t: '3 police units patrol Caesars, Wynn, and Mandalay Bay.' },
                { n: '03', t: 'OSRM plots the safest real-road escape route.' },
                { n: '04', t: 'Route and AI narration refresh every 30 seconds.' },
                { n: '05', t: 'Car drives automatically. Heat rises as K9 units close in.' },
              ].map(step => (
                <div key={step.n} className="flex gap-3">
                  <span className="font-mono text-[8px] text-neon-green/50 flex-shrink-0">{step.n}</span>
                  <span className="font-mono text-[9px] text-white/35 leading-relaxed">{step.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet + animation styles */}
      <style>{`
        .leaflet-control-attribution { display: none !important; }
        .patrol-label .leaflet-tooltip-content { 
          background: transparent !important; border: none !important; 
          box-shadow: none !important; padding: 0 !important;
        }
        .patrol-label { background: transparent !important; border: none !important; box-shadow: none !important; }

        /* Animated route pulse on Leaflet polyline */
        .leaflet-overlay-pane path {
          filter: drop-shadow(0 0 4px #BF00FF) drop-shadow(0 0 12px #BF00FF66);
          animation: routePulse 2s ease-in-out infinite;
        }
        @keyframes routePulse {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 1; }
        }

        /* Dark map tiles — slightly brighten labels for readability */
        .leaflet-tile { filter: brightness(1.05) saturate(1.1); }
      `}</style>
    </div>
  )
}
