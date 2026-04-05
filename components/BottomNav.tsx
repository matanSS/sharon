'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',         label: 'היום',    icon: '🏠' },
  { href: '/history',  label: 'היסטוריה', icon: '📅' },
  { href: '/stats',    label: 'סטטיסטיקה', icon: '📊' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dir="rtl"
    >
      <div className="flex justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center gap-1
                py-3 flex-1 transition-colors
                ${active ? 'text-coral-500' : 'text-gray-400'}
              `}
            >
              <span className={`text-2xl ${active ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </span>
              <span className={`text-xs font-semibold ${active ? 'text-coral-500' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-10 h-0.5 bg-coral-500 rounded-t-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
