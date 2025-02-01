import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'docQuickMed',
  description: 'Connect with doctors and book appointments instantly',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
