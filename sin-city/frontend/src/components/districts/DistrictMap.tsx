import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const districts = [
  {
    name: 'THE CASINO FLOOR',
    icon: '♠',
    accentColor: '#FFD700',
    tagline: 'Bet it all. Win it back.',
    description: 'High-stakes tables, slot royalty, and the smell of money in the air.',
    path: '/districts/casino',
    featured: true, // spans full width in the first row
    badge: 'HIGH STAKES',
  },
  {
    name: 'NEON NIGHTLIFE',
    icon: '♥',
    accentColor: '#E60039',
    tagline: 'Flesh, fantasy, and the endless night.',
    description: 'Private companions, after-dark cabaret, and the kink vault.',
    path: '/districts/nightlife',
    featured: false,
    badge: '21+',
  },
  {
    name: 'THE SHOWS',
    icon: '★',
    accentColor: '#BF00FF',
    tagline: 'Spectacle beyond belief.',
    description: 'World-class performances, illusions, and headline entertainment.',
    path: '/districts/shows',
    featured: false,
    badge: 'LIVE',
  },
  {
    name: 'THE HIGH LIFE',
    icon: '🍄',
    accentColor: '#00F5FF',
    tagline: 'Alter your reality. Expand your mind.',
    description: 'Cloud 9 experiences, curated substances, and altered consciousness.',
    path: '/districts/cloud9',
    featured: false,
    badge: 'ELEVATED',
  },
  {
    name: 'STREET SCENE',
    icon: '⚡',
    accentColor: '#00FF88',
    tagline: 'Where the real city breathes.',
    description: 'Authentic local culture, underground bars, and the pulse of the street.',
    path: '/districts/street',
    featured: false,
    badge: 'LOCAL',
  },
]

export default function DistrictMap() {
  const navigate = useNavigate()

  const [featured, ...rest] = districts

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Featured District — full width */}
      <FeaturedCard district={featured} navigate={navigate} />

      {/* Grid of 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {rest.map((d, i) => (
          <SmallCard key={d.path} district={d} navigate={navigate} index={i + 1} />
        ))}
      </div>
    </div>
  )
}

// ─── Featured Card (row 1, full width) ────────────────────────────────────────
function FeaturedCard({
  district,
  navigate,
}: {
  district: typeof districts[0]
  navigate: ReturnType<typeof useNavigate>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.005 }}
      onClick={() => navigate(district.path)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        height: '260px',
        background: `linear-gradient(135deg, #0a0a14 0%, #12061a 100%)`,
        border: `1px solid ${district.accentColor}22`,
      }}
    >
      {/* Glow pulse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${district.accentColor}18 0%, transparent 70%)` }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ background: `linear-gradient(to bottom, ${district.accentColor}, ${district.accentColor}00)` }}
      />

      <div className="h-full flex items-center px-10 gap-12 relative z-10">
        {/* Huge icon */}
        <motion.div
          className="text-[120px] leading-none select-none flex-shrink-0"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 30px ${district.accentColor}88)` }}
        >
          {district.icon}
        </motion.div>

        {/* Text */}
        <div className="flex-1">
          {/* Badge */}
          <span
            className="inline-block font-mono text-[10px] tracking-[0.4em] uppercase px-3 py-1 rounded-full mb-4"
            style={{
              background: `${district.accentColor}18`,
              border: `1px solid ${district.accentColor}44`,
              color: district.accentColor,
            }}
          >
            {district.badge} · FEATURED
          </span>

          <h3
            className="font-display text-5xl lg:text-6xl leading-none mb-3"
            style={{
              color: district.accentColor,
              textShadow: `0 0 30px ${district.accentColor}44`,
            }}
          >
            {district.name}
          </h3>
          <p className="font-body text-lg text-white/60 mb-2">{district.tagline}</p>
          <p className="font-mono text-xs text-white/35 max-w-lg">{district.description}</p>

          {/* CTA */}
          <motion.div
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-widest"
            style={{ color: district.accentColor }}
            whileHover={{ x: 4 }}
          >
            ENTER THE DISTRICT
            <span className="text-lg transition-all duration-300 group-hover:translate-x-1">→</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(to right, ${district.accentColor}44, transparent, ${district.accentColor}22)` }}
      />
    </motion.div>
  )
}

// ─── Small Card (row 2, quarter-width each) ──────────────────────────────────
function SmallCard({
  district,
  navigate,
  index,
}: {
  district: typeof districts[0]
  navigate: ReturnType<typeof useNavigate>
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={() => navigate(district.path)}
      className="group relative cursor-pointer rounded-xl overflow-hidden flex flex-col justify-between"
      style={{
        height: '220px',
        background: 'linear-gradient(145deg, #080816 0%, #0f0620 100%)',
        border: `1px solid ${district.accentColor}1a`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${district.accentColor}20 0%, transparent 70%)` }}
      />

      {/* Top bar accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, ${district.accentColor}, ${district.accentColor}00)` }}
      />

      <div className="relative z-10 p-5 flex flex-col h-full">
        {/* Badge */}
        <span
          className="self-start font-mono text-[9px] tracking-[0.35em] uppercase px-2 py-0.5 rounded-full mb-4"
          style={{
            background: `${district.accentColor}12`,
            border: `1px solid ${district.accentColor}33`,
            color: district.accentColor,
          }}
        >
          {district.badge}
        </span>

        {/* Icon */}
        <div
          className="text-5xl mb-3 leading-none select-none"
          style={{ filter: `drop-shadow(0 0 12px ${district.accentColor}66)` }}
        >
          {district.icon}
        </div>

        {/* Name */}
        <h3
          className="font-display text-xl leading-tight mb-1"
          style={{ color: district.accentColor }}
        >
          {district.name}
        </h3>

        {/* Tagline */}
        <p className="font-mono text-[11px] text-white/40 leading-relaxed flex-1">
          {district.tagline}
        </p>

        {/* Enter */}
        <div
          className="mt-3 flex items-center gap-1 font-body text-[11px] font-semibold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: district.accentColor }}
        >
          ENTER <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
        </div>
      </div>
    </motion.div>
  )
}
