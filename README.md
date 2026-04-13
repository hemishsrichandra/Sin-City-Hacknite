```
   _____ _____ _   _    _____ _____ _______ __   __
  / ____|_   _| \ | |  / ____|_   _|__   __|\\ \\ / /
 | (___   | | |  \| | | |      | |    | |    \\ V / 
  \___ \  | | | . ` | | |      | |    | |     > <  
  ____) |_| |_| |\  | | |____ _| |_   | |    / . \ 
 |_____/|_____|_| \_|  \_____|_____|  |_|   /_/ \_\
                                                    
  W H A T   H A P P E N S   H E R E ,   S T A Y S   H E R E
```

# 🎰 SIN CITY — AI-Powered Las Vegas Experience

> A visually stunning virtual Las Vegas experience with themed districts, an AI-powered agentic vacation planner, and a real-time high-stakes police evasion simulator set on the Las Vegas Strip.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0050?logo=framer)](https://www.framer.com/motion)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)
[![OSRM](https://img.shields.io/badge/OSRM-Routing-FF6B00)](http://project-osrm.org)

---

## ✨ Features

### 🎲 Interactive Districts
- **Casino Floor** — Spin the roulette wheel, deal poker hands, try the slot machine
- **Neon Nightlife** — Browse venue cards with vibe ratings and genre filters
- **The Shows** — Discover shows from cabaret to Cirque du Soleil
- **Getaway Grid** — Real-time Las Vegas police evasion simulator *(see below)*

### 🤖 AI-Powered Planner
- **5-step Interest Quiz** — Choose your vices, budget, duration, vibe, and party size
- **Streaming AI Generation** — Real-time token-by-token itinerary creation via Gemini 2.5 Flash
- **Personalised Itineraries** — Day-by-day timelines with activity matching
- **Agentic Pipeline** — Profile → Activity Matching → Budget Filter → Itinerary Builder

### 🚔 The Getaway Grid — Real-Time Evasion Simulator
The centrepiece of the application. A fully interactive, mission-based escape simulation set on a live dark-mode rendering of the Las Vegas Strip.

#### Map & Routing
- **CartoDB Dark Matter tiles** — Full dark-mode Las Vegas map with visible street names and road layout
- **OSRM real road routing** — The getaway car follows actual Las Vegas road geometry (not a straight line)
- **Promise.race timeout + retry** — If OSRM is slow, the engine retries once then falls back to a smooth 60-point interpolated arc so the car always has a complete path
- **Fetch-first polyline swap** — The old route stays visible on the map until the new OSRM route arrives; no blank-map gaps during 30-second refresh cycles
- **Animated car icon** — Rotates to face direction of travel using real bearing calculation; follows the road step-by-step at 280ms per segment

#### Gameplay & Mechanics
| Feature | Detail |
|---|---|
| **Start** | MGM Grand (south end of the Strip) |
| **Destination** | Fremont Street Experience (Downtown LV) |
| **Mission Clock** | 5-minute countdown — reach the safe house before time runs out |
| **5 K9 Patrol Units** | Placed at Caesars Palace, Wynn/Encore, Mandalay Bay, Bellagio/Flamingo crossroads, Paris Las Vegas |
| **Random patrol** | Police roam random waypoints around their spawn positions; they never chase the player |
| **BUSTED condition** | Only triggers when a police marker is within **20 m** of the car's exact position — true physical overlap, not proximity |
| **Heat Level** | 5-star cosmetic indicator that rises as patrols close in and decays when they move away |
| **Route refresh** | Every 30 s the route is recalculated from the car's current position to the safe house |
| **Win state** | Car drives the complete OSRM route and arrives at Fremont Street |
| **BUSTED state** | Red-pulse overlay + "TRY AGAIN" button; also triggers if the 5-minute mission clock expires |
| **Reset** | Instantly clears all intervals/timers (no stale timer leak), returns car to MGM Grand |

#### AI Narration
- **Gemini 2.5 Flash** tactical narration via `/api/escape` backend endpoint
- Updates every 30 s with police ETA, heat level, and contextual Las Vegas landmark commentary
- Gracefully falls back to `COMMS DISRUPTED` if the backend is unavailable

#### Visual Polish
- Rain-streak overlay (28 animated streaks) over the map
- Siren flash effect on the HUD at high heat
- Scanline CRT overlay on the map tile layer
- Mission timer colour-coded: green → yellow → red as time runs low
- Full dark-mode HUD with neon-cyan, neon-pink, and neon-purple accent colours

### 🎨 Visual Design
- Neon glow effects with real CSS text shadows
- Particle field background (canvas-based)
- Animated city skyline silhouette
- Typewriter terminal animation
- Flickering neon sign effects
- Smooth page transitions with Framer Motion

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)             │
│                                                     │
│  Home ──── Districts ──── Planner ──── GetawayGrid  │
│   │           │               │              │      │
│   │    ┌──────┼──────┐   InterestQuiz   LeafletMap  │
│   │    │      │      │        │          OSRM API   │
│   │  Casino Night  Shows  StreamingView  CartoDB    │
│   │    │      │      │        │          Tiles      │
│   │  Roulette Venues Cards ItineraryCard            │
│   │  Cards   Filter  Shows                         │
│   │  Slots                                          │
│                                                     │
│  Components: GlowCard, NeonText, ParticleField,     │
│  AnimatedButton, FlickerLight, SoundToggle          │
└────────────────────────┬────────────────────────────┘
                         │ Axios / SSE Stream
                         ▼
┌─────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                   │
│                                                     │
│  POST /api/plan   ──► Agentic Itinerary Pipeline    │
│  POST /api/escape ──► Gemini 2.5 Flash Narration    │
│  GET  /api/health                                   │
│                                                     │
│         Profiler ──► Matcher ──► Builder            │
│              │          │           │               │
│         activities.json (45 curated venues)         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              EXTERNAL APIs (no key required)         │
│                                                     │
│  OSRM  ── Real Las Vegas road routing               │
│  CartoDB Dark Matter ── Dark map tiles              │
│  Gemini 2.5 Flash    ── AI tactical narration       │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Gemini API key (for AI narration in Getaway Grid + Planner)

### Frontend Setup
```bash
cd sin-city/frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend Setup
```bash
cd sin-city/backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Environment Variables
Create `sin-city/frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

