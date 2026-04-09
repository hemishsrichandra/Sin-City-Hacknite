import DistrictCard from './DistrictCard'
import { District } from '../../types'

const districts: District[] = [
  { name: 'THE CASINO FLOOR', icon: '♠', accentColor: '#FFD700', tagline: 'Bet it all. Win it back.', path: '/districts/casino' },
  { name: 'NEON NIGHTLIFE', icon: '♥', accentColor: '#E60039', tagline: 'Flesh, fantasy, and the endless night.', path: '/districts/nightlife' },
  { name: 'THE STRIP SHOWS', icon: '★', accentColor: '#BF00FF', tagline: 'Spectacle beyond belief.', path: '/districts/shows' },
  { name: 'THE HIGH LIFE', icon: '🍄', accentColor: '#BF00FF', tagline: 'Alter your reality. Expand your mind.', path: '/districts/cloud9' },
  { name: 'STREET SCENE', icon: '⚡', accentColor: '#00FF88', tagline: 'Where the real city breathes.', path: '/districts/street' },
]

export default function DistrictMap() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {districts.map((d, i) => (
        <DistrictCard key={d.path} {...d} index={i} />
      ))}
    </div>
  )
}
