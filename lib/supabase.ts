import { createClient } from '@supabase/supabase-js'
import { MoodEntry } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── helpers ────────────────────────────────────────────────────────────────

/** Return today's date as YYYY-MM-DD in local time */
export function todayISO(): string {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export async function getTodayEntry(): Promise<MoodEntry | null> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('date', todayISO())
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertEntry(
  mood: MoodEntry['mood'],
  note: string | null
): Promise<MoodEntry> {
  const { data, error } = await supabase
    .from('mood_entries')
    .upsert({ date: todayISO(), mood, note }, { onConflict: 'date' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRecentEntries(limit = 60): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
