```
   _____ _____ _   _    _____ _____ _______ __   __
  / ____|_   _| \ | |  / ____|_   _|__   __|\ \ / /
 | (___   | | |  \| | | |      | |    | |    \ V / 
  \___ \  | | | . ` | | |      | |    | |     > <  
  ____) |_| |_| |\  | | |____ _| |_   | |    / . \ 
 |_____/|_____|_| \_|  \_____|_____|  |_|   /_/ \_\
                                                    
  W H A T   H A P P E N S   H E R E ,   S T A Y S   H E R E
```

# 🎰 SIN CITY — AI-Powered Las Vegas Experience

> A visually stunning virtual Las Vegas experience with themed districts and an AI-powered agentic vacation planner that generates personalised itineraries based on your chosen vices.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0050?logo=framer)](https://www.framer.com/motion)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

---

## ✨ Features

### 🎲 Interactive Districts
- **Casino Floor** — Spin the roulette wheel, deal poker hands, try the slot machine
- **Neon Nightlife** — Browse venue cards with vibe ratings and genre filters
- **The Shows** — Discover shows from cabaret to Cirque du Soleil
- **Street Scene** — Explore off-Strip experiences and hidden gems

### 🤖 AI-Powered Planner
- **5-step Interest Quiz** — Choose your vices, budget, duration, vibe, and party size
- **Streaming AI Generation** — Real-time token-by-token itinerary creation
- **Personalized Itineraries** — Day-by-day timelines with activity matching
- **Agentic Pipeline** — Profile → Activity Matching → Budget Filter → Itinerary Builder

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
┌─────────────────────────────────────────┐
│             FRONTEND (React)            │
│                                         │
│  Home ──── Districts ──── Planner       │
│   │          │               │          │
│   │    ┌─────┼─────┐    InterestQuiz    │
│   │    │     │     │         │          │
│   │  Casino Night Shows  StreamingView  │
│   │    │     │     │         │          │
│   │  Roulette Venues Cards ItineraryCard│
│   │  Cards   Filter  Shows             │
│   │  Slots                              │
│                                         │
│  Components: GlowCard, NeonText,        │
│  ParticleField, AnimatedButton,         │
│  FlickerLight, SoundToggle              │
└──────────────────┬──────────────────────┘
                   │ SSE Stream
                   ▼
┌─────────────────────────────────────────┐
│            BACKEND (FastAPI)            │
│                                         │
│  POST /api/plan ──► Agent Pipeline      │
│                      │                  │
│              ┌───────┼───────┐          │
│              ▼       ▼       ▼          │
│          Profiler  Matcher  Builder     │
│              │       │       │          │
│              │   Embeddings  Ollama     │
│              │   (fallback)  (fallback) │
│              ▼       ▼       ▼          │
│         activities.json (45 venues)     │
│                                         │
│  GET /api/health                        │
└─────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- (Optional) [Ollama](https://ollama.ai) for local LLM

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### (Optional) Ollama Setup
```bash
# Install Ollama: https://ollama.ai
ollama pull llama3
# The backend will auto-connect to localhost:11434
# If Ollama is unavailable, the backend falls back to a curated itinerary generator
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
| Zustand | State management |
| Howler.js | Ambient sound |
| Lucide React | Icons |
| canvas-confetti | Jackpot celebrations |

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI | API server |
| Pydantic v2 | Request/response validation |
| httpx | Async HTTP client (Ollama) |
| NumPy | Embedding similarity |
| uvicorn | ASGI server |

---

## 📁 Project Structure

```
sin-city/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── casino/     # Roulette, Cards, Slots
│   │   │   ├── districts/  # District cards & map
│   │   │   ├── layout/     # Navbar, Footer
│   │   │   ├── planner/    # Quiz, Streaming, Itinerary
│   │   │   └── ui/         # NeonText, GlowCard, etc.
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── backend/                # FastAPI backend
│   ├── agent/              # AI pipeline
│   │   ├── graph.py        # Agent orchestration
│   │   ├── nodes.py        # Processing nodes
│   │   ├── prompts.py      # LLM prompts
│   │   └── state.py        # State definition
│   ├── data/
│   │   └── activities.json # 45 curated activities
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── services/
│   │   ├── ollama_service.py
│   │   └── embeddings_service.py
│   └── main.py             # FastAPI entry
│
└── README.md
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--neon-pink` | `#FF006E` | Primary accent, CTAs |
| `--neon-cyan` | `#00F5FF` | Secondary accent, links |
| `--neon-gold` | `#FFD700` | Casino elements |
| `--neon-purple` | `#BF00FF` | Shows district |
| `--neon-green` | `#00FF88` | Street scene, success |
| `--bg-void` | `#030308` | Page background |
| `--font-display` | Bebas Neue | Headlines |
| `--font-body` | Rajdhani | Body text |
| `--font-mono` | Space Mono | Code, labels |

---

## 👥 Team

Built for **HackNite 2026** 🎲

---

## 📄 License

MIT — What happens in Sin City, stays in Sin City.
