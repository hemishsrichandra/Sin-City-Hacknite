import { motion } from 'framer-motion'

interface NeonTextProps {
  children: React.ReactNode
  color: 'pink' | 'cyan' | 'gold' | 'purple' | 'green'
  flicker?: boolean
  size?: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}

const colorMap: Record<string, string> = {
  pink: 'neon-pink',
  cyan: 'neon-cyan',
  gold: 'neon-gold',
  purple: 'neon-purple',
  green: 'neon-green',
}

export default function NeonText({ children, color, flicker, size, className = '', as = 'span' }: NeonTextProps) {
  const Tag = as
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      <Tag
        className={`${colorMap[color]} ${flicker ? 'animate-flicker' : ''} ${className}`}
        style={{ fontSize: size }}
      >
        {children}
      </Tag>
    </motion.div>
  )
}
