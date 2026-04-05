import type { Metadata, Viewport } from 'next'
import './globals.css'
import PinGate from '@/components/PinGate'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'perfectMood 🌸',
  description: 'מעקב מצב רוח יומי',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'perfectMood',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FF6B6B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PinGate>
          {/* Page content */}
          <main className="max-w-md mx-auto px-4 pt-6 pb-28">
            {children}
          </main>
          <BottomNav />
        </PinGate>
      </body>
    </html>
  )
}
