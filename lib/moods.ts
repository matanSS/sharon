import { MoodKey } from './types'

export interface MoodConfig {
  key: MoodKey
  emoji: string
  label: string
  bgClass: string          // Tailwind bg-* for selected/card state
  lightBgClass: string     // Tailwind bg-* for subtle backgrounds
  borderClass: string
  textClass: string
  ringClass: string
  hex: string              // for inline styles if needed
}

export const MOODS: MoodConfig[] = [
  {
    key: 'happy',
    emoji: '😊',
    label: 'שמחה',
    bgClass: 'bg-yellow-400',
    lightBgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-400',
    textClass: 'text-yellow-700',
    ringClass: 'ring-yellow-400',
    hex: '#FACC15',
  },
  {
    key: 'neutral',
    emoji: '😐',
    label: 'סבבה',
    bgClass: 'bg-slate-300',
    lightBgClass: 'bg-slate-50',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-600',
    ringClass: 'ring-slate-300',
    hex: '#CBD5E1',
  },
  {
    key: 'sad',
    emoji: '😢',
    label: 'עצובה',
    bgClass: 'bg-sky-300',
    lightBgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    textClass: 'text-sky-700',
    ringClass: 'ring-sky-300',
    hex: '#7DD3FC',
  },
  {
    key: 'angry',
    emoji: '😠',
    label: 'כועסת',
    bgClass: 'bg-rose-400',
    lightBgClass: 'bg-rose-50',
    borderClass: 'border-rose-400',
    textClass: 'text-rose-700',
    ringClass: 'ring-rose-400',
    hex: '#FB7185',
  },
  {
    key: 'frustrated',
    emoji: '😤',
    label: 'מתוסכלת',
    bgClass: 'bg-orange-400',
    lightBgClass: 'bg-orange-50',
    borderClass: 'border-orange-400',
    textClass: 'text-orange-700',
    ringClass: 'ring-orange-400',
    hex: '#FB923C',
  },
  {
    key: 'overwhelmed',
    emoji: '🤯',
    label: 'מוצפת',
    bgClass: 'bg-purple-400',
    lightBgClass: 'bg-purple-50',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-700',
    ringClass: 'ring-purple-400',
    hex: '#C084FC',
  },
]

export function getMood(key: MoodKey): MoodConfig {
  return MOODS.find((m) => m.key === key)!
}
