import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CharityFlow — Nonprofit Operating System',
  description: 'The all-in-one platform that replaces 6+ tools for small nonprofits. Manage finances, compliance, donors, events, and board governance — all in plain language.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
