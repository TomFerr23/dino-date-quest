import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type ButtonProps = HTMLMotionProps<'button'> & {
  className?: string
}

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
