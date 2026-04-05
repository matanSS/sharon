'use client'

import { useState, useEffect } from 'react'
import HistoryList from '@/components/HistoryList'
import { getRecentEntries } from '@/lib/supabase'
import { MoodEntry } from '@/lib/types'

export default function HistoryPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentEntries(90)
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <header>
        <h1 className="text-2xl font-bold text-gray-700">📅 היסטוריה</h1>
        <p className="text-sm text-gray-400 mt-1">הרשומות האחרונות</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-4xl animate-pulse">📅</span>
        </div>
      ) : (
        <HistoryList entries={entries} />
      )}
    </div>
  )
}
