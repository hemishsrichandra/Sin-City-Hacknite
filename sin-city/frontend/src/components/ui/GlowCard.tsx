import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  accentColor: string
  className?: string
  onClick?: () => void
}

export default function GlowCard({ children, accentColor, className = '', onClick }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl cursor-pointer ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${accentColor}20`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accentColor}80`
        el.style.boxShadow = `0 0 20px ${accentColor}33, 0 0 40px ${accentColor}11`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accentColor}20`
        el.style.boxShadow = 'none'
      }}
    >
      {/* Radial gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top left, ${accentColor}08, transparent 60%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
