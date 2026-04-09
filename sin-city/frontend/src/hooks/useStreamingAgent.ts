import { useState, useCallback, useRef } from 'react'
import { PlannerFormData } from '../types'
import { API_URL } from '../utils/api'

export function useStreamingAgent() {
  const [output, setOutput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const runAgent = useCallback(async (formData: PlannerFormData) => {
    setOutput('')
    setIsStreaming(true)
    setIsDone(false)
    abortRef.current = new AbortController()

    try {
      const res = await fetch(`${API_URL}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: abortRef.current.signal,
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.replace('data: ', '').trim()
          if (data === '[DONE]') {
            setIsDone(true)
            break
          }
          try {
            const parsed = JSON.parse(data)
            setOutput(prev => prev + parsed.text)
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') console.error(e)
    } finally {
      setIsStreaming(false)
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return { output, isStreaming, isDone, runAgent, cancel }
}
