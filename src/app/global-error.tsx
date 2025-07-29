"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-md mx-auto"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600">
              Application Error
            </h1>
            <p className="text-gray-600">
              Something went wrong with the application. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </body>
    </html>
  )
}