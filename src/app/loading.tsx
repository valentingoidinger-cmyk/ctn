'use client'

import { motion } from 'framer-motion'
import { Moon } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        {/* Animated moon icon */}
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.95, 1, 0.95]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <Moon className="w-10 h-10 text-[var(--accent)]" />
        </motion.div>

        {/* Logo text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-white tracking-tight"
        >
          color the night
        </motion.h1>

        {/* Loading bar */}
        <div className="mt-6 w-32 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '50%' }}
            />
        </div>
      </div>
    </div>
  )
}
