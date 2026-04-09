import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-pink':   '#FF006E',
        'neon-cyan':   '#00F5FF',
        'neon-gold':   '#FFD700',
        'neon-purple': '#BF00FF',
        'neon-green':  '#00FF88',
        'neon-orange': '#FF6B00',
        'bg-void':     '#030308',
        'bg-deep':     '#08080F',
        'bg-surface':  '#0D0D1A',
        'bg-card':     '#12121F',
        'bg-card-hover': '#181828',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body:    ['"Rajdhani"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      animation: {
        flicker:      'flicker 3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        marquee:      'marquee 20s linear infinite',
        scanline:     'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px #00F5FF, 0 0 30px #00F5FF66, 0 0 60px #00F5FF33' },
          '50%':      { boxShadow: '0 0 20px #00F5FF, 0 0 60px #00F5FF88, 0 0 120px #00F5FF44' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
