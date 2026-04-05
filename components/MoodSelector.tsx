'use client'

import { useState } from 'react'
import { MOODS } from '@/lib/moods'
import { MoodKey } from '@/lib/types'

interface Props {
  selected: MoodKey | null
  onSelect: (mood: MoodKey) => void
}

export default function MoodSelector({ selected, onSelect }: Props) {
  const [popped, setPopped] = useState<MoodKey | null>(null)

  function handleTap(key: MoodKey) {
    setPopped(key)
    onSelect(key)
    setTimeout(() => setPopped(null), 300)
  }

  return (
    <div className="grid grid-cols-3 gap-4 w-full" dir="rtl">
      {MOODS.map((m) => {
        const isSelected = selected === m.key
        const isPopped = popped === m.key
        return (
          <button
            key={m.key}
            onClick={() => handleTap(m.key)}
            className={`
              relative flex flex-col items-center justify-center
              rounded-3xl py-5 gap-2
              border-2 transition-all duration-200 select-none
              active:scale-95 touch-manipulation
              ${isSelected
                ? `${m.bgClass} ${m.borderClass} shadow-lg scale-105`
                : `bg-white ${m.borderClass} shadow-sm hover:scale-105`
              }
              ${isPopped ? 'scale-110' : ''}
            `}
            style={isSelected ? { borderWidth: '2.5px' } : {}}
            aria-label={m.label}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 text-xs text-white bg-white/40 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                ✓
              </span>
            )}
            <span className="text-5xl leading-none">{m.emoji}</span>
            <span
              className={`text-base font-bold ${
                isSelected ? 'text-white' : m.textClass
              }`}
            >
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
