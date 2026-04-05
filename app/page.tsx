'use client'

import { useState, useEffect } from 'react'
import MoodSelector from '@/components/MoodSelector'
import { MoodKey } from '@/lib/types'
import { getTodayEntry, upsertEntry } from '@/lib/supabase'
import { getMood } from '@/lib/moods'

function todayHebrew(): string {
  return new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [existingId, setExistingId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savedMood, setSavedMood] = useState<MoodKey | null>(null)
  const [savedNote, setSavedNote] = useState<string | null>(null)
  const [checkingExisting, setCheckingExisting] = useState(true)

  // Load today's existing entry on mount
  useEffect(() => {
    getTodayEntry()
      .then((entry) => {
        if (entry) {
          setExistingId(entry.id)
          setSavedMood(entry.mood)
          setSavedNote(entry.note)
        }
      })
      .catch(console.error)
      .finally(() => setCheckingExisting(false))
  }, [])

  function startEditing() {
    setSelectedMood(savedMood)
    setNote(savedNote ?? '')
    setIsEditing(true)
    setStatus('idle')
  }

  async function handleSave() {
    if (!selectedMood) return
    setStatus('loading')
    try {
      const entry = await upsertEntry(selectedMood, note.trim() || null)
      setExistingId(entry.id)
      setSavedMood(entry.mood)
      setSavedNote(entry.note)
      setIsEditing(false)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (checkingExisting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-5xl animate-pulse">🌸</span>
      </div>
    )
  }

  // ── Today already logged — show summary (not editing) ───────────────────
  if (savedMood && !isEditing) {
    const m = getMood(savedMood)
    return (
      <div className="flex flex-col gap-6" dir="rtl">
        <header>
          <p className="text-sm text-gray-400">{todayHebrew()}</p>
          <h1 className="text-2xl font-bold text-gray-700 mt-1">שלום! 🌸</h1>
        </header>

        {/* Today's mood card */}
        <div className={`rounded-3xl p-6 ${m.lightBgClass} border-2 ${m.borderClass} shadow-sm`}>
          <p className="text-sm font-semibold text-gray-400 mb-3">המצב רוח של שרון היום</p>
          <div className="flex items-center gap-4">
            <span className="text-7xl">{m.emoji}</span>
            <div>
              <p className={`text-3xl font-bold ${m.textClass}`}>{m.label}</p>
              {savedNote && (
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{savedNote}</p>
              )}
            </div>
          </div>
        </div>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-green-600 font-semibold">✅ נשמר בהצלחה!</p>
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={startEditing}
          className="w-full py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold text-lg
            bg-white active:scale-98 transition-all touch-manipulation"
        >
          ✏️ עריכה
        </button>

        {/* Encouragement */}
        <div className="text-center text-gray-400 text-sm py-4">
          <p>תודה שרשמת היום! 💕</p>
        </div>
      </div>
    )
  }

  // ── New entry form (or editing) ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <header>
        <p className="text-sm text-gray-400">{todayHebrew()}</p>
        <h1 className="text-2xl font-bold text-gray-700 mt-1">
          {isEditing ? '✏️ עריכה' : 'איך שרון מרגישה היום?'}
        </h1>
      </header>

      {/* Mood selector */}
      <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

      {/* Note textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-500">
          הערה (לא חובה)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="כתבי משהו אם בא לך..."
          rows={3}
          maxLength={300}
          className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 text-gray-700
            text-base resize-none outline-none leading-relaxed
            focus:border-coral-400 focus:ring-4 focus:ring-coral-400/20
            transition-all placeholder:text-gray-300"
        />
        <p className="text-xs text-gray-300 text-left">{note.length}/300</p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!selectedMood || status === 'loading'}
        className={`
          w-full py-5 rounded-2xl text-white text-xl font-bold shadow-md
          transition-all active:scale-98 touch-manipulation
          ${selectedMood && status !== 'loading'
            ? 'bg-coral-500 hover:bg-coral-600 active:bg-coral-600 shadow-coral-400/40'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }
        `}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin text-lg">⏳</span> שומר...
          </span>
        ) : isEditing ? (
          '💾 שמירה'
        ) : (
          '✅ שמירה'
        )}
      </button>

      {isEditing && (
        <button
          onClick={() => { setIsEditing(false); setSelectedMood(null); setNote('') }}
          className="w-full py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold
            bg-white active:scale-98 transition-all touch-manipulation"
        >
          ביטול
        </button>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-500 font-semibold">⚠️ משהו השתבש. נסי שוב.</p>
        </div>
      )}

      {/* Prompt hint */}
      {!selectedMood && (
        <p className="text-center text-gray-400 text-sm">
          בחרי איקון כדי לשמור 👆
        </p>
      )}
    </div>
  )
}
