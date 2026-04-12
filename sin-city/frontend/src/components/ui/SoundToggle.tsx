import { useAudio } from '../../context/AudioContext'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SoundToggle() {
  const { isPlaying, isBlocked, toggle } = useAudio()

  return (
    <div className="relative">
      <button
        id="sound-toggle-btn"
        onClick={toggle}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5"
        aria-label={isPlaying ? 'Mute ambient music' : 'Enable ambient music'}
        title={isPlaying ? 'Mute ambient music' : 'Play ambient music'}
      >
        {isBlocked ? (
          /* ── Autoplay blocked — show a soft nudge ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5"
          >
            <Music size={15} className="text-neon-gold" />
            <span className="font-mono text-[10px] text-neon-gold uppercase tracking-wider hidden sm:block">
              Click to play
            </span>
          </motion.div>
        ) : isPlaying ? (
          /* ── Playing — waveform bars ── */
          <>
            <Volume2 size={16} className="text-neon-cyan" />
            <div className="flex items-end gap-[2px] h-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-[2px] bg-neon-cyan rounded-full"
                  style={{
                    animation: `pulse-bar 0.6s ease-in-out ${i * 0.15}s infinite`,
                    height: '100%',
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          /* ── Paused ── */
          <VolumeX size={16} className="text-gray-500" />
        )}
      </button>

      {/* Tooltip when blocked */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 px-3 py-2 rounded-lg text-[10px] font-mono whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(10,4,20,0.95)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: 'rgba(255,215,0,0.8)',
              zIndex: 100,
            }}
          >
            🎵 Browser blocked autoplay. Click to enable music.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
