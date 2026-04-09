import DistrictCard from './DistrictCard'
import { District } from '../../types'

const districts: District[] = [
  { name: 'THE CASINO FLOOR', icon: '♠', accentColor: '#FFD700', tagline: 'Bet it all. Win it back.', path: '/districts/casino' },
  { name: 'NEON NIGHTLIFE', icon: '♫', accentColor: '#FF006E', tagline: 'The night never ends.', path: '/districts/nightlife' },
  { name: 'THE STRIP SHOWS', icon: '★', accentColor: '#BF00FF', tagline: 'Spectacle beyond belief.', path: '/districts/shows' },
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
