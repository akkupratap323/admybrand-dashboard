"use client"

import React, { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollAnimation, useProgressiveLoading } from "@/lib/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface ScrollExpansionProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
  delay?: number
  duration?: number
  threshold?: number
  triggerOnce?: boolean
  stagger?: boolean
  staggerDelay?: number
}

export function ScrollExpansion({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  stagger = false,
  staggerDelay = 0.1
}: ScrollExpansionProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay
  })

  const getAnimationVariants = () => {
    const baseTransition = {
      duration,
      ease: [0.25, 0.1, 0.25, 1.0] // Custom easing
    }

    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        }
      case "down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        }
      case "left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        }
      case "right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: baseTransition }
        }
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        }
      default:
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        }
    }
  }

  const variants = getAnimationVariants()

  if (stagger && React.Children.count(children) > 1) {
    return (
      <div ref={elementRef as React.RefObject<HTMLDivElement>} className={cn("overflow-hidden", className)}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={{
              hidden: variants.hidden,
              visible: {
                ...variants.visible,
                transition: {
                  ...variants.visible.transition,
                  delay: index * staggerDelay
                }
              }
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </motion.div>
  )
}

// Progressive content expansion component
interface ProgressiveExpansionProps {
  stages: Array<{
    content: ReactNode
    delay?: number
    className?: string
  }>
  className?: string
  stageDelay?: number
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
}

export function ProgressiveExpansion({
  stages,
  className,
  stageDelay = 300,
  direction = "up"
}: ProgressiveExpansionProps) {
  const { elementRef, currentStage, isVisible } = useProgressiveLoading(
    stages.length,
    stageDelay
  )

  const getStageVariants = (stageIndex: number) => {
    const baseTransition = {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
      delay: (stages[stageIndex]?.delay || 0) / 1000
    }

    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 30, height: 0 },
          visible: { 
            opacity: 1, 
            y: 0, 
            height: "auto",
            transition: baseTransition 
          }
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9, height: 0 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            height: "auto",
            transition: baseTransition 
          }
        }
      default:
        return {
          hidden: { opacity: 0, y: 30, height: 0 },
          visible: { 
            opacity: 1, 
            y: 0, 
            height: "auto",
            transition: baseTransition 
          }
        }
    }
  }

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={cn("space-y-4", className)}>
      <AnimatePresence>
        {stages.map((stage, index) => {
          const shouldShow = isVisible && currentStage >= index
          
          return (
            <motion.div
              key={index}
              initial="hidden"
              animate={shouldShow ? "visible" : "hidden"}
              exit="hidden"
              variants={getStageVariants(index)}
              className={cn("overflow-hidden", stage.className)}
            >
              {stage.content}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Content reveal component with scroll progress
interface ScrollRevealProps {
  children: ReactNode
  className?: string
  revealHeight?: number
  showProgress?: boolean
}

export function ScrollReveal({
  children,
  className,
  revealHeight = 200,
  showProgress = false
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: false
  })

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn("relative overflow-hidden", className)}
      initial={{ height: revealHeight }}
      animate={{
        height: isVisible ? "auto" : revealHeight,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      }}
    >
      {showProgress && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-10"
          initial={{ width: "0%" }}
          animate={{
            width: isVisible ? "100%" : "0%",
            transition: { duration: 0.8, delay: 0.2 }
          }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{
          opacity: isVisible ? 1 : 0.7,
          transition: { duration: 0.6 }
        }}
      >
        {children}
      </motion.div>
      
      {!isVisible && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: isVisible ? 0 : 1 }}
        />
      )}
    </motion.div>
  )
}

// Expandable card component
interface ExpandableCardProps {
  title: string
  preview: ReactNode
  expandedContent: ReactNode
  className?: string
  expandOnScroll?: boolean
  icon?: ReactNode
}

export function ExpandableCard({
  title,
  preview,
  expandedContent,
  className,
  expandOnScroll = true,
  icon
}: ExpandableCardProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: false
  })

  const isExpanded = expandOnScroll ? isVisible : false

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
      layout
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          <motion.h3
            className="text-lg font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {preview}
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ 
                opacity: 1, 
                height: "auto", 
                marginTop: 16,
                transition: {
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0, 
                marginTop: 0,
                transition: { duration: 0.4 }
              }}
              className="overflow-hidden"
            >
              {expandedContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}