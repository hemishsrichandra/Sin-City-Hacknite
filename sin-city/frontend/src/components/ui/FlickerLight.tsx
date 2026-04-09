import { motion } from 'framer-motion'

interface FlickerLightProps {
  color: string
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  size?: number
}

const intensityMap = {
  low: [0.05, 0.1, 0.05],
  medium: [0.1, 0.2, 0.1],
  high: [0.15, 0.35, 0.15],
}

export default function FlickerLight({ color, intensity = 'medium', className = '', size = 200 }: FlickerLightProps) {
  const opacityValues = intensityMap[intensity]

  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}66 0%, ${color}22 40%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        opacity: opacityValues,
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    />
  )
}
