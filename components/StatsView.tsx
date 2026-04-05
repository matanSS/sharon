'use client'

import { MoodEntry } from '@/lib/types'
import { getMood, MOODS } from '@/lib/moods'
import { MoodKey } from '@/lib/types'

interface Props {
  entries: MoodEntry[]
}

function getLastNDays(entries: MoodEntry[], n: number): MoodEntry[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - n)
  return entries.filter((e) => new Date(e.date) >= cutoff)
}

function dominantMood(entries: MoodEntry[]): MoodKey | null {
  if (!entries.length) return null
  const counts: Partial<Record<MoodKey, number>> = {}
  for (const e of entries) {
    counts[e.mood] = (counts[e.mood] ?? 0) + 1
  }
  return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0] as MoodKey
}

function streak(entries: MoodEntry[]): number {
  if (!entries.length) return 0
  // entries sorted descending by date
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  let s = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date)
    const curr = new Date(sorted[i].date)
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) s++
    else break
  }
  return s
}

function last7Days(entries: MoodEntry[]): (MoodEntry | null)[] {
  const result: (MoodEntry | null)[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
    result.push(entries.find((e) => e.date === iso) ?? null)
  }
  return result
}

function moodBarData(entries: MoodEntry[]): { mood: MoodKey; count: number; pct: number }[] {
  const counts: Partial<Record<MoodKey, number>> = {}
  for (const e of entries) {
    counts[e.mood] = (counts[e.mood] ?? 0) + 1
  }
  const total = entries.length || 1
  return MOODS.map((m) => ({
    mood: m.key,
    count: counts[m.key] ?? 0,
    pct: Math.round(((counts[m.key] ?? 0) / total) * 100),
  })).sort((a, b) => b.count - a.count)
}

export default function StatsView({ entries }: Props) {
  const week = getLastNDays(entries, 7)
  const month = getLastNDays(entries, 30)
  const weekDominant = dominantMood(week)
  const currentStreak = streak(entries)
  const weekDays = last7Days(entries)
  const monthBars = moodBarData(month)

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span className="text-6xl">📈</span>
        <p className="text-gray-500 text-lg">אין עדיין נתונים</p>
        <p className="text-gray-400 text-sm">תמשיכי לרשום כדי לראות סטטיסטיקות</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      {/* Top row: dominant mood + streak */}
      <div className="grid grid-cols-2 gap-4">
        {/* Dominant mood this week */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-gray-400">המצב השכיח השבוע</p>
          {weekDominant ? (
            <>
              <span className="text-5xl">{getMood(weekDominant).emoji}</span>
              <span className={`text-sm font-bold ${getMood(weekDominant).textClass}`}>
                {getMood(weekDominant).label}
              </span>
            </>
          ) : (
            <span className="text-4xl">❓</span>
          )}
        </div>

        {/* Streak */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-gray-400">רצף ימים</p>
          <span className="text-5xl">🔥</span>
          <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
          <span className="text-xs text-gray-400">
            {currentStreak === 1 ? 'יום' : 'ימים'}
          </span>
        </div>
      </div>

      {/* Last 7 days row */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-bold text-gray-400 mb-3">7 הימים האחרונים</p>
        <div className="flex justify-between items-end gap-1">
          {weekDays.map((entry, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            const dayName = d.toLocaleDateString('he-IL', { weekday: 'short' })
            const isToday = i === 6

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-2xl leading-none">
                  {entry ? getMood(entry.mood).emoji : '·'}
                </span>
                <span
                  className={`text-xs ${isToday ? 'font-bold text-coral-500' : 'text-gray-400'}`}
                >
                  {dayName}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Month mood distribution */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-bold text-gray-400 mb-4">החודש האחרון</p>
        <div className="flex flex-col gap-3">
          {monthBars.filter((b) => b.count > 0).map(({ mood, count, pct }) => {
            const m = getMood(mood)
            return (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-xl w-7 text-center">{m.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className={`font-semibold ${m.textClass}`}>{m.label}</span>
                    <span>{count} {count === 1 ? 'יום' : 'ימים'}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${m.bgClass} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-8 text-left">{pct}%</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-300 mt-3 text-left">
          סה"כ {month.length} ימים מתועדים
        </p>
      </div>

      {/* Total entries */}
      <div className="bg-gradient-to-l from-coral-500 to-pink-400 rounded-3xl p-5 text-white text-center shadow-md">
        <p className="text-sm opacity-80 mb-1">סך הכל רשומות</p>
        <p className="text-4xl font-bold">{entries.length}</p>
        <p className="text-sm opacity-70 mt-1">ימים מתועדים 🌷</p>
      </div>
    </div>
  )
}
