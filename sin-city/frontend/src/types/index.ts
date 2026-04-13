export interface PlannerFormData {
  vices: string[]
  budget_per_night: number
  days: number
  vibe: 'WILD' | 'SOPHISTICATED' | 'LAID_BACK' | 'MYSTERY'
  party_size: number
  persona?: string
  pace?: string
  exclusions?: string[]
}

export interface Activity {
  id: string
  name: string
  district: string
  tags: string[]
  cost_per_person: number
  duration_hours: number
  description: string
  vibe_match: string[]
  time_of_day: string
}

export interface ItineraryActivity {
  time: string
  name: string
  district: string
  cost: string
  description: string
  checked: boolean
}

export interface ItineraryDay {
  day: number
  title: string
  activities: ItineraryActivity[]
}

export type NeonColor = 'pink' | 'cyan' | 'gold' | 'purple' | 'green' | 'orange'

export interface District {
  name: string
  icon: string
  accentColor: string
  tagline: string
  path: string
}
