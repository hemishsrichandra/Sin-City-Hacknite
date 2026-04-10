import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../store/userStore'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const login = useUserStore((s) => s.login)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      setError('Enter a name, high roller.')
      return
    }
    if (trimmed.length < 2) {
      setError('Too short. Give us at least 2 characters.')
      return
    }
    login(trimmed)
    setShowWelcome(true)
    setTimeout(() => {
      setShowWelcome(false)
      onClose()
      setUsername('')
    }, 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0a0a14 0%, #12061a 50%, #0a0a14 100%)',
              border: '1px solid rgba(255,215,0,0.15)',
              boxShadow: '0 0 60px rgba(230,0,57,0.15), 0 0 120px rgba(191,0,255,0.08)',
            }}
          >
            {/* Header glow */}
            <div
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center top, rgba(255,215,0,0.1) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 p-8">
              {showWelcome ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                  >
                    🎰
                  </motion.div>
                  <h2
                    className="font-display text-4xl mb-2"
                    style={{
                      color: '#FFD700',
                      textShadow: '0 0 15px #FFD700, 0 0 40px #FFD70066',
                    }}
                  >
                    WELCOME!
                  </h2>
                  <p className="font-body text-lg text-[var(--text-secondary)]">
                    You've been credited
                  </p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full"
                    style={{
                      background: 'rgba(255,215,0,0.1)',
                      border: '1px solid rgba(255,215,0,0.3)',
                    }}
                  >
                    <span className="text-2xl">🪙</span>
                    <span className="font-display text-3xl neon-gold">1,000</span>
                  </motion.div>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-4">
                    Hit the casino floor. Make it count.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Title */}
                  <div className="text-center mb-8">
                    <motion.h2
                      className="font-display text-5xl mb-2"
                      style={{
                        color: '#E60039',
                        textShadow: '0 0 10px #E60039, 0 0 40px #E6003966',
                      }}
                      animate={{ opacity: [1, 0.85, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      CHECK IN
                    </motion.h2>
                    <p className="font-mono text-xs text-[var(--text-secondary)]">
                      What happens in Sin City, stays in Sin City.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-mono text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                        Your Alias
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          setError('')
                        }}
                        placeholder="Enter your name..."
                        maxLength={20}
                        className="w-full px-4 py-3 rounded-lg font-body text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FFD70066'
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.1)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                        autoFocus
                      />
                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-2 font-mono text-xs text-neon-crimson"
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px #FFD70044' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-lg font-display text-xl tracking-widest transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        border: 'none',
                      }}
                    >
                      ENTER SIN CITY
                    </motion.button>
                  </form>

                  {/* Chips display */}
                  <div className="mt-6 text-center">
                    <p className="font-mono text-[10px] text-[var(--text-muted)]">
                      🪙 New players receive 1,000 Sin Coins
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Close button */}
            {!showWelcome && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                ✕
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
