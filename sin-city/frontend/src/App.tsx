import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { getUserDoc } from './lib/db'
import {
  useUserStore,
  startUserDocListener,
  stopUserDocListener,
} from './store/userStore'
import { AudioProvider } from './context/AudioContext'
import FirebaseAuthGate from './components/ui/FirebaseAuthGate'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Districts from './pages/Districts'
import CasinoDistrict from './pages/CasinoDistrict'
import NightlifeDistrict from './pages/NightlifeDistrict'
import ShowsDistrict from './pages/ShowsDistrict'
import StreetScene from './pages/StreetScene'
import Cloud9District from './pages/Cloud9District'
import Planner from './pages/Planner'
import MyBookings from './pages/MyBookings'

// ── Full-screen loading spinner shown while Firebase resolves auth state ──────
function AuthLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[300]"
      style={{ background: '#050208' }}
    >
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="font-display text-4xl"
        style={{
          color: '#E60039',
          textShadow: '0 0 12px #E60039, 0 0 40px #E6003966',
        }}
      >
        SIN CITY
      </motion.div>
      <p
        className="font-mono text-[10px] tracking-[0.4em] uppercase mt-3"
        style={{ color: 'rgba(255,255,255,0.25)' }}
      >
        Verifying credentials…
      </p>
      {/* Spinning ring */}
      <div
        className="mt-8 w-8 h-8 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#E60039', borderRightColor: 'rgba(230,0,57,0.3)' }}
      />
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const location     = useLocation()
  const { authLoading, firebaseUser, setFirebaseUser, setAuthLoading, setUserData } = useUserStore()

  // Wire Firebase auth state → Zustand store
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user)
        // Fetch (or create) Firestore document and start real-time listener
        try {
          const data = await getUserDoc(user.uid)
          setUserData(data)
          startUserDocListener(user.uid)
        } catch (err) {
          console.error('[App] Firestore fetch error:', err)
        }
      } else {
        setFirebaseUser(null)
        stopUserDocListener()
        useUserStore.getState().logout()
      }
      setAuthLoading(false)
    })

    return () => {
      unsubscribe()
      stopUserDocListener()
    }
  }, [setFirebaseUser, setAuthLoading, setUserData])

  // ── Loading  ────────────────────────────────────────────────────────────────
  if (authLoading) return <AuthLoadingScreen />

  // ── Unauthenticated ─────────────────────────────────────────────────────────
  if (!firebaseUser) return <FirebaseAuthGate />

  // ── Authenticated ───────────────────────────────────────────────────────────
  return (
    <AudioProvider>
      <div className="min-h-screen bg-bg-void text-[var(--text-primary)]">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"                    element={<Home />} />
            <Route path="/districts"           element={<Districts />} />
            <Route path="/districts/casino"    element={<CasinoDistrict />} />
            <Route path="/districts/nightlife" element={<NightlifeDistrict />} />
            <Route path="/districts/shows"     element={<ShowsDistrict />} />
            <Route path="/districts/cloud9"    element={<Cloud9District />} />
            <Route path="/districts/street"    element={<StreetScene />} />
            <Route path="/planner"             element={<Planner />} />
            <Route path="/my-bookings"         element={<MyBookings />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </AudioProvider>
  )
}

export default App
