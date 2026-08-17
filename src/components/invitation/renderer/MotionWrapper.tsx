import React from 'react'
import { motion } from 'framer-motion'
import type { AnimationConfig } from '../../../lib/invitation/types'

interface MotionWrapperProps {
  config?: AnimationConfig
  children: React.ReactNode
  className?: string
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({ config, children, className }) => {
  if (!config) return <div className={className}>{children}</div>

  const variants = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    'fade-up': { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
    'fade-down': { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
    slide: { initial: { x: -100 }, animate: { x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    'blur-reveal': { initial: { opacity: 0, filter: 'blur(10px)' }, animate: { opacity: 1, filter: 'blur(0px)' } },
  }

  const variant = variants[config.type as keyof typeof variants] || variants.fade

  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: config.duration / 1000,
        delay: config.delay / 1000,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default MotionWrapper
