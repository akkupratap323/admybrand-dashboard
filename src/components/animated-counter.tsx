"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  separator?: string
  decimals?: number
  className?: string
  trigger?: boolean
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  decimals = 0,
  className = "",
  trigger = true
}: AnimatedCounterProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  })

  const spring = useSpring(from, { 
    stiffness: 100, 
    damping: 30,
    mass: 1
  })

  const display = useTransform(spring, (current) => {
    const num = current.toFixed(decimals)
    const parts = num.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return prefix + parts.join('.') + suffix
  })

  useEffect(() => {
    if ((trigger && isVisible) || (!trigger && !hasStarted)) {
      const timer = setTimeout(() => {
        setHasStarted(true)
        spring.set(to)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, trigger, hasStarted, to, spring, delay])

  return (
    <motion.span
      ref={elementRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  )
}

// Progress bar component that fills based on scroll
interface ScrollProgressBarProps {
  className?: string
  height?: string
  backgroundColor?: string
  fillColor?: string
  showPercentage?: boolean
}

export function ScrollProgressBar({
  className = "",
  height = "h-2",
  backgroundColor = "bg-muted",
  fillColor = "bg-primary",
  showPercentage = false
}: ScrollProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`relative w-full ${height} ${backgroundColor} rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`${height} ${fillColor} rounded-full`}
        initial={{ width: "0%" }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  )
}

// Floating elements that move based on scroll
interface FloatingElementProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function FloatingElement({
  children,
  speed = 0.5,
  direction = "up",
  className = ""
}: FloatingElementProps) {
  const [scrollY, setScrollY] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const scrolled = window.scrollY
        setScrollY(scrolled * speed)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(-${scrollY}px)`
      case "down":
        return `translateY(${scrollY}px)`
      case "left":
        return `translateX(-${scrollY}px)`
      case "right":
        return `translateX(${scrollY}px)`
      default:
        return `translateY(-${scrollY}px)`
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ transform: getTransform() }}
    >
      {children}
    </div>
  )
}

// Text that types out as it comes into view
interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  cursor?: boolean
}

export function TypewriterText({
  text,
  speed = 100,
  delay = 0,
  className = "",
  cursor = true
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(cursor)
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: true
  })

  useEffect(() => {
    if (isVisible) {
      let currentIndex = 0
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayText(text.slice(0, currentIndex))
            currentIndex++
          } else {
            clearInterval(interval)
            if (cursor) {
              setTimeout(() => setShowCursor(false), 1000)
            }
          }
        }, speed)

        return () => clearInterval(interval)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, text, speed, delay, cursor])

  return (
    <span ref={elementRef} className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  )
}