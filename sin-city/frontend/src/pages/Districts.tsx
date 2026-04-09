import { motion } from 'framer-motion'
import DistrictMap from '../components/districts/DistrictMap'

export default function Districts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20"
    >
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl md:text-8xl text-[var(--text-primary)] mb-4"
          >
            THE DISTRICTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-[var(--text-secondary)]"
          >
            Succumb to the night. Give in to temptation.
          </motion.p>
        </div>
        <DistrictMap />
      </section>
    </motion.div>
  )
}
