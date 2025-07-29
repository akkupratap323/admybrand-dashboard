import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: "ADmyBRAND Insights",
    template: "%s | ADmyBRAND Insights"
  },
  description: "Professional analytics dashboard for digital marketing agencies with real-time insights and advanced reporting",
  keywords: ["analytics", "dashboard", "marketing", "insights", "business intelligence"],
  authors: [{ name: "ADmyBRAND Team" }],
  creator: "ADmyBRAND",
  publisher: "ADmyBRAND",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://admybrand-dashboard.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ADmyBRAND Insights",
    description: "Professional analytics dashboard for digital marketing agencies",
    url: 'https://admybrand-dashboard.vercel.app',
    siteName: "ADmyBRAND Insights",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ADmyBRAND Insights",
    description: "Professional analytics dashboard for digital marketing agencies",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}