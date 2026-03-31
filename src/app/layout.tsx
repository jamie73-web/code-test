import type { Metadata } from 'next'
import { QueryProvider } from '@/components/QueryProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'ER CareView — Patient Registration',
  description: 'Patient registration form for ER CareView dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
