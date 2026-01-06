'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-900/20 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl mb-6">⚠️</div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Something went wrong
          </h2>
          
          <p className="text-gray-400 text-lg mb-8">
            We hit a snag. Don't worry, it happens to the best of bands.
          </p>

          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-full transition-all shadow-lg"
            >
              Try Again
            </motion.button>
            
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-all"
            >
              Go Home
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
