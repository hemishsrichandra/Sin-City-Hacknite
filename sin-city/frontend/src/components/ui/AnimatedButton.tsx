import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  variant: 'filled' | 'outlined'
  color: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function AnimatedButton({
  children,
  variant,
  color,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      className={`px-8 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider ${className}`}
      style={
        variant === 'filled'
          ? {
              background: color,
              color: '#000',
              border: `1px solid ${color}`,
              boxShadow: `0 0 15px ${color}44`,
            }
          : {
              background: 'transparent',
              color: color,
              border: `1px solid ${color}`,
            }
      }
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        if (variant === 'filled') {
          el.style.boxShadow = `0 0 25px ${color}66, 0 0 50px ${color}33`
        } else {
          el.style.background = color
          el.style.color = '#000'
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        if (variant === 'filled') {
          el.style.boxShadow = `0 0 15px ${color}44`
        } else {
          el.style.background = 'transparent'
          el.style.color = color
        }
      }}
    >
      {children}
    </motion.button>
  )
}
