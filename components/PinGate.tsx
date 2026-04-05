'use client'

import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'matzbaruach_auth'
const CORRECT_PIN = process.env.NEXT_PUBLIC_APP_PIN ?? ''

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null)
  const [digits, setDigits] = useState(['', '', '', ''])
  const [shake, setShake] = useState(false)
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    // If no PIN configured, skip gate
    if (!CORRECT_PIN) {
      setVerified(true)
      return
    }
    const stored = sessionStorage.getItem(STORAGE_KEY)
    setVerified(stored === 'true')
  }, [])

  function handleDigit(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)

    if (char && index < 3) {
      refs[index + 1].current?.focus()
    }

    // Auto-check when 4 digits entered
    if (char && index === 3) {
      const pin = [...next.slice(0, 3), char].join('')
      checkPin(pin, next)
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus()
    }
  }

  function checkPin(pin: string, currentDigits: string[]) {
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setVerified(true)
    } else {
      setShake(true)
      setDigits(['', '', '', ''])
      setTimeout(() => {
        setShake(false)
        refs[0].current?.focus()
      }, 600)
    }
  }

  if (verified === null) return null // Loading

  if (verified) return <>{children}</>

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-6 gap-8">
      {/* Icon */}
      <div className="text-7xl">🌸</div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">perfectMood</h1>
        <p className="text-lg text-gray-500">הכניסי קוד כניסה</p>
      </div>

      {/* PIN boxes */}
      <div
        className={`flex gap-4 flex-row-reverse ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'wiggle 0.4s ease-in-out' } : {}}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-16 h-16 text-center text-2xl font-bold rounded-2xl border-2
              border-coral-400 bg-white shadow-sm outline-none
              focus:ring-4 focus:ring-coral-400/40 focus:border-coral-500
              transition-all ${shake ? 'border-rose-500 bg-rose-50' : ''}`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 text-center">
        שאלי את מתן אם שכחת את הקוד 😊
      </p>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
