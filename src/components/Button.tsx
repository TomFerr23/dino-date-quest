import React from 'react'
import { motion } from 'framer-motion'
export default function Button({ className='', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <motion.button whileTap={{scale:0.98}} {...props} className={"bg-blush text-white px-5 py-2 rounded-2xl shadow-soft hover:opacity-90 "+className} />
}
