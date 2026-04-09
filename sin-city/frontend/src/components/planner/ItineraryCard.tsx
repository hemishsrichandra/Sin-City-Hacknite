import { motion } from 'framer-motion'

interface ItineraryCardProps {
  output: string
  formData: {
    vices: string[]
    days: number
    budget_per_night: number
  }
  onRegenerate: () => void
}

export default function ItineraryCard({ output, formData, onRegenerate }: ItineraryCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    alert('Itinerary copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  // Parse output into sections
  const sections = output.split(/(?=DAY \d)/g).filter(Boolean)

  const accentColors = ['#FF006E', '#00F5FF', '#FFD700', '#BF00FF', '#00FF88', '#FF6B00', '#FF006E']

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-5xl md:text-7xl neon-gold mb-3">YOUR SIN CITY PLAYBOOK</h2>
        <p className="font-mono text-xs text-[var(--text-secondary)]">
          Generated for: {formData.vices.join(', ')} · {formData.days} days · ${formData.budget_per_night}/night
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {sections.map((section, i) => {
          const color = accentColors[i % accentColors.length]
          const lines = section.trim().split('\n')
          const title = lines[0] || ''
          const content = lines.slice(1)

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-8 pb-10 border-l-2"
              style={{ borderColor: `${color}44` }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[-7px] top-1 w-3 h-3 rounded-full border-2"
                style={{ borderColor: color, backgroundColor: 'var(--bg-void)' }}
              />

              {/* Day title */}
              <h3
                className="font-display text-2xl md:text-3xl mb-4"
                style={{ color }}
              >
                {title}
              </h3>

              {/* Activities */}
              <div className="space-y-3">
                {content.map((line, j) => {
                  const trimmed = line.trim()
                  if (!trimmed) return null

                  // Detect time-based lines
                  const timeMatch = trimmed.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[—–-]\s*(.+)/i)

                  if (timeMatch) {
                    return (
                      <div key={j} className="flex gap-3 items-start">
                        <span
                          className="font-mono text-[10px] px-2 py-0.5 rounded mt-1 whitespace-nowrap"
                          style={{ background: `${color}22`, color }}
                        >
                          {timeMatch[1]}
                        </span>
                        <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                          {timeMatch[2]}
                        </p>
                      </div>
                    )
                  }

                  return (
                    <p key={j} className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 no-print">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className="px-8 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
        >
          📋 Copy to Clipboard
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePrint}
          className="px-8 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider border border-neon-gold/40 text-neon-gold hover:bg-neon-gold/10 transition-colors"
        >
          🖨️ Download PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRegenerate}
          className="px-8 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider bg-neon-pink text-black"
        >
          ↻ Regenerate
        </motion.button>
      </div>
    </div>
  )
}
