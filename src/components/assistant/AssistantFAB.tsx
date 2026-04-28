'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface AssistantFABProps {
  onClick: () => void
  isActive?: boolean
}

export function AssistantFAB({ onClick, isActive = false }: AssistantFABProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3"
          >
            <div className="bg-popover text-popover-foreground px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border">
              Asistente
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg
          ${isActive
            ? 'bg-indigo-600 text-white'
            : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500'
          }
        `}
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>
    </div>
  )
}