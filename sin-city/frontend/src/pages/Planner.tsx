import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InterestQuiz from '../components/planner/InterestQuiz'
import StreamingResponse from '../components/planner/StreamingResponse'
import ItineraryCard from '../components/planner/ItineraryCard'
import { useStreamingAgent } from '../hooks/useStreamingAgent'
import { PlannerFormData } from '../types'

type Stage = 'quiz' | 'streaming' | 'result'

// Fallback itinerary if backend is unavailable
const FALLBACK_ITINERARY = `DAY 1: THE GRAND ARRIVAL

7:00 PM — Check into The Bellagio
[District: Casino Floor] [Estimated cost: $350]
Drop your bags in a suite that overlooks the fountains. The city is already calling your name through the glass.

8:30 PM — High-Stakes Poker at The Bellagio Poker Room
[District: Casino Floor] [Estimated cost: $200]
The most iconic poker room in Las Vegas. The felt is green, the stakes are real.

10:30 PM — Cocktails at The Chandelier Bar
[District: Casino Floor] [Estimated cost: $60]
Three levels of crystalline luxury. Order the verbena cocktail on level 1.5 — it changes flavor as you drink it.

12:00 AM — VIP Table at Hakkasan Nightclub
[District: Neon Nightlife] [Estimated cost: $300]
The bass hits different at 2 AM. The DJ knows it. You'll know it too.

Tonight was just the appetiser.

DAY 2: DOUBLE DOWN

7:30 PM — Dinner at Hell's Kitchen
[District: The Strip] [Estimated cost: $180]
Gordon Ramsay's Vegas outpost. The beef Wellington is non-negotiable.

9:30 PM — Cirque du Soleil — O
[District: The Strip Shows] [Estimated cost: $150]
Water, acrobatics, and a dream sequence you won't forget. This is peak Vegas spectacle.

11:30 PM — Roulette at The Wynn
[District: Casino Floor] [Estimated cost: $100]
Put it all on black. Or don't. The wheel doesn't care about your strategy.

1:00 AM — Late Night Taco Crawl
[District: Street Scene] [Estimated cost: $25]
Follow the locals to the hidden trucks that only appear after midnight. This is where the real flavour lives.

The house always wins. But tonight, you're the house.

DAY 3: THE LAST HURRAH

4:00 PM — Pool Party at Encore Beach Club
[District: Neon Nightlife] [Estimated cost: $80]
Sun, bass, and champagne. The perfect afternoon before the final night.

7:00 PM — Hidden Speakeasy Tour
[District: Street Scene] [Estimated cost: $75]
Three bars. Three passwords. Zero regrets.

9:30 PM — The Apothecary (Restricted Zone)
[District: Cloud 9] [Estimated cost: $100]
Drop a synthetic tab. Let complete ego dissolution take over as you transcend reality into neon euphoria.

11:00 PM — One Final Hand at The Cosmopolitan
[District: Casino Floor] [Estimated cost: $150]
The last deal of the trip. Make it count.

What happens in Sin City... you already know the rest.`

export default function Planner() {
  const [stage, setStage] = useState<Stage>('quiz')
  const [formData, setFormData] = useState<PlannerFormData | null>(null)
  const { output, isStreaming, isDone, runAgent, cancel } = useStreamingAgent()

  const handleQuizSubmit = async (data: PlannerFormData) => {
    setFormData(data)
    setStage('streaming')

    try {
      await runAgent(data)
    } catch {
      // If backend is unavailable, use fallback
    }
  }

  // When streaming finishes, move to result
  const effectiveOutput = (isDone || (!isStreaming && output.length > 0)) ? output : ''

  // Use fallback if no output after streaming ends
  const displayOutput = effectiveOutput || (stage === 'streaming' && !isStreaming ? FALLBACK_ITINERARY : '')

  if (stage === 'streaming' && !isStreaming && (output.length > 0 || displayOutput)) {
    // Auto-transition to result
    setTimeout(() => setStage('result'), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20"
    >
      <AnimatePresence mode="wait">
        {stage === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InterestQuiz
              onSubmit={handleQuizSubmit}
              initialData={formData || undefined}
            />
          </motion.div>
        )}

        {stage === 'streaming' && (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StreamingResponse
              output={output || (isStreaming ? '' : FALLBACK_ITINERARY)}
              isStreaming={isStreaming}
              onCancel={() => {
                cancel()
                setStage('quiz')
              }}
            />
          </motion.div>
        )}

        {stage === 'result' && formData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ItineraryCard
              output={output || FALLBACK_ITINERARY}
              formData={formData}
              onRegenerate={() => setStage('quiz')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
