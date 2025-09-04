import React from 'react'
import { motion } from 'framer-motion'

// Take the actual prop type of motion.button, then omit React's HTML drag handlers
type MotionButtonProps = React.ComponentProps<typeof motion.button>
type ButtonProps = Omit<
  MotionButtonProps,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onDragEnter' | 'onDragLeave'
> & { className?: string }

export default function Button({
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={
        `inline-flex items-center justify-center rounded-xl px-4 py-2
         bg-dino text-white shadow-soft
         disabled:opacity-50 disabled:pointer-events-none ` + className
      }
      {...props}
    >
      {children}
    </motion.button>
  )
}
