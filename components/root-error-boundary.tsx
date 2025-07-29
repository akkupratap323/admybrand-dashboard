"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"

export function RootErrorBoundary({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo)
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  )
}