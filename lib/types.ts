export type MoodKey = 'happy' | 'neutral' | 'sad' | 'angry' | 'frustrated' | 'overwhelmed'

export interface MoodEntry {
  id: string
  date: string        // YYYY-MM-DD
  mood: MoodKey
  note: string | null
  created_at: string
}
