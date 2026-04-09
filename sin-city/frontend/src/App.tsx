import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Districts from './pages/Districts'
import CasinoDistrict from './pages/CasinoDistrict'
import NightlifeDistrict from './pages/NightlifeDistrict'
import ShowsDistrict from './pages/ShowsDistrict'
import StreetScene from './pages/StreetScene'
import Planner from './pages/Planner'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-void text-[var(--text-primary)]">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/districts" element={<Districts />} />
          <Route path="/districts/casino" element={<CasinoDistrict />} />
          <Route path="/districts/nightlife" element={<NightlifeDistrict />} />
          <Route path="/districts/shows" element={<ShowsDistrict />} />
          <Route path="/districts/street" element={<StreetScene />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App
