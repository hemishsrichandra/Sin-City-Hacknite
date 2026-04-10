import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import SoundToggle from '../ui/SoundToggle'
import AuthModal from '../ui/AuthModal'
import { useUserStore } from '../../store/userStore'

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'DISTRICTS', path: '/districts' },
  { label: 'PLANNER', path: '/planner' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, coins, logout } = useUserStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-md bg-bg-void/90' : 'bg-bg-void'
        } border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span
              className="font-display text-[28px] leading-none neon-pink animate-flicker"
            >
              SIN CITY
            </span>
            <span className="font-mono text-[9px] tracking-[0.4em] text-[var(--text-muted)] uppercase">
              What happens here, stays here
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative font-body font-semibold text-[13px] uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-neon-cyan transition-colors duration-300 py-1 group"
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-neon-cyan transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full shadow-[0_0_8px_#00F5FF]' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Coin balance */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                }}
              >
                <span className="text-sm">🪙</span>
                <motion.span
                  key={coins}
                  initial={{ scale: 1.3, color: '#FFD700' }}
                  animate={{ scale: 1, color: '#FFD700' }}
                  className="font-display text-sm"
                  style={{ color: '#FFD700', textShadow: '0 0 8px #FFD70066' }}
                >
                  {coins.toLocaleString()}
                </motion.span>
              </motion.div>
            )}

            <SoundToggle />

            {/* Auth button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="font-body text-sm text-[var(--text-secondary)]">
                  {user.avatar} {user.username}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-neon-crimson hover:bg-neon-crimson/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAuthOpen(true)}
                className="hidden md:block px-5 py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider text-neon-gold border border-neon-gold/60 bg-transparent hover:bg-neon-gold hover:text-black transition-all duration-300"
              >
                Check In
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/planner')}
              className="hidden md:block px-5 py-2 rounded-lg font-body font-semibold text-xs uppercase tracking-wider text-neon-pink border border-neon-pink/60 bg-transparent hover:bg-neon-pink hover:text-black transition-all duration-300"
            >
              Plan My Trip
            </motion.button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[var(--text-primary)] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-16 right-0 w-64 h-[calc(100vh-64px)] bg-bg-deep border-l border-white/5 z-50 p-6 flex flex-col gap-6 md:hidden"
            >
              {/* Mobile coin balance */}
              {user && (
                <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                  <span className="text-lg">{user.avatar}</span>
                  <div>
                    <p className="font-body text-sm text-[var(--text-primary)]">{user.username}</p>
                    <p className="font-display text-sm" style={{ color: '#FFD700' }}>🪙 {coins.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body font-semibold text-lg uppercase tracking-wider ${
                    location.pathname === link.path ? 'text-neon-cyan' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={logout}
                  className="mt-2 px-5 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider text-neon-crimson border border-neon-crimson/40 hover:bg-neon-crimson/10 transition-all"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false) }}
                  className="mt-2 px-5 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider text-black bg-neon-gold"
                >
                  Check In
                </button>
              )}

              <button
                onClick={() => navigate('/planner')}
                className="px-5 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider text-black bg-neon-pink"
              >
                Plan My Trip
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
