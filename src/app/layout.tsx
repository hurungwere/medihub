import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediHub — Healthcare Procurement Marketplace',
  description: 'The fastest way for healthcare providers to find trusted medical suppliers. Connect clinics, hospitals, and pharmacies with verified medical equipment and pharmaceutical distributors.',
  keywords: 'healthcare procurement, medical suppliers, hospital procurement, medical tenders, pharmaceutical distributors, medical equipment',
  openGraph: {
    title: 'MediHub — Healthcare Procurement Marketplace',
    description: 'Connecting Healthcare Demand With Trusted Supply.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
