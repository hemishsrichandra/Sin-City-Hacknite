import { useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundStore } from '../../store/soundStore'
import { Howl } from 'howler'

export default function SoundToggle() {
  const { isPlaying, toggle } = useSoundStore()
  const soundRef = useRef<Howl | null>(null)

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/lounge.mp3'],
      loop: true,
      volume: 0,
      html5: true,
    })

    return () => {
      soundRef.current?.unload()
    }
  }, [])

  useEffect(() => {
    if (!soundRef.current) return
    
    if (isPlaying) {
      soundRef.current.play()
      soundRef.current.fade(0, 0.25, 1000)
    } else {
      soundRef.current.fade(soundRef.current.volume(), 0, 500)
      setTimeout(() => {
        soundRef.current?.pause()
      }, 500)
    }
  }, [isPlaying])

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5"
      aria-label={isPlaying ? 'Mute sound' : 'Enable sound'}
      title={isPlaying ? 'Mute ambient music' : 'Play ambient music'}
    >
      {isPlaying ? (
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
        <VolumeX size={16} className="text-gray-500" />
      )}
    </button>
  )
}
