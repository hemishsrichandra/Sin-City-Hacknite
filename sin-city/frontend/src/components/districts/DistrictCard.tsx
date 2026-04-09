import { motion } from 'framer-motion'
import GlowCard from '../ui/GlowCard'
import { useNavigate } from 'react-router-dom'

interface DistrictCardProps {
  name: string
  icon: string
  accentColor: string
  tagline: string
  path: string
  index: number
}

export default function DistrictCard({ name, icon, accentColor, tagline, path, index }: DistrictCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlowCard accentColor={accentColor} onClick={() => navigate(path)} className="p-8">
        <div className="text-center">
          <span className="text-[56px] block mb-4">{icon}</span>
          <h3
            className="font-display text-4xl mb-2"
            style={{ color: accentColor }}
          >
            {name}
          </h3>
          <p className="font-body text-sm text-[var(--text-secondary)] mb-4">
            {tagline}
          </p>
          <span
            className="font-body font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
            style={{ color: accentColor }}
          >
            ENTER <span>→</span>
          </span>
        </div>
      </GlowCard>
    </motion.div>
  )
}
