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

  // Parse output into day sections
  const sections = output.split(/(?=(?:🎬\s*)?DAY \d)/gi).filter(s => s.trim().length > 0)

  const accentColors = ['#FF006E', '#00F5FF', '#FFD700', '#BF00FF', '#00FF88', '#FF6B00', '#FF006E']

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="font-mono text-xs tracking-[0.5em] text-neon-crimson uppercase mb-4"
        >
          ─── The Consigliere Has Spoken ───
        </motion.div>
        <h2 className="font-display text-5xl md:text-7xl mb-3" style={{
          color: '#FFD700',
          textShadow: '0 0 15px #FFD70066, 0 0 40px #FFD70033',
        }}>
          YOUR PLAYBOOK
        </h2>
        <p className="font-mono text-xs text-[var(--text-secondary)]">
          {formData.vices.join(' · ')} · {formData.days} days · ${formData.budget_per_night}/night
        </p>
      </motion.div>

      {/* Day Cards */}
      <div className="space-y-8">
        {sections.map((section, i) => {
          const color = accentColors[i % accentColors.length]
          const lines = section.trim().split('\n')

          // Extract title (first non-empty line)
          const titleLine = lines.find(l => l.trim().length > 0) || ''
          const contentLines = lines.slice(lines.indexOf(titleLine) + 1)

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: `1px solid ${color}22`,
                boxShadow: `0 0 40px ${color}08`,
              }}
            >
              {/* Day Header */}
              <div
                className="px-8 py-5 flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
                  borderBottom: `1px solid ${color}22`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}44` }}
                >
                  {i + 1}
                </div>
                <h3 className="font-display text-2xl md:text-3xl" style={{ color }}>
                  {titleLine.replace(/^🎬\s*/, '')}
                </h3>
              </div>

              {/* Day Content */}
              <div className="px-8 py-6 space-y-3">
                {contentLines.map((line, j) => {
                  const trimmed = line.trim()
                  if (!trimmed) return <div key={j} className="h-2" />

                  // Divider
                  if (trimmed === '---') return <div key={j} className="h-[1px] bg-white/5 my-4" />

                  // Vibe check line
                  if (trimmed.startsWith('💀')) {
                    return (
                      <div key={j} className="px-4 py-3 rounded-lg mb-2" style={{ background: 'rgba(230,0,57,0.06)', border: '1px solid rgba(230,0,57,0.15)' }}>
                        <p className="font-body text-sm text-neon-crimson italic">{trimmed}</p>
                      </div>
                    )
                  }

                  // Danger level line
                  if (trimmed.startsWith('⚡')) {
                    const bolts = (trimmed.match(/⚡/g) || []).length
                    return (
                      <div key={j} className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Danger:</span>
                        <span className="text-sm">{Array(bolts).fill('⚡').join('')}</span>
                      </div>
                    )
                  }

                  // Time-activity lines
                  const timeMatch = trimmed.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[—–-]\s*(.+)/i)
                  if (timeMatch) {
                    return (
                      <div key={j} className="flex gap-3 items-start mt-4 mb-1">
                        <span
                          className="font-mono text-[10px] px-2 py-1 rounded mt-0.5 whitespace-nowrap flex-shrink-0"
                          style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}
                        >
                          {timeMatch[1]}
                        </span>
                        <p className="font-display text-lg text-white">
                          {timeMatch[2]}
                        </p>
                      </div>
                    )
                  }

                  // District line
                  if (trimmed.startsWith('📍')) {
                    return (
                      <p key={j} className="font-mono text-xs text-[var(--text-muted)] ml-[4.5rem]">{trimmed}</p>
                    )
                  }

                  // Cost line
                  if (trimmed.startsWith('💰')) {
                    return (
                      <p key={j} className="font-mono text-xs text-neon-gold ml-[4.5rem]">{trimmed}</p>
                    )
                  }

                  // Closing line (starts with 🔚)
                  if (trimmed.startsWith('🔚')) {
                    return (
                      <div key={j} className="mt-6 pt-4 border-t border-white/5">
                        <p className="font-body text-sm text-[var(--text-secondary)] italic text-center">
                          {trimmed.replace('🔚', '').trim()}
                        </p>
                      </div>
                    )
                  }

                  // Regular text
                  return (
                    <p key={j} className="font-body text-sm text-[var(--text-secondary)] leading-relaxed ml-[4.5rem]">
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16 no-print">
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
          className="px-8 py-3 rounded-lg font-body font-semibold text-sm uppercase tracking-wider bg-neon-crimson text-white hover:shadow-[0_0_20px_rgba(230,0,57,0.3)]"
        >
          ↻ Regenerate
        </motion.button>
      </div>
    </div>
  )
}
