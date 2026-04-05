'use client'

import { useState } from 'react'
import { MoodEntry } from '@/lib/types'
import { getMood } from '@/lib/moods'

interface Props {
  entries: MoodEntry[]
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function groupByMonth(entries: MoodEntry[]): Record<string, MoodEntry[]> {
  const groups: Record<string, MoodEntry[]> = {}
  for (const e of entries) {
    const [year, month] = e.date.split('-')
    const key = `${year}-${month}`
    if (!groups[key]) groups[key] = []
    groups[key].push(e)
  }
  return groups
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
}

export default function HistoryList({ entries }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span className="text-6xl">📭</span>
        <p className="text-gray-500 text-lg">עדיין אין רשומות</p>
        <p className="text-gray-400 text-sm">התחילי לרשום את המצב רוח כדי לראות את ההיסטוריה</p>
      </div>
    )
  }

  const groups = groupByMonth(entries)

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {Object.entries(groups).map(([monthKey, monthEntries]) => (
        <section key={monthKey}>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
            {monthLabel(monthKey)}
          </h2>
          <div className="flex flex-col gap-2">
            {monthEntries.map((entry) => {
              const m = getMood(entry.mood)
              const isOpen = expanded === entry.id

              return (
                <button
                  key={entry.id}
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  className={`
                    w-full text-right rounded-2xl p-4 border-2 transition-all
                    ${m.lightBgClass} ${m.borderClass}
                    active:scale-98 touch-manipulation
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{m.emoji}</span>
                      <div>
                        <p className={`font-bold text-base ${m.textClass}`}>{m.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    {entry.note && (
                      <span className="text-gray-400 text-lg">{isOpen ? '▲' : '▼'}</span>
                    )}
                  </div>

                  {isOpen && entry.note && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {entry.note}
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