Create `sin-city/backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```

---

## 🎯 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI framework + build tool |
| TypeScript | Type safety |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | Page transitions + animations |
| Leaflet.js | Interactive map rendering |
| OSRM | Real road routing on Las Vegas map |
| CartoDB Tiles | Dark Matter map tiles |
| Zustand | State management |
| Howler.js | Ambient sound |
| Lucide React | Icons |
| canvas-confetti | Jackpot celebrations |

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI | API server |
| Pydantic v2 | Request/response validation |
| Google Gemini 2.5 Flash | AI narrative + itinerary generation |
| httpx | Async HTTP client |
| NumPy | Embedding similarity |
| uvicorn | ASGI server |

---

## 📁 Project Structure

```
HackNite/
└── sin-city/
    ├── frontend/               # React + Vite frontend
    │   ├── src/
    │   │   ├── components/     # Reusable UI components
    │   │   │   ├── casino/     # Roulette, Cards, Slots
    │   │   │   ├── districts/  # District cards & map
    │   │   │   ├── layout/     # Navbar, Footer
    │   │   │   ├── planner/    # Quiz, Streaming, Itinerary
    │   │   │   └── ui/         # NeonText, GlowCard, etc.
    │   │   ├── pages/
    │   │   │   ├── Home.tsx
    │   │   │   ├── Districts.tsx
    │   │   │   ├── Planner.tsx
    │   │   │   └── GetawayGrid.tsx   ← evasion simulator
    │   │   ├── store/          # Zustand stores
    │   │   ├── hooks/          # Custom hooks
    │   │   └── types/          # TypeScript types
    │   ├── vercel.json         # SPA routing (no 404 on refresh)
    │   └── package.json
    │
    ├── backend/                # FastAPI backend
    │   ├── agent/              # AI pipeline
    │   │   ├── graph.py        # Agent orchestration
    │   │   ├── nodes.py        # Processing nodes (Gemini calls)
    │   │   ├── prompts.py      # LLM prompts
    │   │   └── state.py        # State definition
    │   ├── data/
    │   │   └── activities.json # 45 curated activities
    │   ├── models/
    │   │   └── schemas.py      # Pydantic models
    │   └── main.py             # FastAPI entry
    │
    └── README.md
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--neon-pink` | `#FF006E` | Primary accent, CTAs, police units |
| `--neon-cyan` | `#00F5FF` | Secondary accent, getaway car |
| `--neon-gold` | `#FFD700` | Casino elements |
| `--neon-purple` | `#BF00FF` | Shows district, route polyline |
| `--neon-green` | `#00FF88` | Safe house marker, win state |
| `--bg-void` | `#030308` | Page background |
| `--font-display` | Bebas Neue | Headlines |
| `--font-body` | Rajdhani | Body text |
| `--font-mono` | Space Mono | Code, HUD labels |

---

## 🗺️ Getaway Grid — Key Coordinates

| Location | Lat | Lng | Role |
|---|---|---|---|
| MGM Grand | 36.1020 | -115.1721 | Start |
| Fremont Street | 36.1699 | -115.1425 | Safe House |
| Caesars Palace | 36.1163 | -115.1745 | K9-1 Spawn |
| Wynn / Encore | 36.1283 | -115.1641 | K9-2 Spawn |
| Mandalay Bay | 36.0907 | -115.1763 | K9-3 Spawn |
| Bellagio / Flamingo | 36.1126 | -115.1748 | K9-4 Spawn |
| Paris Las Vegas | 36.1200 | -115.1700 | K9-5 Spawn |

---

## 👥 Team

Built for **HackNite 2026** 🎲

---

## 📄 License

MIT — What happens in Sin City, stays in Sin City.
