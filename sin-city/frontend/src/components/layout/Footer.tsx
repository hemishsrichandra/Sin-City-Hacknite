import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-neon-pink/10 bg-bg-void no-print">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-[var(--text-muted)]">
          SIN CITY © 2025
        </span>
        <div className="flex items-center gap-6">
          <Link to="/" className="font-mono text-[11px] text-[var(--text-muted)] hover:text-neon-cyan transition-colors">
            Home
          </Link>
          <Link to="/districts" className="font-mono text-[11px] text-[var(--text-muted)] hover:text-neon-cyan transition-colors">
            Districts
          </Link>
          <Link to="/planner" className="font-mono text-[11px] text-[var(--text-muted)] hover:text-neon-cyan transition-colors">
            Planner
          </Link>
        </div>
        <span className="font-mono text-[11px] text-[var(--text-muted)]">
          Built for HackNite 2025
        </span>
      </div>
    </footer>
  )
}
