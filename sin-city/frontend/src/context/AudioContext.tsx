// ─── Singleton Audio Manager ─────────────────────────────────────────────────
// A module-level singleton HTMLAudioElement is created exactly ONCE per browser
// session, regardless of route changes or component re-mounts.
//
// Why module-level (not inside a hook or component)?
//   • React components can unmount/remount (e.g. StrictMode, route transitions)
//   • Putting the audio object in module scope means it is never garbage-collected
//   • The React context only exposes control handles — no audio object ownership

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

// ── Module-level singleton ─────────────────────────────────────────────────────
let _audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio('/sounds/lounge.mp3')
    _audio.loop   = true
    _audio.volume = 0.18
    _audio.preload = 'auto'
  }
  return _audio
}

// ── Context shape ─────────────────────────────────────────────────────────────
interface AudioContextValue {
  isPlaying:  boolean
  isBlocked:  boolean   // true when browser blocked autoplay
  volume:     number
  toggle:     () => void
  setVolume:  (v: number) => void
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying:  false,
  isBlocked:  false,
  volume:     0.18,
  toggle:     () => {},
  setVolume:  () => {},
})

// ── Provider ──────────────────────────────────────────────────────────────────
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [volume, setVolumeState]  = useState(0.18)

  // Persist isPlaying preference across refreshes
  const storageKey = 'sin-city-audio-playing'
  const initialPlayIntent = useRef(
    localStorage.getItem(storageKey) === 'true'
  )

  // Attempt to restore playback after mount (respects user's last preference)
  useEffect(() => {
    const audio = getAudio()

    if (initialPlayIntent.current) {
      audio.play().then(() => {
        setIsPlaying(true)
        setIsBlocked(false)
      }).catch(() => {
        // Browser blocked autoplay — wait for user gesture
        setIsBlocked(true)
        setIsPlaying(false)
      })
    }

    // Sync state if audio stops unexpectedly (e.g. network glitch)
    const onPause = () => setIsPlaying(false)
    const onPlay  = () => setIsPlaying(true)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play',  onPlay)
    return () => {
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play',  onPlay)
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = getAudio()
    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true)
        setIsBlocked(false)
        localStorage.setItem(storageKey, 'true')
      }).catch((err) => {
        console.warn('[AudioProvider] play() blocked:', err.message)
        setIsBlocked(true)
      })
    } else {
      // Smooth fade-out then pause
      const fadeOut = () => {
        if (audio.volume > 0.02) {
          audio.volume = Math.max(0, audio.volume - 0.03)
          requestAnimationFrame(fadeOut)
        } else {
          audio.pause()
          audio.volume = volume   // restore for next play
          setIsPlaying(false)
          localStorage.setItem(storageKey, 'false')
        }
      }
      requestAnimationFrame(fadeOut)
    }
  }, [volume])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    getAudio().volume = clamped
    setVolumeState(clamped)
  }, [])

  return (
    <AudioCtx.Provider value={{ isPlaying, isBlocked, volume, toggle, setVolume }}>
      {children}
    </AudioCtx.Provider>
  )
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useAudio(): AudioContextValue {
  return useContext(AudioCtx)
}
