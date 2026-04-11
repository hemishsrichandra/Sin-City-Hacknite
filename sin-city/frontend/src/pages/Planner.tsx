import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InterestQuiz from '../components/planner/InterestQuiz'
import StreamingResponse from '../components/planner/StreamingResponse'
import ItineraryCard from '../components/planner/ItineraryCard'
import { useStreamingAgent } from '../hooks/useStreamingAgent'
import { PlannerFormData } from '../types'

type Stage = 'quiz' | 'streaming' | 'result'

// Fallback itinerary if backend is unavailable
const FALLBACK_ITINERARY = `🎬 DAY 1: THE GRAND ARRIVAL

💀 VIBE CHECK: The city smells like opportunity and expensive mistakes. Your Consigliere has mapped every move.

7:00 PM — Check into The Bellagio 🎰
📍 District: Casino Floor
💰 The Damage: $350
⚡⚡
Drop your bags in a suite that overlooks the fountains. The city is already calling your name through the glass. The concierge knows your name before you speak it — that's how we do business.

8:30 PM — High-Stakes Poker at The Bellagio Poker Room 🎰
📍 District: Casino Floor
💰 The Damage: $200
⚡⚡⚡
The felt is green. The stakes are real. The man across from you hasn't blinked in three hands. This is where fortunes change hands between sips of bourbon.

10:30 PM — Cocktails at The Chandelier Bar 🎲
📍 District: Street Scene
💰 The Damage: $60
⚡
Three levels of crystalline luxury. Order the verbena cocktail on level 1.5 — it changes flavor as you drink it. The bartender's been here since '98.

12:00 AM — VIP Table at Hakkasan Nightclub 🌙
📍 District: Neon Nightlife
💰 The Damage: $300
⚡⚡⚡⚡ 🔥
The bass hits different at 2 AM. The DJ knows it. The smoke machines paint the air silver and gold. This is where the night truly begins.

🔚 Tonight was just the appetiser. The main course arrives tomorrow.

🎬 DAY 2: DOUBLE DOWN

💀 VIBE CHECK: You didn't come to Vegas to play it safe. The Consigliere has arranged everything.

7:30 PM — Dinner at Hell's Kitchen 🎲
📍 District: Street Scene
💰 The Damage: $180
⚡⚡
Gordon Ramsay's Vegas outpost. The beef Wellington is non-negotiable. The sommelier will choose your wine — trust him.

9:30 PM — Cirque du Noir 🎭
📍 District: The Strip Shows
💰 The Damage: $150
⚡⚡⚡
Gravity-defying acrobatics in total darkness, lit only by neon laser lines. The performers move like they've made a deal with physics itself.

11:30 PM — Roulette at The Wynn 🎰
📍 District: Casino Floor
💰 The Damage: $100
⚡⚡⚡⚡ 🔥
Put it all on black. Or don't. The wheel doesn't care about your strategy. But the adrenaline? That's free.

1:00 AM — Late Night Taco Crawl 🎲
📍 District: Street Scene
💰 The Damage: $25
⚡
Follow the locals to the hidden trucks that only appear after midnight. This is where the real flavor lives.

🔚 The house always wins. But tonight, you ARE the house.

🎬 DAY 3: THE LAST HURRAH

💀 VIBE CHECK: Last day. Make every second count. No regrets. No mercy.

7:00 PM — Hidden Speakeasy Tour 🎲
📍 District: Street Scene
💰 The Damage: $75
⚡⚡⚡
Three bars. Three passwords. Zero regrets. The kind of places that don't show up on Google Maps.

9:30 PM — Cloud 9 Experience ☁️
📍 District: Cloud 9
💰 The Damage: $100
⚡⚡⚡⚡⚡ 🔥
Transcend reality in a haze of premium vapor and immersive light tunnels. This is where the boundaries dissolve.

11:00 PM — One Final Hand at The Cosmopolitan 🎰
📍 District: Casino Floor
💰 The Damage: $150
⚡⚡⚡
The last deal of the trip. The cards are warm. The dealer gives you a nod. Make. It. Count.

🔚 What happens in Sin City... the Consigliere already made sure nobody remembers.`

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
