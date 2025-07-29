import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
    delay = 0
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true)
              if (triggerOnce) {
                setHasTriggered(true)
              }
            }, delay)
          } else {
            setIsVisible(true)
            if (triggerOnce) {
              setHasTriggered(true)
            }
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered])

  return { elementRef, isVisible }
}

// Hook for progressive loading with stages
export function useProgressiveLoading(stages: number = 3, stageDelay: number = 200) {
  const [currentStage, setCurrentStage] = useState(0)
  const { elementRef, isVisible } = useScrollAnimation()

  useEffect(() => {
    if (isVisible && currentStage < stages) {
      const timer = setInterval(() => {
        setCurrentStage(prev => {
          if (prev >= stages - 1) {
            clearInterval(timer)
            return prev
          }
          return prev + 1
        })
      }, stageDelay)

      return () => clearInterval(timer)
    }
  }, [isVisible, currentStage, stages, stageDelay])

  return { elementRef, currentStage, isVisible }
}

// Hook for scroll progress within an element
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            const rect = element.getBoundingClientRect()
            const elementHeight = rect.height
            const viewportHeight = window.innerHeight
            
            // Calculate how much of the element has been scrolled through
            const scrolled = Math.max(0, viewportHeight - rect.top)
            const progress = Math.min(scrolled / elementHeight, 1)
            
            setScrollProgress(progress)
          }

          window.addEventListener('scroll', handleScroll, { passive: true })
          handleScroll() // Initial calculation

          return () => {
            window.removeEventListener('scroll', handleScroll)
          }
        }
      },
      { threshold: 0 }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  return { elementRef, scrollProgress }
}