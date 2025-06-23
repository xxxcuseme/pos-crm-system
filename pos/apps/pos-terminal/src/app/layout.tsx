import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POS Terminal',
  description: 'Point of Sale Terminal for CRM system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-2">
            <h1 className="text-lg font-bold">POS Terminal</h1>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
} 